import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, ShieldCheck, Eye, MapPin, Bed, Bath, Maximize, Home, ArrowRight, Sparkles 
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';

const FeaturedCollections = () => {
  const { properties = [], wishlistIds = [], toggleWishlist, loading } = usePropertyContext();
  const navigate = useNavigate();

  // Pick top 6 properties for a 2-row showcase grid (3 cards per row)
  const featuredList = properties.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 bg-white dark:bg-black text-center font-sans antialiased border-t border-gray-100/80 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1500px] mx-auto">
        
        {/* ===================================================================
            SECTION HEADER
            =================================================================== */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="bg-[#e0f5f0] text-[#047262] font-black text-xs px-4 py-1.5 rounded-full inline-block uppercase tracking-wider mb-4 shadow-2xs">
            HANDPICKED FOR YOU
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a2b3c] tracking-tight mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-500 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
            Discover high-value properties curated by our experts for their exceptional design, location, and investment potential.
          </p>
        </div>

        {/* ===================================================================
            3 PROPERTY CARDS IN ONE ROW GRID
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left items-stretch">
          {loading ? (
            Array(6).fill(0).map((_, idx) => (
              <div key={`shimmer-${idx}`} className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
                <div className="h-64 sm:h-72 bg-gray-200 dark:bg-[#203147] animate-pulse shrink-0 w-full relative">
                  <div className="absolute top-4 left-4 h-6 w-20 bg-gray-300 dark:bg-[#2a405c] rounded-full animate-pulse z-10"></div>
                  <div className="absolute top-4 right-4 h-10 w-10 bg-gray-300 dark:bg-[#2a405c] rounded-full animate-pulse z-10"></div>
                  <div className="absolute bottom-4 left-5 h-8 w-32 bg-gray-300 dark:bg-[#2a405c] rounded-md animate-pulse z-10"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between mb-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-[#203147] rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 dark:bg-[#203147] rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-[#203147] rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-[#203147] rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-2 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="h-10 bg-gray-200 dark:bg-[#203147] rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 dark:bg-[#203147] rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 dark:bg-[#203147] rounded animate-pulse"></div>
                  </div>
                  <div className="pt-5 mt-auto">
                    <div className="h-12 w-full bg-gray-200 dark:bg-[#203147] rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            featuredList.map((prop, idx) => {
              const isFav = wishlistIds.includes(prop.id || prop._id);
              return (
                <div
                  key={prop._id || prop.id || idx}
                  onClick={() => navigate(`/properties/${prop._id || prop.id}`)}
                  className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(4,114,98,0.12)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col group cursor-pointer"
                >
                  {/* Photo & Price Overlay */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={prop.images?.[0] || prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay for bottom price text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

                    {/* Top Left Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      {prop.isNew && (
                        <span className="bg-white text-[#1a2b3c] font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          NEW
                        </span>
                      )}
                      {prop.verified && (
                        <span className="bg-[#047262] text-white font-black text-[11px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <ShieldCheck size={13} strokeWidth={3} />
                          <span>VERIFIED</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prop._id || prop.id, navigate);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-gray-700 transition-all duration-200 shadow-md transform active:scale-90 hover:scale-110 focus:outline-none z-10"
                      title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Wishlist toggle"
                    >
                      <Heart
                        size={19}
                        className={`transition-colors duration-300 ${
                          isFav ? 'text-rose-600 fill-rose-600' : 'text-gray-500 hover:text-rose-500'
                        }`}
                      />
                    </button>

                    {/* Bottom Price Text Overlay */}
                    <div className="absolute bottom-4 left-5 z-10">
                      <span className="text-white font-black text-2xl sm:text-3xl tracking-tight drop-shadow-md">
                        {prop.priceText}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Title */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      {/* Category & Views */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#047262] font-black text-xs tracking-wider uppercase">
                          {prop.category || 'LUXURY RESIDENCE'}
                        </span>
                        <span className="text-gray-400 font-extrabold text-xs flex items-center gap-1.5">
                          <Eye size={15} className="text-gray-400" />
                          <span>{prop.views || 42}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-lg sm:text-xl text-[#1a2b3c] group-hover:text-[#047262] transition-colors duration-200 line-clamp-1">
                        {prop.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 text-xs sm:text-sm font-semibold line-clamp-1">
                        <MapPin size={15} className="text-[#047262] shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>
                    </div>

                    {/* Bottom Specifications Row */}
                    <div className="grid grid-cols-3 gap-2 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800 text-center">
                      {prop.category === 'COMMERCIAL' ? (
                        <>
                          <div className="flex flex-col items-center">
                            <Home size={17} className="text-[#047262] mb-1" />
                            <span className="text-[#1a2b3c] dark:text-white font-black text-xs sm:text-sm capitalize">{prop.saleType || 'sale'}</span>
                            <span className="text-gray-400 text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">TYPE</span>
                          </div>
                          <div className="flex flex-col items-center border-x border-gray-100 dark:border-gray-800">
                            <Maximize size={17} className="text-[#047262] mb-1" />
                            <span className="text-[#1a2b3c] dark:text-white font-black text-xs sm:text-sm">{prop.sqft || '980'}</span>
                            <span className="text-gray-400 text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">SQ FT</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <ShieldCheck size={17} className="text-[#047262] mb-1" />
                            <span className="text-[#1a2b3c] dark:text-white font-black text-xs sm:text-sm uppercase">{prop.legalStatus || 'OK'}</span>
                            <span className="text-gray-400 text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">LEGAL</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center">
                            <Bed size={17} className="text-[#047262] mb-1" />
                            <span className="text-[#1a2b3c] dark:text-white font-black text-xs sm:text-sm">{prop.bhk || '3'}</span>
                            <span className="text-gray-400 text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5 tracking-wider">BEDS</span>
                          </div>
                          <div className="flex flex-col items-center border-x border-gray-100 dark:border-gray-800">
                            <Bath size={17} className="text-[#047262] mb-1" />
                            <span className="text-[#1a2b3c] dark:text-white font-black text-xs sm:text-sm">{prop.baths || '3'}</span>
                            <span className="text-gray-400 text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5 tracking-wider">BATHS</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Maximize size={17} className="text-[#047262] mb-1" />
                            <span className="text-[#1a2b3c] dark:text-white font-black text-xs sm:text-sm">{prop.sqft || '1850'}</span>
                            <span className="text-gray-400 text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5 tracking-wider">SQ FT</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* View Details Action Button */}
                    <div className="pt-5 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/properties/${prop._id || prop.id}`);
                        }}
                        className="w-full py-3.5 px-4 bg-[#e0f5f0]/80 dark:bg-[#1e2f45] group-hover:bg-[#047262] dark:group-hover:bg-[#0dc5a5] text-[#047262] dark:text-[#0dc5a5] group-hover:text-white dark:group-hover:text-slate-950 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xs active:scale-95"
                      >
                        <span>View Details</span>
                        <ArrowRight size={17} strokeWidth={2.5} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===================================================================
            VIEW ALL PROPERTIES BUTTON
            =================================================================== */}
        <div className="mt-14 sm:mt-16 text-center">
          <button
            onClick={() => navigate('/properties')}
            className="px-9 py-4 bg-[#1a2b3c] hover:bg-[#047262] active:scale-95 text-white rounded-2xl font-black text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#047262]/20 inline-flex items-center gap-2.5"
          >
            <span>Explore All Properties</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollections;
