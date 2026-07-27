import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart, Trash2, Home, ChevronRight, Sun, Moon } from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { properties, wishlistIds, toggleWishlist } = usePropertyContext();
  const { theme, toggleTheme } = useTheme();

  const savedProperties = properties.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b131e] flex flex-col justify-between font-sans antialiased transition-colors duration-300">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-24 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors flex items-center gap-1">
            <Home size={15} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
          <span className="text-gray-800 dark:text-gray-200 font-bold">My Wishlist</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              You have {savedProperties.length} property saved in your wishlist.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-3.5 bg-white dark:bg-[#162231] hover:bg-gray-100 dark:hover:bg-[#1e2f45] text-gray-700 dark:text-amber-400 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm shadow-xs"
            >
              {theme === 'dark' ? <Sun size={18} className="animate-spin-slow text-amber-400" /> : <Moon size={18} />}
              <span className="hidden sm:inline text-xs">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button 
              onClick={() => navigate('/properties')}
              className="px-6 py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm rounded-2xl transition-all shadow-md"
            >
              Browse More Listings
            </button>
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-gray-100 p-12 sm:p-20 text-center shadow-sm my-8">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart size={32} className="fill-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-[#1a2b3c] mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Explore our verified luxury apartments and signature villas to save your favorite properties for quick access later.
            </p>
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-8 py-4 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-base rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              Explore Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedProperties.map((prop) => (
              <div 
                key={prop.id}
                className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden cursor-pointer" onClick={() => navigate(`/properties/${prop.id}`)}>
                  <img 
                    src={prop.images?.[0] || prop.image} 
                    alt={prop.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#047262] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-full shadow-md">
                    {prop.category}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prop.id, navigate);
                    }}
                    title="Remove from Wishlist"
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-rose-600 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-6 sm:p-7 flex flex-col flex-grow">
                  <p className="text-2xl font-black text-[#047262] mb-2">
                    {prop.priceText}
                  </p>
                  <h3 
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="text-lg font-bold text-[#1a2b3c] line-clamp-1 group-hover:text-[#047262] transition-colors mb-2 cursor-pointer"
                  >
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm mb-6 flex-grow">
                    <MapPin size={16} className="text-[#047262] shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-gray-600 text-xs sm:text-sm font-bold mb-6">
                    <div className="flex items-center gap-1">
                      <Bed size={16} className="text-gray-400" />
                      <span>{prop.bhk} BHK</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Bath size={16} className="text-gray-400" />
                      <span>{prop.baths} Baths</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Maximize size={16} className="text-gray-400" />
                      <span>{prop.sqft} Sqft</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="w-full py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm rounded-2xl transition-all shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
