import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, Search, MapPin, Bed, Bath, Maximize, Eye, 
  ShieldCheck, Heart, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, CheckCircle, Home, X, Sun, Moon
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';

const Properties = () => {
  const navigate = useNavigate();
  const { properties: allProperties, wishlistIds, toggleWishlist, loading } = usePropertyContext();
  const { theme, toggleTheme } = useTheme();

  // Filter & UI States
  const [searchLocation, setSearchLocation] = useState('');
  const [priceLimit, setPriceLimit] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBhk, setSelectedBhk] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const propertyTypesList = [
    { id: 'Flat/Apartment', label: 'Flat/Apartment' },
    { id: 'Independent House/Villa', label: 'Independent House/Villa' },
    { id: 'Penthouse', label: 'Penthouse' },
    { id: 'Commercial', label: 'Commercial' },
  ];

  const bhkOptions = ['1', '2', '3', '4', '5+'];

  const togglePropertyType = (type) => {
    setSelectedTypes((prev) => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchLocation('');
    setPriceLimit(10);
    setSelectedTypes([]);
    setSelectedBhk('');
  };

  // Calculate active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchLocation.trim() !== '') count++;
    if (priceLimit < 10) count++;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedBhk !== '') count++;
    return count;
  }, [searchLocation, priceLimit, selectedTypes, selectedBhk]);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      // Location filter
      if (searchLocation.trim() !== '') {
        const query = searchLocation.toLowerCase();
        if (!item.location?.toLowerCase().includes(query) && !item.title?.toLowerCase().includes(query) && !item.city?.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Price filter (Val in Cr)
      if (item.priceVal > priceLimit) {
        return false;
      }
      // Type filter
      if (selectedTypes.length > 0) {
        const typeMatch = selectedTypes.some(t => 
          item.type?.toLowerCase().includes(t.toLowerCase()) || 
          t.toLowerCase().includes(item.type?.toLowerCase() || '') ||
          (t === 'Flat/Apartment' && (item.category === 'FLAT' || item.type === 'Flat')) ||
          (t === 'Independent House/Villa' && (item.category === 'VILLA' || item.type === 'Villa')) ||
          (t === 'Penthouse' && item.category === 'PENTHOUSE') ||
          (t === 'Commercial' && item.category === 'COMMERCIAL')
        );
        if (!typeMatch) return false;
      }
      // BHK filter
      if (selectedBhk !== '' && item.bhk !== selectedBhk) {
        if (selectedBhk === '5+' && parseInt(item.bhk) >= 5) return true;
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low-high') return (a.priceVal || 0) - (b.priceVal || 0);
      if (sortBy === 'price-high-low') return (b.priceVal || 0) - (a.priceVal || 0);
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      // Default latest
      return new Date(b.dateAdded || '2026-01-01') - new Date(a.dateAdded || '2026-01-01');
    });
  }, [allProperties, searchLocation, priceLimit, selectedTypes, selectedBhk, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black py-5 sm:py-8 px-3 sm:px-6 md:px-8 lg:px-12 font-sans text-left antialiased transition-colors duration-300">
      <div className="max-w-[1500px] mx-auto">
        
        {/* =========================================================================
            MOBILE ONLY: QUICK SEARCH & FILTER ACTION BAR (Visible on < lg screens)
           ========================================================================= */}
        <div className="block lg:hidden mb-5 space-y-3">
          {/* Quick Location Search Bar */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by city, location or title..."
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 shadow-[0_2px_15px_rgba(0,0,0,0.03)] focus:outline-none focus:border-[#047262] focus:ring-2 focus:ring-[#047262]/15 transition-all"
            />
            {searchLocation && (
              <button
                onClick={() => setSearchLocation('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Trigger Button & Sort Row */}
          <div className="flex items-center justify-between gap-2.5">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 py-3 px-4 bg-white border border-gray-200/90 rounded-xl font-bold text-sm text-[#1a2b3c] flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] active:scale-95 transition-transform"
            >
              <SlidersHorizontal size={17} className="text-[#047262]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#047262] text-white text-[11px] font-black rounded-full flex items-center justify-center ml-0.5 shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-3.5 bg-white border border-gray-200/90 rounded-xl font-bold text-xs sm:text-sm text-[#1a2b3c] outline-none focus:border-[#047262] shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer truncate max-w-[150px] sm:max-w-none"
            >
              <option value="latest">Latest First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>

            {/* View Mode on Phone */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#162231] p-1 rounded-xl border border-gray-200/90 dark:border-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[#047262] text-white shadow-xs' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={17} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-[#047262] text-white shadow-xs' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE FILTER MODAL DRAWER (Slides over when Filters button clicked)
           ========================================================================= */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-300 lg:hidden">
            <div className="w-full sm:w-[400px] bg-white h-full overflow-y-auto p-6 flex flex-col justify-between animate-slide-in-right shadow-2xl">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-2.5 text-[#1a2b3c] font-black text-xl">
                    <Filter size={22} className="text-[#047262]" />
                    <span>Filter Properties</span>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Location Input */}
                <div className="mb-6">
                  <label className="block text-[#1a2b3c] font-extrabold text-sm mb-2.5">
                    Location & City
                  </label>
                  <div className="relative">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="e.g. Delhi, Noida, Gurgaon..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#047262] focus:ring-2 focus:ring-[#047262]/10"
                    />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="mb-7 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[#1a2b3c] font-extrabold text-sm">
                      Max Price Limit
                    </label>
                    <span className="text-[#047262] font-black text-sm bg-[#e0f5f0] px-3 py-1 rounded-xl">
                      ₹{priceLimit}.00 Cr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.25"
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#047262]"
                  />
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 mt-2">
                    <span>₹50 L</span>
                    <span>₹10 Cr</span>
                  </div>
                </div>

                {/* Property Type Checkboxes */}
                <div className="mb-7 pb-6 border-b border-gray-100">
                  <label className="block text-[#1a2b3c] font-extrabold text-sm mb-3.5">
                    Property Type
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {propertyTypesList.map((type) => {
                      const isChecked = selectedTypes.includes(type.id);
                      return (
                        <div
                          key={type.id}
                          onClick={() => togglePropertyType(type.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked 
                              ? 'bg-[#e0f5f0]/30 border-[#047262] font-bold text-[#047262]' 
                              : 'bg-gray-50 border-gray-200 text-gray-700 font-semibold hover:border-gray-300'
                          }`}
                        >
                          <span className="text-sm">{type.label}</span>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-[#047262] border-[#047262] text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isChecked && <CheckCircle size={14} className="text-white fill-current" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BHK (Bedrooms) Pill Buttons */}
                <div className="mb-8">
                  <label className="block text-[#1a2b3c] font-extrabold text-sm mb-3.5">
                    Bedrooms (BHK)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2.5">
                    {bhkOptions.slice(0, 4).map((bhk) => {
                      const isSelected = selectedBhk === bhk;
                      return (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => setSelectedBhk(isSelected ? '' : bhk)}
                          className={`py-3 rounded-xl text-sm font-black border transition-all ${
                            isSelected
                              ? 'bg-[#047262] text-white border-[#047262] shadow-sm'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {bhk}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBhk(selectedBhk === '5+' ? '' : '5+')}
                    className={`w-full py-3 rounded-xl text-sm font-black border transition-all ${
                      selectedBhk === '5+'
                        ? 'bg-[#047262] text-white border-[#047262] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    5+ Bedrooms
                  </button>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3 sticky bottom-0 bg-white z-10 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all flex-shrink-0"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#047262]/25 transition-transform active:scale-95"
                >
                  Show {filteredProperties.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Layout Grid (Desktop vs Mobile) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: DESKTOP FILTERS SIDEBAR (Hidden on phone view)
             ========================================================================= */}
          <aside className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0 bg-white rounded-3xl p-7 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100/80 sticky top-28">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#1a2b3c] font-bold text-xl">
                <Filter size={22} className="text-[#047262]" strokeWidth={2.5} />
                <span>Filters</span>
              </div>
              <button 
                onClick={resetFilters}
                className="text-[#047262] font-semibold text-sm hover:underline focus:outline-none"
              >
                Reset
              </button>
            </div>

            {/* Location Search Input */}
            <div className="mt-6">
              <label className="block text-[#1a2b3c] font-bold text-sm mb-3">
                Location
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search by city..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200/80 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#047262] focus:ring-2 focus:ring-[#047262]/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[#1a2b3c] font-bold text-sm">
                  Price Range
                </label>
                <span className="text-[#047262] font-extrabold text-sm bg-[#e0f5f0]/80 px-2.5 py-1 rounded-lg">
                  ₹{priceLimit}.00 Cr
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.25"
                value={priceLimit}
                onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#047262] focus:outline-none"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mt-2">
                <span>₹50 L</span>
                <span>₹10 Cr</span>
              </div>
            </div>

            {/* Property Type Checkboxes */}
            <div className="mt-8">
              <label className="block text-[#1a2b3c] font-bold text-sm mb-3.5">
                Property Type
              </label>
              <div className="space-y-3.5">
                {propertyTypesList.map((type) => {
                  const isChecked = selectedTypes.includes(type.id);
                  return (
                    <label 
                      key={type.id} 
                      onClick={() => togglePropertyType(type.id)}
                      className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                        isChecked 
                          ? 'bg-[#047262] border-[#047262] shadow-xs text-white' 
                          : 'border-gray-300 bg-white group-hover:border-[#047262]'
                      }`}>
                        {isChecked && <CheckCircle size={13} className="text-white fill-current" />}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        isChecked ? 'text-[#1a2b3c] font-bold' : 'text-gray-600 group-hover:text-[#1a2b3c]'
                      }`}>
                        {type.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* BHK (Bedrooms) Pill Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <label className="block text-[#1a2b3c] font-bold text-sm mb-3.5">
                BHK (Bedrooms)
              </label>
              <div className="grid grid-cols-4 gap-2.5 mb-2.5">
                {bhkOptions.slice(0, 4).map((bhk) => {
                  const isSelected = selectedBhk === bhk;
                  return (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBhk(isSelected ? '' : bhk)}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#047262] text-white border-[#047262] shadow-sm transform scale-105'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#047262]/50 hover:bg-[#e0f5f0]/20'
                      }`}
                    >
                      {bhk}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setSelectedBhk(selectedBhk === '5+' ? '' : '5+')}
                className={`w-full py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                  selectedBhk === '5+'
                    ? 'bg-[#047262] text-white border-[#047262] shadow-sm transform scale-102'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#047262]/50 hover:bg-[#e0f5f0]/20'
                }`}
              >
                5+ Bedrooms
              </button>
            </div>
          </aside>

          {/* =========================================================================
              RIGHT COLUMN: RESULTS HEADER & PROPERTY CARDS
             ========================================================================= */}
          <div className="flex-1 w-full">
            
            {/* Desktop Top Results Filter Bar (Hidden on phone view since we have quick controls above) */}
            <div className="hidden lg:flex bg-white rounded-2xl p-4 px-7 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] items-center justify-between gap-4 mb-8">
              <div className="text-gray-500 font-medium text-base">
                Showing <span className="text-[#1a2b3c] font-extrabold">{filteredProperties.length}</span> luxury properties
              </div>

              <div className="flex items-center gap-4">
                {/* Grid / List View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-[#047262] text-white shadow-xs' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-[#047262] text-white shadow-xs' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-semibold">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50/80 dark:bg-[#1b2b3f] border border-gray-200/80 dark:border-gray-700 rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a2b3c] dark:text-gray-100 outline-none focus:border-[#047262] hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <option value="latest">Latest First</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile result count header */}
            <div className="block lg:hidden mb-4 text-xs sm:text-sm font-extrabold text-gray-500 px-1">
              FOUND <span className="text-[#047262] font-black">{filteredProperties.length}</span> PROPERTIES
            </div>

            {/* Properties Grid / List Display */}
            {loading ? (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7"
                  : "space-y-5 sm:space-y-6"
              }>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-[24px] sm:rounded-[2rem] overflow-hidden border border-gray-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex ${
                      viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'
                    } animate-pulse`}
                  >
                    <div className={`bg-gray-200 ${viewMode === 'grid' ? 'h-56 sm:h-60' : 'sm:w-80 sm:h-full h-56'} w-full flex-shrink-0`}></div>
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between mb-3">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div>
                        <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-gray-100">
                          <div className="h-12 bg-gray-200 rounded"></div>
                          <div className="h-12 bg-gray-200 rounded"></div>
                          <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-12 bg-gray-200 rounded-xl sm:rounded-2xl w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-[28px] p-8 sm:p-12 text-center border border-gray-100 shadow-sm my-4">
                <SlidersHorizontal size={44} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-[#1a2b3c] mb-2">No properties matched</h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn't find any listings matching your current filter criteria. Try expanding your location search or raising the max price limit.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3.5 bg-[#047262] text-white font-bold text-sm sm:text-base rounded-2xl hover:bg-[#03594d] transition-all shadow-md active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7"
                  : "space-y-5 sm:space-y-6"
              }>
                {filteredProperties.map((prop) => {
                  const isFav = wishlistIds.includes(prop.id);
                  return (
                    <div
                      key={prop.id}
                      className={`bg-white rounded-[24px] sm:rounded-[2rem] overflow-hidden border border-gray-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(4,114,98,0.12)] transition-all duration-300 flex ${
                        viewMode === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row'
                      } group`}
                    >
                      {/* Image Header with Price & Badges */}
                      <div 
                        onClick={() => navigate(`/properties/${prop.id}`)}
                        className={`relative ${viewMode === 'grid' ? 'h-56 sm:h-60' : 'sm:w-80 sm:h-auto h-56'} overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer`}
                      >
                        <img
                          src={prop.images?.[0] || prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Gradient Bottom Overlay for Price readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />

                        {/* Top Left Badges */}
                        <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 flex items-center gap-1.5 z-10">
                          {prop.isNew && (
                            <span className="bg-white text-[#1a2b3c] font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                              NEW
                            </span>
                          )}
                          {prop.verified && (
                            <span className="bg-[#047262] text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                              <ShieldCheck size={12} strokeWidth={3} />
                              VERIFIED
                            </span>
                          )}
                        </div>

                        {/* Top Right Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prop.id, navigate);
                          }}
                          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-gray-700 transition-all duration-200 shadow-md transform active:scale-95 sm:hover:scale-110 focus:outline-none z-10"
                          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                          aria-label="Wishlist toggle"
                        >
                          <Heart
                            size={18}
                            className={`transition-colors duration-300 ${
                              isFav ? 'text-rose-600 fill-rose-600' : 'text-gray-500 hover:text-rose-500'
                            }`}
                          />
                        </button>

                        {/* Bottom Price Overlay */}
                        <div className="absolute bottom-3.5 left-4 sm:bottom-4 sm:left-5 z-10">
                          <span className="text-white font-black text-2xl sm:text-3xl tracking-tight drop-shadow-md">
                            {prop.priceText}
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                        <div>
                          {/* Category Badge & View Count */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#047262] font-black text-xs tracking-wider uppercase">
                              {prop.category || 'LUXURY RESIDENCE'}
                            </span>
                            <span className="text-gray-400 font-extrabold text-xs flex items-center gap-1">
                              <Eye size={14} className="text-gray-400" />
                              {prop.views || 42}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => navigate(`/properties/${prop.id}`)}
                            className="font-extrabold text-base sm:text-lg text-[#1a2b3c] group-hover:text-[#047262] transition-colors duration-200 line-clamp-1 cursor-pointer"
                          >
                            {prop.title}
                          </h3>

                          {/* Address Location */}
                          <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs sm:text-sm font-medium line-clamp-1">
                            <MapPin size={14} className="text-[#047262] flex-shrink-0" />
                            <span className="truncate">{prop.location}</span>
                          </div>
                        </div>

                        <div>
                          {/* Property Specifications Grid */}
                          <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-gray-100 text-center">
                            {prop.category === 'COMMERCIAL' ? (
                              <>
                                <div className="flex flex-col items-center">
                                  <Home size={16} className="text-[#047262] mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs sm:text-sm capitalize">{prop.saleType || 'Sale'}</span>
                                  <span className="text-gray-400 text-[9px] font-extrabold uppercase mt-0.5">TYPE</span>
                                </div>
                                <div className="flex flex-col items-center border-x border-gray-100">
                                  <Maximize size={16} className="text-[#047262] mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs sm:text-sm">{prop.sqft || '2400'}</span>
                                  <span className="text-gray-400 text-[9px] font-extrabold uppercase mt-0.5">SQ FT</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <ShieldCheck size={16} className="text-[#047262] mb-1" />
                                  <span className="text-[#047262] font-black text-xs sm:text-sm">{prop.legalStatus || 'Verified'}</span>
                                  <span className="text-gray-400 text-[9px] font-extrabold uppercase mt-0.5">LEGAL</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col items-center">
                                  <Bed size={16} className="text-[#047262] mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs sm:text-sm">{prop.bhk || '3'}</span>
                                  <span className="text-gray-400 text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5">BEDS</span>
                                </div>
                                <div className="flex flex-col items-center border-x border-gray-100">
                                  <Bath size={16} className="text-[#047262] mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs sm:text-sm">{prop.baths || '3'}</span>
                                  <span className="text-gray-400 text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5">BATHS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <Maximize size={16} className="text-[#047262] mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs sm:text-sm">{prop.sqft || '1850'}</span>
                                  <span className="text-gray-400 text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5">SQ FT</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/properties/${prop.id}`)}
                            className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm rounded-xl sm:rounded-2xl transition-all duration-200 shadow-[0_4px_15px_rgba(4,114,98,0.2)] hover:shadow-[0_6px_22px_rgba(4,114,98,0.35)] transform sm:hover:-translate-y-0.5 active:scale-95"
                          >
                            View Details
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Properties;
