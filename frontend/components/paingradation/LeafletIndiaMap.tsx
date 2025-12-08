'use client';

import { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Category colors and icons
const categoryConfig = {
  weather: { color: '#3b82f6', icon: '🌧️', label: 'Weather & Environment' },
  infrastructure: { color: '#f97316', icon: '🚧', label: 'Infrastructure & Traffic' },
  socioPolitical: { color: '#ef4444', icon: '⚠️', label: 'Socio-Political & Security' },
  operational: { color: '#22c55e', icon: '👥', label: 'Operational & Human' },
};

// Tier colors
const tierConfig = {
  tier1: { color: '#8b5cf6', label: 'Tier 1' },
  tier2: { color: '#06b6d4', label: 'Tier 2' },
  tier3: { color: '#f59e0b', label: 'Tier 3' },
};

// Create a single location marker showing ONLY ONE category with tier color
const createLocationMarker = (category: string, tier: string) => {
  const tierInfo = tierConfig[tier as keyof typeof tierConfig];
  const tierNumber = tier.replace('tier', '');
  const cat = categoryConfig[category as keyof typeof categoryConfig];
  
  if (!cat) return L.divIcon({ className: 'custom-marker', html: '📍', iconSize: [20, 20] });
  
  // Create marker showing only ONE category
  const iconHtml = `
    <div style="
      position: relative;
      display: inline-block;
    ">
      <!-- Outer tier-colored circle (main visual) -->
      <div style="
        background-color: ${tierInfo?.color || '#666'};
        border-radius: 50%;
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        border: 3px solid white;
        position: relative;
      ">
        <!-- Inner circle showing the single category -->
        <div style="
          background-color: ${cat.color};
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        ">
          ${cat.icon}
        </div>
        
        <!-- Tier number badge -->
        <div style="
          position: absolute;
          bottom: -4px;
          right: -4px;
          background-color: ${tierInfo?.color || '#666'};
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${tierNumber}
        </div>
      </div>
    </div>
  `;
  
  return L.divIcon({
    className: 'custom-location-marker',
    html: iconHtml,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
};

interface MapDataPoint {
  'hc-key': string;
  value: number;
  name: string;
  color?: string;
  tiers?: string[];
  categories?: string[];
  dominantTier?: string | null;
  dominantCategory?: string | null;
  colorType?: 'tier' | 'category';
  disruptionCount?: number;
  lat?: number;
  lon?: number;
}

interface PincodeData {
  pincode: string;
  placeName: string;
  city: string;
  disruptions: number;
  coordinates: { lat: number; lon: number };
}

interface LocationData {
  id: string;
  pincode: string;
  placeName: string;
  city: string;
  state: string;
  stateCode: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  categories: string[];
  disruptions: number;
  coordinates?: { lat: number; lon: number };
  primaryCategory?: string; // Used internally to store the primary category for marker display
}

interface StateDisruptionData {
  code: string;
  name: string;
  disruptions: number;
}

interface LeafletIndiaMapProps {
  data: MapDataPoint[];
  onStateClick: (stateCode: string, stateName: string) => void;
  selectedState: string | null;
  drillDownLevel: 'state' | 'pincode';
  selectedStateData: StateDisruptionData | null;
  pincodeData: PincodeData[];
  filteredLocations: LocationData[];
  selectedCategories: string[];
  selectedTiers: string[];
  locationToZoom: LocationData | null;
}

// India states GeoJSON (simplified - you can use a more detailed one)
const indiaStatesGeoJSON = {
  type: 'FeatureCollection',
  features: [
    // This is a placeholder - in production, use a proper India GeoJSON file
    // You can download from: https://github.com/geohacker/india
    {
      type: 'Feature',
      properties: { 'hc-key': 'in-mh', name: 'Maharashtra' },
      geometry: { type: 'Polygon', coordinates: [[[72.5, 15.5], [80.5, 15.5], [80.5, 22.0], [72.5, 22.0], [72.5, 15.5]]] }
    },
    // Add more states as needed
  ]
};

// Reset Zoom Control Component
function ResetZoomControl() {
  const map = useMap();
  const [isZoomed, setIsZoomed] = useState(false);

  // Track zoom level changes
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();
      const originalZoom = 5;
      const originalCenter: [number, number] = [20.5937, 78.9629]; // Center of India
      
      // Check if we're at the original view
      const isAtOriginal = 
        Math.abs(currentZoom - originalZoom) < 0.5 &&
        currentCenter.distanceTo(originalCenter) < 100000; // ~100km tolerance
      
      setIsZoomed(!isAtOriginal);
    };

    map.on('zoomend', handleZoomEnd);
    map.on('moveend', handleZoomEnd);
    
    // Initial check
    handleZoomEnd();

    return () => {
      map.off('zoomend', handleZoomEnd);
      map.off('moveend', handleZoomEnd);
    };
  }, [map]);

  const resetZoom = () => {
    map.setView([20.5937, 78.9629], 5, {
      animate: true,
      duration: 0.5,
    });
    setIsZoomed(false);
  };

  if (!isZoomed) return null;

  return (
    <div className="leaflet-top leaflet-right" style={{ top: '10px', right: '10px', zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={resetZoom}
          className="leaflet-control-zoom-in"
          style={{
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            fontSize: '18px',
            backgroundColor: '#ffffff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
          }}
          title="Reset to original view"
        >
          <span style={{ fontSize: '16px' }}>⌂</span>
        </button>
      </div>
    </div>
  );
}

// Component to handle map updates
function MapUpdater({ 
  data, 
  onStateClick, 
  selectedState,
  drillDownLevel,
  pincodeData,
  filteredLocations,
  selectedCategories,
  selectedTiers,
  locationToZoom
}: {
  data: MapDataPoint[];
  onStateClick: (stateCode: string, stateName: string) => void;
  selectedState: string | null;
  drillDownLevel: 'state' | 'pincode';
  pincodeData: PincodeData[];
  filteredLocations: LocationData[];
  selectedCategories: string[];
  selectedTiers: string[];
  locationToZoom: LocationData | null;
}) {
  const map = useMap();
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const locationMarkersRef = useRef<L.LayerGroup | null>(null);
  const highlightAreaRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    // Load India GeoJSON from a CDN or local file
    const loadIndiaGeoJSON = async () => {
      const geoJsonSources = [
        'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson',
        'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States.json',
      ];
      
      let geoJsonData = null;
      let lastError = null;
      
      // Try each source
      for (const source of geoJsonSources) {
        try {
          const response = await fetch(source);
          if (response.ok) {
            geoJsonData = await response.json();
            break;
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      
      if (!geoJsonData) {
        throw lastError || new Error('Failed to load GeoJSON from all sources');
      }
      
      // Clear existing layer
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current);
      }

      // State name to code mapping
      const stateNameToCode: Record<string, string> = {
          'andaman and nicobar islands': 'in-an',
          'andhra pradesh': 'in-ap',
          'arunachal pradesh': 'in-ar',
          'assam': 'in-as',
          'bihar': 'in-br',
          'chandigarh': 'in-ch',
          'chhattisgarh': 'in-ct',
          'dadra and nagar haveli': 'in-dn',
          'daman and diu': 'in-dd',
          'delhi': 'in-dl',
          'goa': 'in-ga',
          'gujarat': 'in-gj',
          'haryana': 'in-hr',
          'himachal pradesh': 'in-hp',
          'jammu and kashmir': 'in-jk',
          'jharkhand': 'in-jh',
          'karnataka': 'in-ka',
          'kerala': 'in-kl',
          'ladakh': 'in-la',
          'lakshadweep': 'in-ld',
          'madhya pradesh': 'in-mp',
          'maharashtra': 'in-mh',
          'manipur': 'in-mn',
          'meghalaya': 'in-ml',
          'mizoram': 'in-mz',
          'nagaland': 'in-nl',
          'odisha': 'in-or',
          'puducherry': 'in-py',
          'punjab': 'in-pb',
          'rajasthan': 'in-rj',
          'sikkim': 'in-sk',
          'tamil nadu': 'in-tn',
          'telangana': 'in-tg',
          'tripura': 'in-tr',
          'uttar pradesh': 'in-up',
          'uttarakhand': 'in-uk',
          'west bengal': 'in-wb',
      };

      // Create style function - ALWAYS use neutral colors for states (city-level coloring only)
      const getStateStyle = (feature: any) => {
          const stateName = feature.properties.ST_NM || feature.properties.NAME_1 || feature.properties.name || '';
          const normalizedName = stateName.toLowerCase().trim();
          const stateCode = feature.properties['hc-key'] || stateNameToCode[normalizedName] || `in-${normalizedName.replace(/\s+/g, '-')}`;
          
          // Check if this state is selected (for highlighting only)
          const isSelected = selectedState === stateCode;

        // ALWAYS use neutral colors - ignore any tier data
        // Cities will show tier colors via markers
        return {
          fillColor: '#f8fafc', // Neutral very light gray for all states
          fillOpacity: 0.3, // Very light opacity - just to show boundaries
          color: isSelected ? '#0284c7' : '#e2e8f0', // Light gray border, blue if selected
          weight: isSelected ? 2 : 1,
          opacity: 0.8,
        };
      };

      // Create GeoJSON layer
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: getStateStyle,
        onEachFeature: (feature, layer) => {
            const stateName = feature.properties.ST_NM || feature.properties.NAME_1 || feature.properties.name || '';
            const normalizedName = stateName.toLowerCase().trim();
            const stateCode = feature.properties['hc-key'] || stateNameToCode[normalizedName] || `in-${normalizedName.replace(/\s+/g, '-')}`;
            
            const stateData = data.find(d => {
              const codeMatch = d['hc-key'] === stateCode || d['hc-key'] === `in-${normalizedName.replace(/\s+/g, '-')}`;
              const nameMatch = d.name.toLowerCase() === normalizedName;
              return codeMatch || nameMatch;
            });

            // Tooltip
            if (stateData) {
              const tierLabels: Record<string, string> = {
                'tier1': 'Tier 1',
                'tier2': 'Tier 2',
                'tier3': 'Tier 3',
              };
              const categoryLabels: Record<string, string> = {
                'weather': 'Weather & Environment',
                'infrastructure': 'Infrastructure & Traffic',
                'socioPolitical': 'Socio-Political & Security',
                'operational': 'Operational & Human',
              };

              let tooltipContent = `<b>${stateData.name}</b><br/>`;
              tooltipContent += `Statics: <b>${(stateData.disruptionCount || stateData.value || 0).toLocaleString()}</b><br/>`;
              
              if (stateData.tiers && stateData.tiers.length > 0) {
                const tierList = stateData.tiers.map(t => tierLabels[t] || t).join(', ');
                tooltipContent += `Tiers: ${tierList}<br/>`;
              }
              
              if (stateData.categories && stateData.categories.length > 0) {
                const categoryList = stateData.categories.map(c => categoryLabels[c] || c).join(', ');
                tooltipContent += `Categories: ${categoryList}`;
              }

              layer.bindTooltip(tooltipContent, {
                className: 'custom-tooltip',
                direction: 'top',
                offset: [0, -10],
              });
            }

            // Click handler
            layer.on('click', () => {
              const finalStateName = stateData?.name || stateName || 'Unknown';
              const finalStateCode = stateData?.['hc-key'] || stateCode;
              onStateClick(finalStateCode, finalStateName);
            });

            // Hover effects
            layer.on('mouseover', (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 3,
                color: '#0284c7',
                fillOpacity: 0.8,
              });
            });

          layer.on('mouseout', (e) => {
            const layer = e.target;
            const style = getStateStyle(feature);
            layer.setStyle(style);
          });
        },
      });

      geoJsonLayerRef.current = geoJsonLayer;
      geoJsonLayer.addTo(map);

      // Fit bounds to India
      if (geoJsonData.features.length > 0) {
        const bounds = geoJsonLayer.getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    if (drillDownLevel === 'state') {
      loadIndiaGeoJSON().catch((error) => {
        console.error('Failed to load India GeoJSON:', error);
        // Fallback: create a simple rectangle for India and show markers for states
        const bounds = [[6.5, 68.0], [35.5, 97.5]] as [number, number][];
        map.fitBounds(bounds);
        
        // Create markers for states with data as fallback
        const markerGroup = L.layerGroup();
        data.forEach(state => {
          // Approximate coordinates for major states (fallback)
          const stateCoords: Record<string, [number, number]> = {
            'in-mh': [19.7515, 75.7139], // Maharashtra
            'in-dl': [28.6139, 77.2090], // Delhi
            'in-ka': [12.9716, 77.5946], // Karnataka
            'in-tn': [11.1271, 78.6569], // Tamil Nadu
            'in-wb': [22.5726, 88.3639], // West Bengal
            'in-tg': [17.3850, 78.4867], // Telangana
            'in-gj': [23.0225, 72.5714], // Gujarat
            'in-rj': [26.9124, 75.7873], // Rajasthan
            'in-up': [26.8467, 80.9462], // Uttar Pradesh
            'in-mp': [22.9734, 78.6569], // Madhya Pradesh
          };
          
          const coords = stateCoords[state['hc-key']];
          if (coords) {
            const marker = L.circleMarker(coords, {
              radius: 8,
              fillColor: state.color || '#e2e8f0',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.7,
            });
            
            marker.bindTooltip(
              `<b>${state.name}</b><br/>Statics: <b>${(state.disruptionCount || state.value || 0).toLocaleString()}</b>`,
              { className: 'custom-tooltip' }
            );
            
            marker.on('click', () => {
              onStateClick(state['hc-key'], state.name);
            });
            
            marker.addTo(markerGroup);
          }
        });
        markerGroup.addTo(map);
      });
    }
  }, [data, map, selectedState, onStateClick, drillDownLevel]);

  // Handle pincode markers
  useEffect(() => {
    if (drillDownLevel === 'pincode' && pincodeData.length > 0) {
      // Clear existing markers
      if (markerGroupRef.current) {
        map.removeLayer(markerGroupRef.current);
      }

      const markerGroup = L.layerGroup();
      
      pincodeData.forEach(pin => {
        const maxDisruptions = Math.max(...pincodeData.map(p => p.disruptions), 1);
        const intensity = pin.disruptions / maxDisruptions;
        
        // Determine color based on intensity
        let color = '#0284c7';
        if (intensity < 0.2) color = '#e0f2fe';
        else if (intensity < 0.4) color = '#7dd3fc';
        else if (intensity < 0.6) color = '#38bdf8';
        else if (intensity < 0.8) color = '#0284c7';
        else color = '#0c4a6e';

        const markerSize = 6 + (intensity * 10);
        
        const marker = L.circleMarker([pin.coordinates.lat, pin.coordinates.lon], {
          radius: markerSize,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        });

        marker.bindTooltip(
          `<b>${pin.pincode} - ${pin.placeName}</b><br/>` +
          `City: ${pin.city}<br/>` +
          `Disruptions: <b>${pin.disruptions}</b>`,
          {
            className: 'custom-tooltip',
            direction: 'top',
            offset: [0, -10],
          }
        );

        marker.addTo(markerGroup);
      });

      markerGroupRef.current = markerGroup;
      markerGroup.addTo(map);

      // Fit bounds to show all markers
      if (pincodeData.length > 0) {
        const group = new L.FeatureGroup(pincodeData.map(pin => 
          L.marker([pin.coordinates.lat, pin.coordinates.lon])
        ));
        map.fitBounds(group.getBounds().pad(0.1));
      }
    } else if (markerGroupRef.current) {
      map.removeLayer(markerGroupRef.current);
      markerGroupRef.current = null;
    }
  }, [drillDownLevel, pincodeData, map]);

  // Handle location markers with category icons (state view)
  useEffect(() => {
    if (drillDownLevel === 'state' && filteredLocations.length > 0) {
      // Clear existing location markers
      if (locationMarkersRef.current) {
        map.removeLayer(locationMarkersRef.current);
      }

      const locationMarkerGroup = L.layerGroup();

      // Create a Set to track processed locations (by ID) to ensure one marker per location
      const processedLocationIds = new Set<string>();
      
      // Group locations by coordinates for offset calculation
      const coordinateGroups = new Map<string, typeof filteredLocations>();
      
      // First pass: filter and group locations
      filteredLocations.forEach(location => {
        if (!location.coordinates || !location.coordinates.lat || !location.coordinates.lon) {
          return; // Skip locations without coordinates
        }

        // Check if location tier is in selected tiers
        if (!selectedTiers.includes(location.tier)) {
          return; // Skip if tier not selected
        }

        // Filter categories based on selected categories - get ONLY THE FIRST matching category
        const visibleCategories = location.categories.filter(cat => 
          selectedCategories.includes(cat)
        );

        if (visibleCategories.length === 0) {
          return; // Skip if no matching categories
        }

        // Use ONLY THE FIRST visible category (one category per location)
        const primaryCategory = visibleCategories[0];
        
        // Create a key for grouping by coordinates (rounded to avoid floating point issues)
        const coordKey = `${Math.round(location.coordinates.lat * 1000) / 1000},${Math.round(location.coordinates.lon * 1000) / 1000}`;
        
        if (!coordinateGroups.has(coordKey)) {
          coordinateGroups.set(coordKey, []);
        }
        
        // Store location with ONLY the primary category
        coordinateGroups.get(coordKey)!.push({
          ...location,
          primaryCategory, // Store only the primary category
        });
      });

      // Second pass: Create ONE marker per location
      coordinateGroups.forEach((locations, coordKey) => {
        const [lat, lon] = coordKey.split(',').map(Number);
        
        // Create ONE marker per location (no duplicates)
        locations.forEach((location, locIndex) => {
          // Skip if this location ID was already processed
          if (processedLocationIds.has(location.id)) {
            return;
          }
          processedLocationIds.add(location.id);
          
          // Calculate offset only if multiple locations share the same coordinate
          let offsetLat = 0;
          let offsetLon = 0;
          if (locations.length > 1) {
            const angle = (locIndex * 2 * Math.PI) / locations.length;
            const radius = 0.01; // Slightly larger radius for better separation
            offsetLat = radius * Math.cos(angle);
            offsetLon = radius * Math.sin(angle);
          }
          
          const tierInfo = tierConfig[location.tier as keyof typeof tierConfig];
          
          // Create a single marker showing ONLY ONE category (the primary one)
          const icon = createLocationMarker(location.primaryCategory || location.categories[0] || 'operational', location.tier);
          
          const marker = L.marker(
            [lat + offsetLat, lon + offsetLon],
            { 
              icon,
              interactive: true,
            }
          );
          
          // Add cursor pointer style
          marker.on('add', () => {
            const element = marker.getElement();
            if (element) {
              element.style.cursor = 'pointer';
            }
          });

          // Build tooltip showing primary category
          const categoryLabels: Record<string, string> = {
            'weather': 'Weather & Environment',
            'infrastructure': 'Infrastructure & Traffic',
            'socioPolitical': 'Socio-Political & Security',
            'operational': 'Operational & Human',
          };

          const categoryKey = location.primaryCategory || location.categories[0] || 'operational';
          const primaryCat = categoryConfig[categoryKey as keyof typeof categoryConfig];

          let tooltipContent = `<b>${location.pincode} - ${location.placeName}</b><br/>`;
          tooltipContent += `<span style="color: #94a3b8;">City:</span> ${location.city}, ${location.state}<br/>`;
          tooltipContent += `<span style="color: #94a3b8;">Tier:</span> <b style="color: ${tierInfo?.color || '#666'};">${tierInfo?.label || location.tier}</b><br/>`;
          tooltipContent += `<span style="color: #94a3b8;">Category:</span> <b style="color: ${primaryCat?.color || '#666'};">${primaryCat?.label || categoryKey}</b><br/>`;
          tooltipContent += `<span style="color: #94a3b8;">Disruptions:</span> <b style="color: #0284c7;">${location.disruptions}</b>`;

          marker.bindTooltip(tooltipContent, {
            className: 'custom-tooltip',
            direction: 'top',
            offset: [0, -10],
          });

          // Add click handler to zoom and highlight the pincode area
          marker.on('click', () => {
            // Guard: ensure coordinates exist
            if (!location.coordinates) {
              return;
            }

            // Remove previous highlight if exists
            if (highlightAreaRef.current) {
              map.removeLayer(highlightAreaRef.current);
              highlightAreaRef.current = null;
            }

            // Get the location coordinates
            const locationLat = location.coordinates.lat;
            const locationLon = location.coordinates.lon;

            // Center and zoom to the location - use flyTo for smooth animation and guaranteed centering
            map.flyTo([locationLat, locationLon], 12, {
              animate: true,
              duration: 0.8,
            });

            // Wait for flyTo animation to complete before adding highlight
            let highlightAdded = false;
            const addHighlight = () => {
              if (highlightAdded) return;
              highlightAdded = true;
              
              // Create a highlighted circle around the pincode area
              const highlightRadius = 5000; // 5km in meters
              const highlightCircle = L.circle([locationLat, locationLon], {
                radius: highlightRadius,
                fillColor: tierInfo?.color || '#666',
                color: tierInfo?.color || '#666',
                weight: 3,
                opacity: 0.6,
                fillOpacity: 0.2,
                className: 'pincode-highlight-area',
              });

              // Add pulsing animation effect
              highlightCircle.on('add', () => {
                const element = highlightCircle.getElement();
                if (element && 'style' in element) {
                  (element as HTMLElement).style.animation = 'pulse 2s ease-in-out infinite';
                }
              });

              highlightCircle.addTo(map);
              highlightAreaRef.current = highlightCircle;

              // Add popup with primary category information
              const primaryCatLabel = primaryCat ? primaryCat.label : (location.primaryCategory || location.categories[0] || 'operational');
              
              const popupContent = `
                <div style="text-align: center; padding: 8px;">
                  <b style="color: ${tierInfo?.color || '#666'}; font-size: 14px;">
                    ${location.pincode} - ${location.placeName}
                  </b><br/>
                  <span style="color: #666; font-size: 12px;">
                    ${location.city}, ${location.state}
                  </span><br/>
                  <span style="color: #666; font-size: 11px;">
                    Tier: ${tierInfo?.label || location.tier} | Category: <span style="color: ${primaryCat?.color || '#666'};">${primaryCatLabel}</span>
                  </span><br/>
                  <span style="color: #666; font-size: 11px;">
                    Disruptions: ${location.disruptions}
                  </span>
                </div>
              `;
              highlightCircle.bindPopup(popupContent).openPopup();
            };

            // Listen for moveend event (triggered when flyTo completes)
            map.once('moveend', addHighlight);
            
            // Fallback timeout in case moveend doesn't fire
            setTimeout(addHighlight, 900);
          });

          marker.addTo(locationMarkerGroup);
        });
      });

      locationMarkersRef.current = locationMarkerGroup;
      locationMarkerGroup.addTo(map);
    } else if (locationMarkersRef.current) {
      map.removeLayer(locationMarkersRef.current);
      locationMarkersRef.current = null;
    }

    return () => {
      if (locationMarkersRef.current) {
        map.removeLayer(locationMarkersRef.current);
        locationMarkersRef.current = null;
      }
      // Clean up highlight area when filters change
      if (highlightAreaRef.current) {
        map.removeLayer(highlightAreaRef.current);
        highlightAreaRef.current = null;
      }
    };
  }, [drillDownLevel, filteredLocations, selectedCategories, selectedTiers, map]);

  // Handle zoom to location from sidebar click
  useEffect(() => {
    if (locationToZoom && locationToZoom.coordinates && locationToZoom.coordinates.lat && locationToZoom.coordinates.lon) {
      // Remove previous highlight if exists
      if (highlightAreaRef.current) {
        map.removeLayer(highlightAreaRef.current);
        highlightAreaRef.current = null;
      }

      const locationLat = locationToZoom.coordinates.lat;
      const locationLon = locationToZoom.coordinates.lon;
      const tierInfo = tierConfig[locationToZoom.tier as keyof typeof tierConfig];

      // Center and zoom to the location - use flyTo for smooth animation and guaranteed centering
      map.flyTo([locationLat, locationLon], 12, {
        animate: true,
        duration: 0.8,
      });

      // Prepare popup content
      const categoryLabels: Record<string, string> = {
        'weather': 'Weather & Environment',
        'infrastructure': 'Infrastructure & Traffic',
        'socioPolitical': 'Socio-Political & Security',
        'operational': 'Operational & Human',
      };

      const primaryCategory = locationToZoom.categories[0];
      const primaryCat = categoryConfig[primaryCategory as keyof typeof categoryConfig];
      const primaryCatLabel = primaryCat ? primaryCat.label : primaryCategory;

      const popupContent = `
        <div style="text-align: center; padding: 8px;">
          <b style="color: ${tierInfo?.color || '#666'}; font-size: 14px;">
            ${locationToZoom.pincode} - ${locationToZoom.placeName}
          </b><br/>
          <span style="color: #666; font-size: 12px;">
            ${locationToZoom.city}, ${locationToZoom.state}
          </span><br/>
          <span style="color: #666; font-size: 11px;">
            Tier: ${tierInfo?.label || locationToZoom.tier} | Category: <span style="color: ${primaryCat?.color || '#666'};">${primaryCatLabel}</span>
          </span><br/>
          <span style="color: #666; font-size: 11px;">
            Disruptions: ${locationToZoom.disruptions}
          </span>
        </div>
      `;

      // Wait for flyTo animation to complete before adding highlight
      let highlightAdded = false;
      const addHighlight = () => {
        if (highlightAdded) return;
        highlightAdded = true;
        
        // Create a highlighted circle around the pincode area
        const highlightRadius = 5000; // 5km in meters
        const highlightCircle = L.circle([locationLat, locationLon], {
          radius: highlightRadius,
          fillColor: tierInfo?.color || '#666',
          color: tierInfo?.color || '#666',
          weight: 3,
          opacity: 0.6,
          fillOpacity: 0.2,
          className: 'pincode-highlight-area',
        });

        // Add pulsing animation effect
        highlightCircle.on('add', () => {
          const element = highlightCircle.getElement();
          if (element && 'style' in element) {
            (element as HTMLElement).style.animation = 'pulse 2s ease-in-out infinite';
          }
        });

        highlightCircle.addTo(map);
        highlightAreaRef.current = highlightCircle;

        // Add popup with location information
        highlightCircle.bindPopup(popupContent).openPopup();
      };

      // Listen for moveend event (triggered when flyTo completes)
      map.once('moveend', addHighlight);
      
      // Fallback timeout in case moveend doesn't fire
      setTimeout(addHighlight, 900);
    }
  }, [locationToZoom, map]);

  return null;
}

