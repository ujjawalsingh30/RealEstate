import React, { useState, useMemo } from 'react';
import { 
  Filter, Search, MapPin, Bed, Bath, Maximize, Eye, 
  ShieldCheck, Heart, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, CheckCircle, Home
} from 'lucide-react';

const Properties = () => {
  // Filter States
  const [searchLocation, setSearchLocation] = useState('');
  const [priceLimit, setPriceLimit] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBhk, setSelectedBhk] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [wishlistIds, setWishlistIds] = useState([1, 2]); // Initial favorited items

  // Sample Dataset Matching and Expanding the Screenshot
  const allProperties = [
    {
      id: 1,
      title: 'DLF Urban Grande Towers',
      location: 'Sector 62 Extension, Near NH-24, Delhi',
      priceText: '₹1,65,00,000',
      priceVal: 1.65,
      category: 'FLAT',
      type: 'Flat/Apartment',
      bhk: '3',
      baths: '3',
      sqft: '1850',
      views: 69,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-20'
    },
    {
      id: 2,
      title: 'Emerald Sky Signature Villas',
      location: 'Sector 150, Near Noida-Greater Noida Express, Noida',
      priceText: '₹1,85,00,000',
      priceVal: 1.85,
      category: 'FLAT',
      type: 'Flat/Apartment',
      bhk: '4',
      baths: '4',
      sqft: '2400',
      views: 30,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-22'
    },
    {
      id: 3,
      title: 'Coral Bay Elite Residency',
      location: 'Vibhuti Khand, Gomti Nagar Extension, Lucknow',
      priceText: '₹56,00,000',
      priceVal: 0.56,
      category: 'COMMERCIAL',
      type: 'Commercial',
      sqft: '980',
      saleType: 'sale',
      legalStatus: 'OK',
      views: 17,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-24'
    },
    {
      id: 4,
      title: 'Prestige Golfshire Estates',
      location: 'Nandi Hills Road, Devanahalli, Bangalore',
      priceText: '₹4,20,00,000',
      priceVal: 4.20,
      category: 'VILLA',
      type: 'Independent House/Villa',
      bhk: '5+',
      baths: '6',
      sqft: '5200',
      views: 142,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-15'
    },
    {
      id: 5,
      title: 'Oberoi Three Sixty West',
      location: 'Worli Sea Face, Mumbai',
      priceText: '₹8,50,00,000',
      priceVal: 8.50,
      category: 'PENTHOUSE',
      type: 'Penthouse',
      bhk: '4',
      baths: '5',
      sqft: '4100',
      views: 218,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-25'
    },
    {
      id: 6,
      title: 'Lodha Altamount Grand Residence',
      location: 'Altamount Road, Tardeo, Mumbai',
      priceText: '₹6,80,00,000',
      priceVal: 6.80,
      category: 'FLAT',
      type: 'Flat/Apartment',
      bhk: '4',
      baths: '4',
      sqft: '3600',
      views: 95,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-10'
    },
    {
      id: 7,
      title: 'Embassy Manyata Tech Park Plaza',
      location: 'Outer Ring Road, Nagavara, Bangalore',
      priceText: '₹3,10,00,000',
      priceVal: 3.10,
      category: 'COMMERCIAL',
      type: 'Commercial',
      sqft: '3500',
      saleType: 'lease',
      legalStatus: 'OK',
      views: 84,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-08'
    },
    {
      id: 8,
      title: 'Godrej South Estate Landmark',
      location: 'Okhla Phase 1, South Delhi',
      priceText: '₹2,40,00,000',
      priceVal: 2.40,
      category: 'FLAT',
      type: 'Flat/Apartment',
      bhk: '3',
      baths: '3',
      sqft: '2150',
      views: 112,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-18'
    },
    {
      id: 9,
      title: 'Emaar Palm Springs Luxury Retreat',
      location: 'Golf Course Road, Sector 54, Gurgaon',
      priceText: '₹5,15,00,000',
      priceVal: 5.15,
      category: 'VILLA',
      type: 'Independent House/Villa',
      bhk: '4',
      baths: '5',
      sqft: '4800',
      views: 156,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      dateAdded: '2026-07-12'
    }
  ];

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

  const toggleWishlist = (id) => {
    setWishlistIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearchLocation('');
    setPriceLimit(10);
    setSelectedTypes([]);
    setSelectedBhk('');
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      // Location filter
      if (searchLocation.trim() !== '') {
        const query = searchLocation.toLowerCase();
        if (!item.location.toLowerCase().includes(query) && !item.title.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Price filter (Val in Cr)
      if (item.priceVal > priceLimit) {
        return false;
      }
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
        return false;
      }
      // BHK filter
      if (selectedBhk !== '' && item.bhk !== selectedBhk) {
        if (selectedBhk === '5+' && parseInt(item.bhk) >= 5) return true;
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low-high') return a.priceVal - b.priceVal;
      if (sortBy === 'price-high-low') return b.priceVal - a.priceVal;
      if (sortBy === 'views') return b.views - a.views;
      // Default latest
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
  }, [searchLocation, priceLimit, selectedTypes, selectedBhk, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 md:px-8 lg:px-12 font-sans text-left">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: FILTERS CARD
             ========================================================================= */}
          <aside className="w-full lg:w-[310px] xl:w-[330px] flex-shrink-0 bg-white rounded-3xl p-7 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100/80 sticky top-28">
            
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
            
            {/* Top Results Filter Bar */}
            <div className="bg-white rounded-2xl p-4 md:px-7 md:py-4 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="text-gray-500 font-medium text-sm md:text-base">
                Showing <span className="text-[#1a2b3c] font-extrabold">{filteredProperties.length}</span> properties
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
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
                  <span className="text-gray-400 text-xs md:text-sm font-semibold hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50/80 border border-gray-200/80 rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a2b3c] outline-none focus:border-[#047262] hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Properties Grid / List Display */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm my-8">
                <SlidersHorizontal size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-[#1a2b3c] mb-2">No properties found</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  We couldn't find any listings matching your current filter criteria. Try expanding your search location or price limit.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#047262] text-white font-bold text-sm rounded-2xl hover:bg-[#03594d] transition-all shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7"
                  : "space-y-6"
              }>
                {filteredProperties.map((prop) => {
                  const isFav = wishlistIds.includes(prop.id);
                  return (
                    <div
                      key={prop.id}
                      className={`bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_6px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(4,114,98,0.12)] transition-all duration-300 flex ${
                        viewMode === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row'
                      } group`}
                    >
                      {/* Image Header with Price & Badges */}
                      <div className={`relative ${viewMode === 'grid' ? 'h-60' : 'sm:w-80 sm:h-auto h-60'} overflow-hidden bg-gray-100 flex-shrink-0`}>
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Gradient Bottom Overlay for Price readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />

                        {/* Top Left Badges */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                          {prop.isNew && (
                            <span className="bg-white text-[#1a2b3c] font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                              NEW
                            </span>
                          )}
                          {prop.verified && (
                            <span className="bg-[#047262] text-white font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                              <ShieldCheck size={13} strokeWidth={3} />
                              VERIFIED
                            </span>
                          )}
                        </div>

                        {/* Top Right Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(prop.id)}
                          className="absolute top-4 right-4 w-9 h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-gray-700 transition-all duration-200 shadow-md transform hover:scale-110 focus:outline-none z-10"
                          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart
                            size={18}
                            className={`transition-colors duration-300 ${
                              isFav ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                            }`}
                          />
                        </button>

                        {/* Bottom Price Overlay */}
                        <div className="absolute bottom-4 left-5 z-10">
                          <span className="text-white font-black text-2xl md:text-3xl tracking-tight drop-shadow-md">
                            {prop.priceText}
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          {/* Category Badge & View Count */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#047262] font-black text-xs tracking-wider uppercase">
                              {prop.category}
                            </span>
                            <span className="text-gray-400 font-extrabold text-xs flex items-center gap-1">
                              <Eye size={14} className="text-gray-400" />
                              {prop.views}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-extrabold text-lg text-[#1a2b3c] group-hover:text-[#047262] transition-colors duration-200 line-clamp-1">
                            {prop.title}
                          </h3>

                          {/* Address Location */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 text-xs font-medium line-clamp-1">
                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{prop.location}</span>
                          </div>
                        </div>

                        <div>
                          {/* Property Specifications Grid */}
                          <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-gray-100 text-center">
                            {prop.category === 'COMMERCIAL' ? (
                              <>
                                <div className="flex flex-col items-center">
                                  <Home size={18} className="text-gray-600 mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs capitalize">{prop.saleType}</span>
                                  <span className="text-gray-400 text-[10px] font-extrabold uppercase mt-0.5">TYPE</span>
                                </div>
                                <div className="flex flex-col items-center border-x border-gray-100">
                                  <Maximize size={18} className="text-gray-600 mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs">{prop.sqft}</span>
                                  <span className="text-gray-400 text-[10px] font-extrabold uppercase mt-0.5">SQ FT</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <ShieldCheck size={18} className="text-[#047262] mb-1" />
                                  <span className="text-[#047262] font-black text-xs">{prop.legalStatus}</span>
                                  <span className="text-gray-400 text-[10px] font-extrabold uppercase mt-0.5">LEGAL</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col items-center">
                                  <Bed size={18} className="text-gray-600 mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs">{prop.bhk}</span>
                                  <span className="text-gray-400 text-[10px] font-extrabold uppercase mt-0.5">BEDS</span>
                                </div>
                                <div className="flex flex-col items-center border-x border-gray-100">
                                  <Bath size={18} className="text-gray-600 mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs">{prop.baths}</span>
                                  <span className="text-gray-400 text-[10px] font-extrabold uppercase mt-0.5">BATHS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <Maximize size={18} className="text-gray-600 mb-1" />
                                  <span className="text-[#1a2b3c] font-black text-xs">{prop.sqft}</span>
                                  <span className="text-gray-400 text-[10px] font-extrabold uppercase mt-0.5">SQ FT</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => alert(`Showing full brochure & details for ${prop.title}`)}
                            className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm rounded-2xl transition-all duration-200 shadow-[0_4px_15px_rgba(4,114,98,0.2)] hover:shadow-[0_6px_22px_rgba(4,114,98,0.35)] transform hover:-translate-y-0.5"
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
