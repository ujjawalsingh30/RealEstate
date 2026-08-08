import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Maximize, Building, CheckCircle, 
  MessageSquare, ShieldCheck, Heart, ChevronRight, ChevronUp, Armchair, Home, Sun, Moon
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, getSimilarProperties, wishlistIds, toggleWishlist } = usePropertyContext();
  const { theme, toggleTheme } = useTheme();
  
  const property = getPropertyById(id || '1');
  const similarProperties = getSimilarProperties(property.id, property.city);
  
  const isWishlisted = wishlistIds.includes(property.id);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const userRole = localStorage.getItem('userRole');
  const isBuyer = userRole === 'buyer';

  // Scroll listener for back-to-top floating button
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, property]);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!isBuyer) {
      navigate('/login');
      return;
    }
    if (inquiryMsg.trim()) {
      alert(`Inquiry sent successfully to ${property.seller?.name || 'Seller'} for ${property.title}!`);
      setInquiryMsg('');
    } else {
      alert('Please enter a message before sending your inquiry.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300">
      {/* Main Content Area */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 pb-20">
        
        {/* Breadcrumb & Theme Controls Bar */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-400 flex items-center flex-wrap gap-2">
            <Link to="/" className="hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors flex items-center gap-1">
              <Home size={15} />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
            <Link to="/properties" className="hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors">
              Listings
            </Link>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
            <span className="text-gray-800 dark:text-gray-200 font-bold truncate max-w-[220px] sm:max-w-none">
              {property.title}
            </span>
          </nav>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#1b2b3f] hover:bg-gray-200 dark:hover:bg-[#22354c] text-gray-700 dark:text-amber-400 border border-gray-200 dark:border-gray-700 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
          >
            {theme === 'dark' ? <Sun size={15} className="animate-spin-slow text-amber-400" /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Hero Photo Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {/* Main Hero Architecture Photo */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[400px] lg:h-[480px] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-md group">
            <img 
              src={property.images?.[0] || property.image} 
              alt={property.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70"></div>
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 flex items-end justify-between text-white">
              <div>
                <span className="inline-block px-3 py-1 bg-black/50 backdrop-blur-md text-white font-black text-[11px] rounded-full uppercase tracking-wider mb-2">
                  Verified Photo
                </span>
                <p className="text-sm sm:text-base font-medium text-gray-200 truncate">{property.location}</p>
              </div>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 text-[#1a2b3c] rounded-xl font-bold text-xs sm:text-sm shadow-sm backdrop-blur-md shrink-0">
                1 / {property.images?.length || 3}
              </span>
            </div>
          </div>

          {/* Secondary Stacked Photos */}
          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 h-auto lg:h-[480px]">
            <div className="relative h-[130px] sm:h-[190px] lg:h-[228px] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-md group">
              <img 
                src={property.images?.[1] || property.image} 
                alt="Interior Living Space" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[#1a2b3c] font-black text-[10px] sm:text-xs rounded-lg shadow-sm">
                Living Area
              </span>
            </div>

            <div className="relative h-[130px] sm:h-[190px] lg:h-[228px] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-md group cursor-pointer" onClick={() => alert("Opening interactive fullscreen photo viewing gallery!")}>
              <img 
                src={property.images?.[2] || property.image} 
                alt="Master Suite & Facilities" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center text-white p-2 text-center">
                <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-lg">
                  <Maximize size={18} className="text-white sm:w-5 sm:h-5" />
                </span>
                <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase drop-shadow">View All Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Main Details & Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Detailed Specs, Description, Amenities, Table */}
          <div className="lg:col-span-8 space-y-10 sm:space-y-12">
            
            {/* Title & Header Block */}
            <div className="border-b border-gray-100 pb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-[#047262]/10 text-[#047262] border border-[#047262]/20 font-black text-xs rounded-full uppercase tracking-wider">
                    PREMIUM LISTING
                  </span>
                  {property.isNew && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] rounded-full uppercase tracking-wider">
                      NEW
                    </span>
                  )}
                </div>
                
                {/* Wishlist Heart Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(property.id, navigate)}
                  aria-label="Save to Wishlist"
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105 shadow-rose-100' 
                      : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={22} className={isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-gray-500'} />
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#1a2b3c] tracking-tight mb-3 sm:mb-4 leading-tight">
                {property.title}
              </h1>

              <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 text-gray-600 font-medium text-sm sm:text-base">
                <MapPin size={20} className="text-[#047262] shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-snug">{property.location}, India</span>
              </div>
            </div>

            {/* 5 Specification Cards Grid matching Pic 3 phone view */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                
                <div className="bg-slate-50/70 border border-gray-100/80 rounded-[22px] p-4 sm:p-5 text-center transition-all hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#047262] flex items-center justify-center mx-auto mb-3 shadow-[0_2px_10px_rgba(4,114,98,0.08)]">
                    <Bed size={20} className="text-[#047262]" />
                  </div>
                  <div className="text-[#1a2b3c] font-black text-xl sm:text-2xl leading-tight mb-0.5">{property.bhk}</div>
                  <div className="text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-wider">BEDROOMS</div>
                </div>

                <div className="bg-slate-50/70 border border-gray-100/80 rounded-[22px] p-4 sm:p-5 text-center transition-all hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#047262] flex items-center justify-center mx-auto mb-3 shadow-[0_2px_10px_rgba(4,114,98,0.08)]">
                    <Bath size={20} className="text-[#047262]" />
                  </div>
                  <div className="text-[#1a2b3c] font-black text-xl sm:text-2xl leading-tight mb-0.5">{property.baths}</div>
                  <div className="text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-wider">BATHROOMS</div>
                </div>

                <div className="bg-slate-50/70 border border-gray-100/80 rounded-[22px] p-4 sm:p-5 text-center transition-all hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#047262] flex items-center justify-center mx-auto mb-3 shadow-[0_2px_10px_rgba(4,114,98,0.08)]">
                    <Armchair size={20} className="text-[#047262]" />
                  </div>
                  <div className="text-[#1a2b3c] font-black text-base sm:text-xl leading-tight mb-0.5 truncate">{property.furnishing}</div>
                  <div className="text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-wider">FURNISHING</div>
                </div>

                <div className="bg-slate-50/70 border border-gray-100/80 rounded-[22px] p-4 sm:p-5 text-center transition-all hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#047262] flex items-center justify-center mx-auto mb-3 shadow-[0_2px_10px_rgba(4,114,98,0.08)]">
                    <Maximize size={20} className="text-[#047262]" />
                  </div>
                  <div className="text-[#1a2b3c] font-black text-base sm:text-xl leading-tight mb-0.5 truncate">{property.sqft} Sqft</div>
                  <div className="text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-wider">LIVING AREA</div>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-slate-50/70 border border-gray-100/80 rounded-[22px] p-4 sm:p-5 text-center transition-all hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#047262] flex items-center justify-center mx-auto mb-3 shadow-[0_2px_10px_rgba(4,114,98,0.08)]">
                    <Building size={20} className="text-[#047262]" />
                  </div>
                  <div className="text-[#1a2b3c] font-black text-base sm:text-xl leading-tight mb-0.5 truncate">{property.type}</div>
                  <div className="text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-wider">TYPE</div>
                </div>

              </div>
            </div>

            {/* Description Section matching Pic 3 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2b3c] mb-4">
                Description
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities Section matching Pic 3 & 5 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2b3c] mb-6">
                Amenities
              </h2>
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-x-6 sm:gap-y-5">
                {(property.amenities || ['Parking', 'Power Backup', 'Club House', 'Pool', 'Gym', 'Garden', 'Security', 'Wifi']).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-800 font-semibold sm:font-medium text-base sm:text-lg">
                    <div className="w-6 h-6 rounded-full bg-[#047262] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <CheckCircle size={16} className="text-white fill-current" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MOBILE ONLY: Inline Sidebar placed right after Amenities to match Pic 4 & 5 */}
            <div className="block lg:hidden pt-4 pb-2">
              {/* Listing Price Card */}
              <div className="bg-[#047262] text-white rounded-[28px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(4,114,98,0.25)] relative overflow-hidden mb-6">
                <div className="relative z-10">
                  <p className="text-xs sm:text-sm font-extrabold text-teal-100 uppercase tracking-wider mb-1.5">
                    LISTING PRICE
                  </p>
                  <p className="text-4xl sm:text-5xl font-black tracking-tight mb-2 text-white">
                    {property.priceText}
                  </p>
                  <p className="text-teal-100 text-xs sm:text-sm font-medium">
                    Available for Sale
                  </p>
                </div>
              </div>

              {/* Seller Profile & Inquire Widget */}
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] mb-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-5 mb-5">
                  {property.seller?.name === 'Hexagon' || property.seller?.icon === 'hexagon' ? (
                    <div className="w-14 h-14 bg-gradient-to-tr from-[#0b3370] to-[#1c64e5] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md transform rotate-45 overflow-hidden">
                      <div className="transform -rotate-45 text-2xl font-black tracking-tighter text-white drop-shadow">
                        ✨
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#047262] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                      {property.seller?.initials || 'SE'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-[#1a2b3c]">{property.seller?.name || 'Seller'}</h3>
                    <div className="flex items-center gap-1.5 text-[#047262] font-bold text-sm mt-0.5">
                      <ShieldCheck size={16} className="text-[#047262] shrink-0 fill-current text-white" />
                      <span>{property.seller?.role || 'Verified Seller'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Starting interactive live chat with ${property.seller?.name || 'Seller'}`)}
                  className="w-full py-3.5 text-[#1a2b3c] hover:text-[#047262] bg-gray-50/80 hover:bg-gray-100 font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 mb-6 border border-gray-100"
                >
                  <MessageSquare size={18} />
                  <span>Chat</span>
                </button>

                <h4 className="text-lg sm:text-xl font-bold text-[#1a2b3c] mb-4">
                  Inquire
                </h4>

                {!isBuyer ? (
                  <div className="bg-[#f8fafc] p-6 rounded-[22px] border border-gray-100 text-center">
                    <p className="text-sm sm:text-base font-semibold text-gray-600 mb-4">
                      Please login as a buyer to send inquiries.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-md block text-center"
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <textarea
                      rows={3}
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder="I am interested in this property and would like to schedule a visit..."
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:border-[#047262] focus:ring-2 focus:ring-[#047262]/20 text-sm sm:text-base text-gray-800 outline-none resize-none transition-all placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm sm:text-base rounded-2xl transition-all duration-200 shadow-md"
                    >
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Property Details Table Card matching Pic 1 & Pic 4 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2b3c] mb-6">
                Property Details
              </h2>
              <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
                
                <div className="flex justify-between items-center py-3.5 sm:py-5 border-b border-gray-100">
                  <span className="text-gray-500 font-normal text-base sm:text-lg">Property ID</span>
                  <span className="font-semibold text-gray-900 text-base sm:text-lg tracking-wide uppercase">{property.displayId || '642B896E'}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 sm:py-5 border-b border-gray-100">
                  <span className="text-gray-500 font-normal text-base sm:text-lg">Added On</span>
                  <span className="font-semibold text-gray-900 text-base sm:text-lg">{property.addedOn || '4/15/2026'}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 sm:py-5 border-b border-gray-100">
                  <span className="text-gray-500 font-normal text-base sm:text-lg">Property Type</span>
                  <span className="font-semibold text-gray-900 text-base sm:text-lg">{property.type || 'Flat'}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 sm:py-5">
                  <span className="text-gray-500 font-normal text-base sm:text-lg">Status</span>
                  <span className="font-semibold text-gray-900 text-base sm:text-lg">{property.status || 'For Sale'}</span>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN STICKY SIDEBAR: Desktop view of Price & Inquiry Widget */}
          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {/* Listing Price Card */}
            <div className="bg-[#047262] text-white rounded-[28px] p-8 shadow-[0_12px_40px_rgba(4,114,98,0.25)] relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-extrabold text-teal-100 uppercase tracking-wider mb-1.5">
                  LISTING PRICE
                </p>
                <p className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-white">
                  {property.priceText}
                </p>
                <p className="text-teal-100 text-xs font-medium">
                  Available for Sale
                </p>
              </div>
            </div>

            {/* Seller Profile & Inquire Widget */}
            <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                {property.seller?.name === 'Hexagon' || property.seller?.icon === 'hexagon' ? (
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#0b3370] to-[#1c64e5] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md transform rotate-45 overflow-hidden">
                    <div className="transform -rotate-45 text-2xl font-black tracking-tighter text-white drop-shadow">
                      ✨
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#047262] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    {property.seller?.initials || 'SE'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-[#1a2b3c]">{property.seller?.name || 'Seller'}</h3>
                  <div className="flex items-center gap-1.5 text-[#047262] font-bold text-sm mt-0.5">
                    <ShieldCheck size={16} className="text-[#047262] shrink-0 fill-current text-white" />
                    <span>{property.seller?.role || 'Verified Seller'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Starting interactive live chat with ${property.seller?.name || 'Seller'}`)}
                className="w-full py-3.5 text-[#1a2b3c] hover:text-[#047262] bg-gray-50 hover:bg-gray-100 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 mb-6 border border-gray-100/80"
              >
                <MessageSquare size={18} />
                <span>Chat</span>
              </button>

              <h4 className="text-xl font-bold text-[#1a2b3c] mb-4">
                Inquire
              </h4>

              {!isBuyer ? (
                <div className="bg-[#f8fafc] p-6 rounded-[22px] border border-gray-100 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-4">
                    Please login as a buyer to send inquiries.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm rounded-2xl transition-all duration-200 shadow-[0_4px_15px_rgba(4,114,98,0.2)] block text-center"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <textarea
                    rows={3}
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="I am interested in this property and would like to schedule a visit..."
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:border-[#047262] focus:ring-2 focus:ring-[#047262]/20 text-sm text-gray-800 outline-none resize-none transition-all placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm rounded-2xl transition-all duration-200 shadow-[0_4px_15px_rgba(4,114,98,0.2)]"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* SIMILAR PROPERTIES SECTION matching Pic 1 & Pic 4 */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a2b3c] tracking-tight mb-1">
            Similar Properties
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-4">
            Listings you might like in {property.city || 'Delhi'}.
          </p>
          
          <div className="mb-8">
            <Link to="/properties" className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-[#047262] transition-colors">
              <span>All Listings</span>
              <span className="text-lg leading-none font-black ml-1">›</span>
            </Link>
          </div>

          {similarProperties.length === 0 ? (
            <div className="bg-[#f8fafc]/70 border border-gray-100 rounded-[28px] sm:rounded-[36px] py-14 sm:py-20 px-6 sm:px-12 text-center max-w-3xl my-6">
              <p className="text-gray-500 font-medium text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
                No similar properties found in this location.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {similarProperties.slice(0, 3).map((simProp) => (
                <div 
                  key={simProp.id} 
                  onClick={() => navigate(`/properties/${simProp.id}`)}
                  className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img 
                      src={simProp.images?.[0] || simProp.image} 
                      alt={simProp.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#047262] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-full shadow-md">
                      {simProp.category}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col flex-grow">
                    <p className="text-2xl font-black text-[#047262] mb-2">
                      {simProp.priceText}
                    </p>
                    <h3 className="text-lg font-bold text-[#1a2b3c] line-clamp-1 group-hover:text-[#047262] transition-colors mb-2">
                      {simProp.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm mb-6 flex-grow">
                      <MapPin size={15} className="text-[#047262] shrink-0" />
                      <span className="truncate">{simProp.location}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-gray-600 text-xs sm:text-sm font-bold">
                      <span>{simProp.bhk} BHK</span>
                      <span>•</span>
                      <span>{simProp.baths} Baths</span>
                      <span>•</span>
                      <span>{simProp.sqft} Sqft</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PropertyDetails;
