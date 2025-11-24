"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as d3 from "d3";

export type IntentNode = {
  id: string;
  label: string;
  volume: number;
  severity: "Critical" | "High" | "Medium" | "Low";
  sentiment: number;
  x: number;
  y: number;
};

export type IntentEdge = {
  source: string;
  target: string;
  strength: number;
  coOccurrenceCount: number;
};

export type IntentNetworkData = {
  nodes: IntentNode[];
  edges: IntentEdge[];
};

interface IntentNetworkGraphProps {
  data?: IntentNetworkData;
}

const generateMockData = (): IntentNetworkData => {
  const nodes: IntentNode[] = [
    { id: "billing", label: "Billing Questions", volume: 450, severity: "High", sentiment: 3.2, x: 0, y: 0 },
    { id: "account", label: "Account Access", volume: 380, severity: "Critical", sentiment: 4.1, x: 0, y: 0 },
    { id: "payment", label: "Payment Failures", volume: 520, severity: "Critical", sentiment: 4.5, x: 0, y: 0 },
    { id: "mortgage", label: "Mortgage Rate Lock", volume: 340, severity: "High", sentiment: 3.8, x: 0, y: 0 },
    { id: "card", label: "Card Replacement", volume: 290, severity: "Medium", sentiment: 3.5, x: 0, y: 0 },
    { id: "kyc", label: "KYC Resubmission", volume: 210, severity: "Medium", sentiment: 3.7, x: 0, y: 0 },
    { id: "dispute", label: "Credit Card Dispute", volume: 410, severity: "High", sentiment: 4.2, x: 0, y: 0 },
    { id: "loan", label: "Loan Application", volume: 280, severity: "Medium", sentiment: 3.1, x: 0, y: 0 },
    { id: "rewards", label: "Rewards Redemption", volume: 150, severity: "Low", sentiment: 2.5, x: 0, y: 0 },
    { id: "transfer", label: "Wire Transfer", volume: 190, severity: "Medium", sentiment: 3.4, x: 0, y: 0 },
  ];

  const edges: IntentEdge[] = [
    { source: "billing", target: "account", strength: 0.85, coOccurrenceCount: 142 },
    { source: "payment", target: "account", strength: 0.72, coOccurrenceCount: 98 },
    { source: "card", target: "payment", strength: 0.68, coOccurrenceCount: 87 },
    { source: "kyc", target: "account", strength: 0.65, coOccurrenceCount: 76 },
    { source: "dispute", target: "billing", strength: 0.78, coOccurrenceCount: 115 },
    { source: "mortgage", target: "loan", strength: 0.58, coOccurrenceCount: 65 },
    { source: "payment", target: "dispute", strength: 0.62, coOccurrenceCount: 82 },
    { source: "transfer", target: "payment", strength: 0.55, coOccurrenceCount: 54 },
    { source: "rewards", target: "billing", strength: 0.45, coOccurrenceCount: 38 },
    { source: "card", target: "account", strength: 0.52, coOccurrenceCount: 61 },
  ];

  return { nodes, edges };
};

function getSeverityColor(severity: IntentNode["severity"]): string {
  switch (severity) {
    case "Critical": return "#EF4444";
    case "High": return "#F59E0B";
    case "Medium": return "#EAB308";
    case "Low": return "#10B981";
    default: return "#6B7280";
  }
}

function getNodeSize(volume: number): number {
  const minVolume = 150;
  const maxVolume = 600;
  const normalized = Math.max(0, Math.min(1, (volume - minVolume) / (maxVolume - minVolume)));
  return 12 + normalized * 20;
}

