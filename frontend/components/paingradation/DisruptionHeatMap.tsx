'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, ChevronDown, X, Search, Layers, ArrowLeft, RotateCcw } from 'lucide-react';
import { useTheme } from './useTheme';
import dynamic from 'next/dynamic';

// Types
type TierType = 'tier1' | 'tier2' | 'tier3';
type CategoryType = 'weather' | 'infrastructure' | 'socioPolitical' | 'operational';

interface LocationData {
  id: string;
  pincode: string;
  placeName: string;
  city: string;
  state: string;
  stateCode: string;
  tier: TierType;
  categories: CategoryType[];
  disruptions: number;
  coordinates?: { lat: number; lon: number };
  primaryCategory?: CategoryType; // Used internally to store the primary category for marker display
}

interface StateDisruptionData {
  code: string;
  name: string;
  disruptions: number;
}

interface PincodeData {
  pincode: string;
  placeName: string;
  city: string;
  disruptions: number;
  coordinates: { lat: number; lon: number };
}

interface CategoryConfig {
  id: CategoryType;
  label: string;
  color: string;
  count: number;
  percentage: number;
}

interface TierConfig {
  id: TierType;
  label: string;
  color: string;
}

// Category configurations (Total: 6,251)
const categoryConfigs: CategoryConfig[] = [
  { id: 'weather', label: 'Weather & Environment', color: '#3b82f6', count: 1563, percentage: 25 },
  { id: 'infrastructure', label: 'Infrastructure & Traffic', color: '#f97316', count: 2500, percentage: 40 },
  { id: 'socioPolitical', label: 'Socio-Political & Security', color: '#ef4444', count: 938, percentage: 15 },
  { id: 'operational', label: 'Operational & Human', color: '#22c55e', count: 1250, percentage: 20 },
];

// Tier configurations
const tierConfigs: TierConfig[] = [
  { id: 'tier1', label: 'Tier 1', color: '#8b5cf6' },
  { id: 'tier2', label: 'Tier 2', color: '#06b6d4' },
  { id: 'tier3', label: 'Tier 3', color: '#f59e0b' },
];

// State disruption data for the map
const stateDisruptionData: StateDisruptionData[] = [
  { code: 'in-jk', name: 'Jammu and Kashmir', disruptions: 890 },
  { code: 'in-hp', name: 'Himachal Pradesh', disruptions: 456 },
  { code: 'in-pb', name: 'Punjab', disruptions: 1234 },
  { code: 'in-uk', name: 'Uttarakhand', disruptions: 567 },
  { code: 'in-hr', name: 'Haryana', disruptions: 1567 },
  { code: 'in-dl', name: 'Delhi', disruptions: 2345 },
  { code: 'in-rj', name: 'Rajasthan', disruptions: 3284 },
  { code: 'in-up', name: 'Uttar Pradesh', disruptions: 4521 },
  { code: 'in-br', name: 'Bihar', disruptions: 2134 },
  { code: 'in-sk', name: 'Sikkim', disruptions: 234 },
  { code: 'in-ar', name: 'Arunachal Pradesh', disruptions: 345 },
  { code: 'in-nl', name: 'Nagaland', disruptions: 278 },
  { code: 'in-mn', name: 'Manipur', disruptions: 312 },
  { code: 'in-mz', name: 'Mizoram', disruptions: 198 },
  { code: 'in-tr', name: 'Tripura', disruptions: 267 },
  { code: 'in-ml', name: 'Meghalaya', disruptions: 345 },
  { code: 'in-as', name: 'Assam', disruptions: 1456 },
  { code: 'in-wb', name: 'West Bengal', disruptions: 2567 },
  { code: 'in-jh', name: 'Jharkhand', disruptions: 1234 },
  { code: 'in-or', name: 'Odisha', disruptions: 1678 },
  { code: 'in-ct', name: 'Chhattisgarh', disruptions: 987 },
  { code: 'in-mp', name: 'Madhya Pradesh', disruptions: 2345 },
  { code: 'in-gj', name: 'Gujarat', disruptions: 1890 },
  { code: 'in-dd', name: 'Daman and Diu', disruptions: 123 },
  { code: 'in-dn', name: 'Dadra and Nagar Haveli', disruptions: 89 },
  { code: 'in-mh', name: 'Maharashtra', disruptions: 3567 },
  { code: 'in-ga', name: 'Goa', disruptions: 234 },
  { code: 'in-ka', name: 'Karnataka', disruptions: 2890 },
  { code: 'in-kl', name: 'Kerala', disruptions: 1567 },
  { code: 'in-tn', name: 'Tamil Nadu', disruptions: 2456 },
  { code: 'in-ap', name: 'Andhra Pradesh', disruptions: 1987 },
  { code: 'in-tg', name: 'Telangana', disruptions: 1678 },
  { code: 'in-an', name: 'Andaman and Nicobar', disruptions: 156 },
  { code: 'in-ld', name: 'Lakshadweep', disruptions: 78 },
  { code: 'in-py', name: 'Puducherry', disruptions: 145 },
  { code: 'in-ch', name: 'Chandigarh', disruptions: 234 },
  { code: 'in-la', name: 'Ladakh', disruptions: 178 },
];