export default function LeafletIndiaMapComponent({
  data,
  onStateClick,
  selectedState,
  drillDownLevel,
  selectedStateData,
  pincodeData,
  filteredLocations,
  selectedCategories,
  selectedTiers,
  locationToZoom,
}: LeafletIndiaMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    setIsClient(true);
    
    // Wait for DOM to be ready using multiple strategies
    const initializeMap = () => {
      // Use requestAnimationFrame to ensure DOM is painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMapLoaded(true);
        });
      });
    };
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // DOM is already ready
      initializeMap();
    } else {
      // Wait for DOM to be ready
      const handleLoad = () => {
        initializeMap();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);
      
      // Also try after a short delay as fallback
      setTimeout(initializeMap, 100);
      
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  if (!isClient || !mapLoaded) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-slate-50"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-sm text-slate-500">Loading map...</span>
        </div>
      </div>
    );
  }

  // Only render MapContainer when we're sure we're on client and container exists
  if (!isClient || !mapLoaded || typeof window === 'undefined') {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-slate-50"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-sm text-slate-500">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          z-index: 1;
        }
        .custom-tooltip {
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
          border-radius: 8px !important;
          color: #ffffff !important;
          font-size: 12px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        .custom-tooltip::before {
          border-top-color: #1e293b !important;
        }
        .custom-category-marker {
          background: transparent !important;
          border: none !important;
        }
        /* Location markers - make them stand out prominently */
        .custom-location-marker {
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) !important;
          z-index: 1000 !important;
        }
        /* Pincode highlight area with pulse animation */
        .pincode-highlight-area {
          pointer-events: none;
        }
        @keyframes pulse {
          0% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
        }
        .leaflet-control-zoom {
          border: 1px solid #e2e8f0 !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-control-zoom a {
          background-color: #ffffff !important;
          color: #1e293b !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #f1f5f9 !important;
        }
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          font-size: 18px !important;
          line-height: 26px !important;
        }
      `}</style>
      
      {isClient && mapLoaded && typeof window !== 'undefined' && typeof document !== 'undefined' && (
        <MapContainer
          key="leaflet-map" // Force remount on client
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          className="rounded-xl"
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      
        <MapUpdater
          data={data}
          onStateClick={onStateClick}
          selectedState={selectedState}
          drillDownLevel={drillDownLevel}
          pincodeData={pincodeData}
          filteredLocations={filteredLocations}
          selectedCategories={selectedCategories}
          selectedTiers={selectedTiers}
          locationToZoom={locationToZoom}
        />
        
        <ResetZoomControl />
        </MapContainer>
      )}

      {/* Category Icons Legend - Only show in state view */}
      {drillDownLevel === 'state' && (
        <div 
          className="absolute bottom-4 right-4 z-1000 p-3 rounded-lg shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: '#1e293b' }}>
            Category Icons
          </div>
          <div className="space-y-1.5">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: config.color,
                    border: '2px solid #ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  {config.icon}
                </div>
                <span className="text-[10px]" style={{ color: '#4a4a4a' }}>
                  {config.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