export function IntentNetworkGraph({ data = generateMockData() }: IntentNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<IntentNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<IntentEdge | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [stableNodes, setStableNodes] = useState<IntentNode[]>([]);
  const [stableEdges, setStableEdges] = useState<Array<IntentEdge & { sourceNode: IntentNode; targetNode: IntentNode }>>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const parent = svgRef.current.parentElement;
        setDimensions({
          width: parent.clientWidth || 800,
          height: 500,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initialize graph layout once
  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0 || isInitialized) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // Create nodes with initial positions
    const nodes: IntentNode[] = data.nodes.map((node) => ({
      ...node,
      x: Math.random() * (width - 200) + 100,
      y: Math.random() * (height - 200) + 100,
    }));

    // Create edges with node references
    const edges = data.edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return null;
      return {
        ...edge,
        sourceNode,
        targetNode,
      };
    }).filter(Boolean) as Array<IntentEdge & { sourceNode: IntentNode; targetNode: IntentNode }>;

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(edges)
          .id((d: any) => d.id)
          .distance((d: any) => 130 - d.strength * 70)
          .strength((d: any) => d.strength * 0.6)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => getNodeSize(d.volume) + 10))
      .alphaDecay(0.15)
      .velocityDecay(0.7)
      .alpha(1);

    // Run simulation until it stabilizes
    let tickCount = 0;
    simulation.on("tick", () => {
      tickCount++;
    });

    // Stop simulation after it stabilizes and save positions
    setTimeout(() => {
      simulation.stop();
      // Fix all nodes in their final positions
      nodes.forEach((node) => {
        node.x = node.x || width / 2;
        node.y = node.y || height / 2;
      });
      setStableNodes([...nodes]);
      setStableEdges(edges);
      setIsInitialized(true);
    }, 2500);
  }, [data, dimensions, isInitialized]);

  // Render stable graph
  useEffect(() => {
    if (!svgRef.current || !isInitialized || stableNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw edges first (so they appear behind nodes)
    const edgeLines = svg
      .append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(stableEdges)
      .enter()
      .append("line")
      .attr("x1", (d) => d.sourceNode.x)
      .attr("y1", (d) => d.sourceNode.y)
      .attr("x2", (d) => d.targetNode.x)
      .attr("y2", (d) => d.targetNode.y)
      .attr("stroke", "#6B7280")
      .attr("stroke-width", (d) => Math.max(1.5, d.strength * 5))
      .attr("stroke-opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        setHoveredEdge(d);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }
        d3.select(this)
          .attr("stroke-opacity", 1)
          .attr("stroke", "#9CA3AF")
          .attr("stroke-width", Math.max(2.5, d.strength * 6));
      })
      .on("mousemove", function (event) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }
      })
      .on("mouseleave", function (event, d) {
        setHoveredEdge(null);
        d3.select(this)
          .attr("stroke-opacity", 0.7)
          .attr("stroke", "#6B7280")
          .attr("stroke-width", Math.max(1.5, d.strength * 5));
      });

    // Draw nodes
    const nodeGroups = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(stableNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        setHoveredNode(d);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }
        d3.select(this).select("circle").attr("stroke-width", 3).attr("opacity", 1);
      })
      .on("mousemove", function (event) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }
      })
      .on("mouseleave", function (event, d) {
        setHoveredNode(null);
        d3.select(this).select("circle").attr("stroke-width", 2).attr("opacity", 0.9);
      });

    // Add circles
    nodeGroups
      .append("circle")
      .attr("r", (d) => getNodeSize(d.volume))
      .attr("fill", (d) => getSeverityColor(d.severity))
      .attr("stroke", "#1F2937")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);

    // Add labels
    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getNodeSize(d.volume) + 15)
      .attr("fill", "#E5E7EB")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .text((d) => d.label);
  }, [stableNodes, stableEdges, isInitialized]);

  const getSeverityLabel = (severity: IntentNode["severity"]) => {
    switch (severity) {
      case "Critical": return "🔴 Critical";
      case "High": return "🟠 High";
      case "Medium": return "🟡 Medium";
      case "Low": return "🟢 Low";
    }
  };

  return (
    <Card className="border border-white/10 bg-black/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Intent Network Graph</CardTitle>
        <CardDescription className="text-gray-400">
          Force-directed graph showing intent relationships and co-occurrence patterns. Node size = volume, color = severity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-300">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-300">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Low</span>
            </div>
            <div className="ml-4 text-xs text-gray-400">Edge thickness = co-occurrence strength</div>
          </div>

          <div className="relative">
            {!isInitialized && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10">
                <div className="text-gray-400 text-sm">Initializing graph layout...</div>
              </div>
            )}
            <svg
              ref={svgRef}
              width="100%"
              height={500}
              className="border border-white/10 rounded-lg bg-black/20"
            />

            {hoveredNode && (
              <div
                className="absolute z-20 bg-black/95 border border-white/20 rounded-lg p-3 shadow-xl max-w-xs pointer-events-none"
                style={{
                  left: `${Math.min(tooltipPos.x + 10, dimensions.width - 250)}px`,
                  top: `${Math.max(10, tooltipPos.y - 10)}px`,
                  transform: tooltipPos.y < 100 ? "translateY(0)" : "translateY(-100%)",
                }}
              >
                <div className="space-y-1 text-sm">
                  <div className="text-white font-semibold">{hoveredNode.label}</div>
                  <div className="text-gray-300 space-y-0.5">
                    <div>
                      Severity: <span style={{ color: getSeverityColor(hoveredNode.severity) }}>{getSeverityLabel(hoveredNode.severity)}</span>
                    </div>
                    <div>Volume: <span className="text-blue-400">{hoveredNode.volume}</span></div>
                    <div>Sentiment: <span className="text-purple-400">{hoveredNode.sentiment.toFixed(1)}</span></div>
                  </div>
                </div>
              </div>
            )}

            {hoveredEdge && (
              <div
                className="absolute z-20 bg-black/95 border border-white/20 rounded-lg p-3 shadow-xl max-w-xs pointer-events-none"
                style={{
                  left: `${Math.min(tooltipPos.x + 10, dimensions.width - 250)}px`,
                  top: `${Math.max(10, tooltipPos.y - 10)}px`,
                  transform: tooltipPos.y < 100 ? "translateY(0)" : "translateY(-100%)",
                }}
              >
                <div className="space-y-1 text-sm">
                  <div className="text-white font-semibold">Co-occurrence Pattern</div>
                  <div className="text-gray-300 space-y-0.5">
                    <div>Strength: <span className="text-purple-400">{(hoveredEdge.strength * 100).toFixed(0)}%</span></div>
                    <div>Co-occurrences: <span className="text-blue-400">{hoveredEdge.coOccurrenceCount}</span></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {data.nodes.find((n) => n.id === hoveredEdge.source)?.label} ↔ {data.nodes.find((n) => n.id === hoveredEdge.target)?.label}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{data.nodes.length}</div>
              <div className="text-gray-400">Total Intents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{data.edges.length}</div>
              <div className="text-gray-400">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {data.nodes.filter((n) => n.severity === "Critical").length}
              </div>
              <div className="text-gray-400">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {Math.round(data.edges.reduce((sum, e) => sum + e.strength, 0) / data.edges.length / 0.01)}%
              </div>
              <div className="text-gray-400">Avg Strength</div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 text-sm">
            <div className="text-purple-300 font-semibold mb-1">✨ Key Insight</div>
            <div className="text-gray-300">
              <strong>"Billing Questions"</strong> and <strong>"Account Access"</strong> show strong co-occurrence (85%),
              suggesting authentication-before-billing friction. Consider streamlining the authentication flow for billing inquiries.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