// Location data with state codes and coordinates
// Tier 1: Only Socio-Political & Security and Operational & Human (fewer locations)
// Tier 2 & 3: All categories (more locations, especially Tier 3)
// Total disruptions: 6,251 (Tier 1: 850, Tier 2: 1,500, Tier 3: 3,901)
const locationData: LocationData[] = [
  // Tier 1 - Only Socio-Political & Security and Operational & Human (fewer locations) - Total: 850
  { id: 'loc-001', pincode: '110001', placeName: 'Connaught Place', city: 'Delhi', state: 'Delhi', stateCode: 'in-dl', tier: 'tier1', categories: ['socioPolitical', 'operational'], disruptions: 365, coordinates: { lat: 28.6304, lon: 77.2177 } },
  { id: 'loc-002', pincode: '700001', placeName: 'BBD Bagh', city: 'Kolkata', state: 'West Bengal', stateCode: 'in-wb', tier: 'tier1', categories: ['socioPolitical'], disruptions: 285, coordinates: { lat: 22.5726, lon: 88.3639 } },
  { id: 'loc-003', pincode: '400001', placeName: 'Fort', city: 'Mumbai', state: 'Maharashtra', stateCode: 'in-mh', tier: 'tier1', categories: ['operational'], disruptions: 200, coordinates: { lat: 18.9388, lon: 72.8353 } },
  
  // Tier 2 - All categories - Total: 1,500
  { id: 'loc-004', pincode: '380001', placeName: 'Lal Darwaja', city: 'Ahmedabad', state: 'Gujarat', stateCode: 'in-gj', tier: 'tier2', categories: ['infrastructure', 'weather'], disruptions: 250, coordinates: { lat: 23.0225, lon: 72.5714 } },
  { id: 'loc-005', pincode: '302001', placeName: 'MI Road', city: 'Jaipur', state: 'Rajasthan', stateCode: 'in-rj', tier: 'tier2', categories: ['weather', 'socioPolitical', 'operational'], disruptions: 356, coordinates: { lat: 26.9124, lon: 75.7873 } },
  { id: 'loc-006', pincode: '226001', placeName: 'Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'in-up', tier: 'tier2', categories: ['infrastructure', 'operational'], disruptions: 265, coordinates: { lat: 26.8467, lon: 80.9462 } },
  { id: 'loc-007', pincode: '440001', placeName: 'Sitabuldi', city: 'Nagpur', state: 'Maharashtra', stateCode: 'in-mh', tier: 'tier2', categories: ['weather', 'infrastructure', 'socioPolitical'], disruptions: 325, coordinates: { lat: 21.1458, lon: 79.0882 } },
  { id: 'loc-008', pincode: '500001', placeName: 'Abids', city: 'Hyderabad', state: 'Telangana', stateCode: 'in-tg', tier: 'tier2', categories: ['infrastructure', 'weather', 'operational'], disruptions: 304, coordinates: { lat: 17.3850, lon: 78.4867 } },
  
  // Tier 3 - All categories (more locations) - Total: 3,901
  { id: 'loc-009', pincode: '341001', placeName: 'Station Road', city: 'Bikaner', state: 'Rajasthan', stateCode: 'in-rj', tier: 'tier3', categories: ['weather', 'infrastructure', 'socioPolitical', 'operational'], disruptions: 225, coordinates: { lat: 28.0229, lon: 73.3119 } },
  { id: 'loc-010', pincode: '342001', placeName: 'High Court Road', city: 'Jodhpur', state: 'Rajasthan', stateCode: 'in-rj', tier: 'tier3', categories: ['weather', 'operational', 'infrastructure'], disruptions: 242, coordinates: { lat: 26.2389, lon: 73.0243 } },
  { id: 'loc-011', pincode: '208001', placeName: 'Mall Road', city: 'Kanpur', state: 'Uttar Pradesh', stateCode: 'in-up', tier: 'tier3', categories: ['operational', 'socioPolitical', 'weather'], disruptions: 307, coordinates: { lat: 26.4499, lon: 80.3319 } },
  { id: 'loc-012', pincode: '400051', placeName: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', stateCode: 'in-mh', tier: 'tier3', categories: ['infrastructure', 'weather', 'socioPolitical'], disruptions: 259, coordinates: { lat: 19.0596, lon: 72.8295 } },
  { id: 'loc-013', pincode: '411001', placeName: 'Shivajinagar', city: 'Pune', state: 'Maharashtra', stateCode: 'in-mh', tier: 'tier3', categories: ['weather', 'infrastructure', 'operational'], disruptions: 208, coordinates: { lat: 18.5204, lon: 73.8567 } },
  { id: 'loc-014', pincode: '560001', placeName: 'MG Road', city: 'Bengaluru', state: 'Karnataka', stateCode: 'in-ka', tier: 'tier3', categories: ['infrastructure', 'weather', 'socioPolitical', 'operational'], disruptions: 431, coordinates: { lat: 12.9716, lon: 77.5946 } },
  { id: 'loc-015', pincode: '560095', placeName: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', stateCode: 'in-ka', tier: 'tier3', categories: ['infrastructure', 'weather'], disruptions: 363, coordinates: { lat: 12.9698, lon: 77.7499 } },
  { id: 'loc-016', pincode: '600001', placeName: 'Parry\'s Corner', city: 'Chennai', state: 'Tamil Nadu', stateCode: 'in-tn', tier: 'tier3', categories: ['weather', 'operational', 'infrastructure'], disruptions: 307, coordinates: { lat: 13.0827, lon: 80.2707 } },
  { id: 'loc-017', pincode: '600040', placeName: 'Adyar', city: 'Chennai', state: 'Tamil Nadu', stateCode: 'in-tn', tier: 'tier3', categories: ['infrastructure', 'socioPolitical'], disruptions: 259, coordinates: { lat: 13.0067, lon: 80.2206 } },
  { id: 'loc-018', pincode: '700091', placeName: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', stateCode: 'in-wb', tier: 'tier3', categories: ['operational', 'weather', 'infrastructure'], disruptions: 225, coordinates: { lat: 22.5745, lon: 88.4339 } },
  { id: 'loc-019', pincode: '110020', placeName: 'Hauz Khas', city: 'Delhi', state: 'Delhi', stateCode: 'in-dl', tier: 'tier3', categories: ['operational', 'socioPolitical', 'weather', 'infrastructure'], disruptions: 242, coordinates: { lat: 28.5448, lon: 77.2066 } },
  { id: 'loc-020', pincode: '500032', placeName: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', stateCode: 'in-tg', tier: 'tier3', categories: ['infrastructure', 'weather'], disruptions: 293, coordinates: { lat: 17.4239, lon: 78.4481 } },
  { id: 'loc-021', pincode: '380015', placeName: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat', stateCode: 'in-gj', tier: 'tier3', categories: ['weather', 'socioPolitical', 'operational'], disruptions: 276, coordinates: { lat: 23.0405, lon: 72.5597 } },
  { id: 'loc-022', pincode: '302016', placeName: 'C Scheme', city: 'Jaipur', state: 'Rajasthan', stateCode: 'in-rj', tier: 'tier3', categories: ['infrastructure', 'operational', 'weather'], disruptions: 259, coordinates: { lat: 26.9124, lon: 75.7873 } },
];

// Leaflet Map Component (dynamically imported to avoid SSR issues)
const LeafletMap = dynamic(() => import('./LeafletIndiaMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
});

interface DisruptionHeatMapProps {
  isDarkMode?: boolean;
}

export function DisruptionHeatMap({ isDarkMode: propDarkMode }: DisruptionHeatMapProps) {
  const themeDarkMode = useTheme();
  const isDarkMode = propDarkMode !== undefined ? propDarkMode : themeDarkMode;
  
  const [selectedTiers, setSelectedTiers] = useState<TierType[]>(['tier1', 'tier2', 'tier3']);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(['weather', 'infrastructure', 'socioPolitical', 'operational']);
  const [selectedState, setSelectedState] = useState<StateDisruptionData | null>(null);
  const [drillDownLevel, setDrillDownLevel] = useState<'state' | 'pincode'>('state');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTierDropdown, setShowTierDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [locationToZoom, setLocationToZoom] = useState<LocationData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Filter locations based on selected tiers, categories, and optionally selected state
  const filteredLocations = useMemo(() => {
    return locationData
      .filter(location => {
        const tierMatch = selectedTiers.includes(location.tier);
        const categoryMatch = location.categories.some(cat => selectedCategories.includes(cat));
        const stateMatch = !selectedState || location.stateCode === selectedState.code;
        const searchMatch = searchQuery === '' || 
          location.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.pincode.includes(searchQuery) ||
          location.state.toLowerCase().includes(searchQuery.toLowerCase());
        return tierMatch && categoryMatch && stateMatch && searchMatch;
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [selectedTiers, selectedCategories, selectedState, searchQuery]);

  // Get pincode data for selected state
  const pincodeData = useMemo(() => {
    if (!selectedState || drillDownLevel !== 'pincode') return [];
    
    return filteredLocations
      .filter(loc => loc.stateCode === selectedState.code)
      .map(loc => ({
        pincode: loc.pincode,
        placeName: loc.placeName,
        city: loc.city,
        disruptions: loc.disruptions,
        coordinates: loc.coordinates || { lat: 0, lon: 0 },
      }))
      .sort((a, b) => b.disruptions - a.disruptions);
  }, [selectedState, filteredLocations, drillDownLevel]);

  // Sorted locations for the list panel
  const sortedLocationsForList = useMemo(() => {
    if (drillDownLevel === 'pincode' && pincodeData.length > 0) {
      return pincodeData.map(p => ({
        id: `pin-${p.pincode}`,
        pincode: p.pincode,
        placeName: p.placeName,
        city: p.city,
        state: selectedState?.name || '',
        stateCode: selectedState?.code || '',
        tier: 'tier1' as TierType,
        categories: [] as CategoryType[],
        disruptions: p.disruptions,
        primaryCategory: undefined as CategoryType | undefined,
      }));
    }
    
    return [...filteredLocations].sort((a, b) => {
      if (b.disruptions !== a.disruptions) {
        return b.disruptions - a.disruptions;
      }
      return a.id.localeCompare(b.id);
    });
  }, [filteredLocations, drillDownLevel, pincodeData, selectedState]);

  // Toggle tier selection
  const toggleTier = (tier: TierType) => {
    setSelectedTiers(prev => 
      prev.includes(tier) 
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: CategoryType) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedTiers(['tier1', 'tier2', 'tier3']);
    setSelectedCategories(['weather', 'infrastructure', 'socioPolitical', 'operational']);
    setSearchQuery('');
    setSelectedState(null);
    setDrillDownLevel('state');
    setShowTierDropdown(false);
  }, []);

  // Handle state click from map
  const handleStateClick = useCallback((stateCode: string, stateName: string) => {
    const stateData = stateDisruptionData.find(s => s.code === stateCode);
    if (stateData) {
      setSelectedState(stateData);
      setDrillDownLevel('pincode'); // Switch to pincode view
    }
  }, []);

  // Handle drill up (back to state view)
  const handleDrillUp = useCallback(() => {
    setDrillDownLevel('state');
    setSelectedState(null);
  }, []);

  // Handle location click from sidebar - zoom to location on map
  const handleLocationClick = useCallback((location: LocationData) => {
    if (location.coordinates && location.coordinates.lat && location.coordinates.lon) {
      setLocationToZoom(location);
      // Reset after a short delay to allow the map to process
      setTimeout(() => setLocationToZoom(null), 100);
    }
  }, []);

  // Calculate stats
  const totalFiltered = filteredLocations.reduce((sum, loc) => sum + loc.disruptions, 0);
  const tierStats = tierConfigs.map(tier => ({
    ...tier,
    count: filteredLocations.filter(loc => loc.tier === tier.id).length,
    disruptions: filteredLocations.filter(loc => loc.tier === tier.id).reduce((sum, loc) => sum + loc.disruptions, 0)
  }));

  // Calculate state-level data based on filtered locations
  const stateMapData = useMemo(() => {
    // Group filtered locations by state
    const stateGroups = filteredLocations.reduce((acc, loc) => {
      if (!acc[loc.stateCode]) {
        acc[loc.stateCode] = {
          code: loc.stateCode,
          name: loc.state,
          disruptions: 0,
          tiers: new Set<TierType>(),
          categories: new Set<CategoryType>(),
          locations: [],
        };
      }
      acc[loc.stateCode].disruptions += loc.disruptions;
      acc[loc.stateCode].tiers.add(loc.tier);
      loc.categories.forEach(cat => acc[loc.stateCode].categories.add(cat));
      acc[loc.stateCode].locations.push(loc);
      return acc;
    }, {} as Record<string, {
      code: string;
      name: string;
      disruptions: number;
      tiers: Set<TierType>;
      categories: Set<CategoryType>;
      locations: LocationData[];
    }>);

    // Convert to map data format with tier information
    return stateDisruptionData.map(state => {
      const filteredStateData = stateGroups[state.code];
      
      if (!filteredStateData) {
        // State has no matching locations - show in gray
        return {
          'hc-key': state.code,
          value: 0,
          name: state.name,
          tiers: [],
          dominantTier: null,
          color: '#e2e8f0', // Light gray for no data
        };
      }

      // Determine dominant tier (tier with most disruptions)
      const tierDisruptions = tierConfigs.map(tier => ({
        tier: tier.id,
        disruptions: filteredStateData.locations
          .filter(loc => loc.tier === tier.id)
          .reduce((sum, loc) => sum + loc.disruptions, 0),
      }));
      
      const dominantTier = tierDisruptions.reduce((max, curr) => 
        curr.disruptions > max.disruptions ? curr : max, 
        tierDisruptions[0] || { tier: 'tier1' as TierType, disruptions: 0 }
      );

      // Determine dominant category (category with most disruptions)
      const categoryDisruptions = categoryConfigs.map(cat => ({
        category: cat.id,
        disruptions: filteredStateData.locations
          .filter(loc => loc.categories.includes(cat.id))
          .reduce((sum, loc) => sum + loc.disruptions, 0),
      }));
      
      const dominantCategory = categoryDisruptions.reduce((max, curr) => 
        curr.disruptions > max.disruptions ? curr : max, 
        categoryDisruptions[0] || { category: 'weather' as CategoryType, disruptions: 0 }
      );

      // Always use tier color to differentiate cities by tier (3 different colors)
      // This ensures states are colored based on their dominant tier
      const tierConfig = tierConfigs.find(t => t.id === dominantTier.tier);
      // Use base tier color directly to ensure all 3 colors are clearly visible
      // Tier 1: #8b5cf6 (purple), Tier 2: #06b6d4 (teal), Tier 3: #f59e0b (orange)
      const baseColor = tierConfig?.color || '#6366f1';
      const colorType: 'tier' | 'category' = 'tier';

      return {
        'hc-key': state.code,
        value: filteredStateData.disruptions,
        name: state.name,
        tiers: Array.from(filteredStateData.tiers),
        categories: Array.from(filteredStateData.categories),
        dominantTier: dominantTier.tier,
        dominantCategory: dominantCategory.category,
        color: baseColor, // Use base tier color directly for clear distinction
        colorType: colorType,
        disruptionCount: filteredStateData.disruptions,
      };
    });
  }, [filteredLocations, selectedTiers, selectedCategories]);

  // Prepare map data with filter dependencies
  const mapData = useMemo(() => {
    if (drillDownLevel === 'pincode' && selectedState && pincodeData.length > 0) {
      // Return pincode data for drill-down
      return pincodeData.map(p => ({
        'hc-key': `pin-${p.pincode}`,
        value: p.disruptions,
        name: `${p.pincode} - ${p.placeName}`,
        lat: p.coordinates.lat,
        lon: p.coordinates.lon,
      }));
    }
    
    // Return filtered state data
    return stateMapData;
  }, [drillDownLevel, selectedState, pincodeData, stateMapData, selectedTiers, selectedCategories]);

  return (
    <div 
      className={`rounded-2xl p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
            <span 
              className="text-lg font-bold"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Transportation Disruption
            </span>
            {drillDownLevel === 'pincode' && selectedState && (
              <>
                <span className="text-lg" style={{ color: isDarkMode ? '#939394' : '#666666' }}>/</span>
                <span 
                  className="text-lg font-bold"
                  style={{ color: '#0284c7' }}
                >
                  {selectedState.name}
                </span>
              </>
            )}
          </div>
          <span 
            className="text-2xl font-black px-3 py-1 rounded-lg"
            style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {formatNumber(totalFiltered)}
          </span>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {drillDownLevel === 'pincode' && selectedState && (
        <div className="mb-4">
          <button
            onClick={handleDrillUp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
              color: isDarkMode ? '#FFFFFF' : '#010101',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to India Map
          </button>
        </div>
      )}

      {/* Tier Legend - Always show tier colors to differentiate cities */}
      {drillDownLevel === 'state' && (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="text-xs font-medium" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Tier Colors:</span>
          <div className="flex items-center gap-3">
            {tierConfigs.map(tier => (
              <div key={tier.id} className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                  {tier.label}
                </span>
              </div>
            ))}
          </div>
          <span className="text-xs italic" style={{ color: isDarkMode ? '#666666' : '#999999' }}>
            (Cities colored by tier - states shown in neutral gray)
          </span>
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Tier Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTierDropdown(!showTierDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
            }}
          >
            <Layers className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
            <span className="text-sm font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              City Tier
            </span>
            <ChevronDown className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
          </button>
          
          {showTierDropdown && (
            <div 
              className="absolute top-full left-0 mt-1 z-20 rounded-lg shadow-lg p-2 min-w-[140px]"
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
              }}
            >
              {tierConfigs.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => toggleTier(tier.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-black/5"
                >
                  <div 
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: selectedTiers.includes(tier.id) ? tier.color : 'transparent',
                      border: `2px solid ${tier.color}`,
                    }}
                  >
                    {selectedTiers.includes(tier.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {tier.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryConfigs.map(category => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: selectedCategories.includes(category.id) 
                  ? `${category.color}20` 
                  : (isDarkMode ? '#1a1a1a' : '#f8f9fa'),
                border: `1px solid ${selectedCategories.includes(category.id) ? category.color : (isDarkMode ? '#2a2a2a' : '#E5E5E5')}`,
                color: selectedCategories.includes(category.id) ? category.color : (isDarkMode ? '#939394' : '#666666'),
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.label}
            </button>
          ))}
        </div>

        {/* Clear All Filters Button */}
        {(selectedTiers.length < tierConfigs.length || 
          selectedCategories.length < categoryConfigs.length || 
          searchQuery !== '' ||
          selectedState !== null ||
          drillDownLevel === 'pincode') && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
              color: isDarkMode ? '#FFFFFF' : '#010101',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}

        {/* Clear state filter */}
        {selectedState && (
          <button
            onClick={() => setSelectedState(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: '#0284c720',
              border: '1px solid #0284c7',
              color: '#0284c7',
            }}
          >
            {selectedState.name}
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main Content: Map + Right Panel */}
      <div className="flex gap-4">
        {/* Left: India Map */}
        <div 
          className="flex-2 rounded-xl overflow-hidden relative"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            minHeight: '500px',
          }}
        >
          <LeafletMap 
            data={mapData} 
            onStateClick={handleStateClick}
            selectedState={selectedState?.code || null}
            drillDownLevel={drillDownLevel}
            selectedStateData={selectedState}
            pincodeData={drillDownLevel === 'pincode' ? pincodeData : []}
            filteredLocations={drillDownLevel === 'state' ? filteredLocations : []}
            selectedCategories={selectedCategories}
            selectedTiers={selectedTiers}
            locationToZoom={locationToZoom}
          />
        </div>

        {/* Right: Location List Panel */}
        <div 
          className="flex-1 rounded-xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
            minWidth: '320px',
            maxWidth: '380px',
            height: '500px',
          }}
        >
          {/* Panel Header */}
          <div 
            className="p-4 shrink-0"
            style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 
                className="text-sm font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                {drillDownLevel === 'pincode' && selectedState 
                  ? `${selectedState.name} Pincodes` 
                  : 'All Locations'} ({sortedLocationsForList.length})
              </h3>
            </div>
            
            {/* Search */}
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: isDarkMode ? '#0d0d0d' : '#f8f9fa',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
              }}
            >
              <Search className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
              <input
                type="text"
                placeholder={drillDownLevel === 'pincode' ? "Search pincode, place..." : "Search pincode, city, state..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              />
            </div>
          </div>

          {/* Tier Stats - Clickable Filters */}
          {drillDownLevel === 'state' && (
            <div 
              className="px-4 py-3 flex gap-2 shrink-0"
              style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
            >
              {tierStats.map(tier => {
                const isSelected = selectedTiers.includes(tier.id);
                const isOnlySelected = selectedTiers.length === 1 && isSelected;
                
                return (
                  <div 
                    key={tier.id}
                    onClick={() => {
                      // Toggle tier filter: if only this tier is selected, select all; otherwise, select only this tier
                      if (isOnlySelected) {
                        setSelectedTiers(['tier1', 'tier2', 'tier3']);
                      } else {
                        setSelectedTiers([tier.id]);
                      }
                    }}
                    className="flex-1 p-2 rounded-lg text-center cursor-pointer transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: isSelected ? `${tier.color}30` : `${tier.color}15`,
                      border: isSelected ? `2px solid ${tier.color}` : `2px solid transparent`,
                      boxShadow: isSelected ? `0 2px 8px ${tier.color}40` : 'none',
                    }}
                    title={isOnlySelected ? `Click to show all tiers` : `Click to filter by ${tier.label}`}
                  >
                    <p className="text-lg font-bold" style={{ color: tier.color }}>
                      {formatNumber(tier.disruptions)}
                    </p>
                    <p className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                      {tier.label}
                    </p>
                    {isOnlySelected && (
                      <div className="mt-1">
                        <span 
                          className="text-[8px] px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: tier.color,
                            color: '#ffffff'
                          }}
                        >
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Scrollable Location List */}
          <div 
            className="flex-1 overflow-y-auto p-3 space-y-2"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5'
            }}
          >
            {sortedLocationsForList.map((location) => {
              const tierConfig = tierConfigs.find(t => t.id === location.tier);
              
              return (
                <div
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  className="p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: isDarkMode ? '#0d0d0d' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-sm font-bold"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                        >
                          {location.pincode}
                        </span>
                        {drillDownLevel === 'state' && (
                          <span 
                            className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ 
                              backgroundColor: `${tierConfig?.color}20`,
                              color: tierConfig?.color 
                            }}
                          >
                            {tierConfig?.label}
                          </span>
                        )}
                      </div>
                      <p 
                        className="text-xs"
                        style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                      >
                        {location.placeName}, {location.city}
                      </p>
                      {drillDownLevel === 'state' && (
                        <p 
                          className="text-[10px]"
                          style={{ color: isDarkMode ? '#939394' : '#888888' }}
                        >
                          {location.state}
                        </p>
                      )}
                    </div>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: '#0284c7' }}
                    >
                      {location.disruptions}
                    </span>
                  </div>
                  
                  {/* Category Tag - Only Primary Category */}
                  {drillDownLevel === 'state' && location.categories.length > 0 && (() => {
                    const primaryCategoryId = location.primaryCategory || location.categories[0];
                    const cat = categoryConfigs.find(c => c.id === primaryCategoryId);
                    return (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${cat?.color}20`,
                            color: cat?.color,
                          }}
                        >
                          {cat?.label.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
            
            {sortedLocationsForList.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: isDarkMode ? '#3a3a3a' : '#D1D5DB' }} />
                <p className="text-sm" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  No locations match the current filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
