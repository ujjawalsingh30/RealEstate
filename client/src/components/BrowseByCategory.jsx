import React from 'react';
import { Building2, Home, Building, Store } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Modern Flats',
    propertiesCount: '5 Properties',
    icon: <Building2 className="text-[#047262]" size={28} strokeWidth={2} />,
  },
  {
    id: 2,
    title: 'Luxury Villas',
    propertiesCount: '2 Properties',
    icon: <Home className="text-[#047262]" size={28} strokeWidth={2} />,
  },
  {
    id: 3,
    title: 'Penthouse',
    propertiesCount: '1 Properties',
    icon: <Building className="text-[#047262]" size={28} strokeWidth={2} />,
  },
  {
    id: 4,
    title: 'Commercial',
    propertiesCount: '1 Properties',
    icon: <Store className="text-[#047262]" size={28} strokeWidth={2} />,
  },
];

const BrowseByCategory = () => {
  return (
    <section className="py-8 md:py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
      {/* Heading & Subtext - Left aligned on all screens */}
      <div className="flex flex-col items-start text-left mb-8 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a2b3c] mb-3 md:mb-4 tracking-tight">
          Browse by Category
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
          Explore curated collections of properties tailored to your specific
          lifestyle and needs.
        </p>
      </div>

      {/* Category Cards Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:py-12 md:px-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-[0_15px_35px_rgb(4,114,98,0.1)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            {/* Icon Container */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#e0f5f0] group-hover:bg-[#d0f0e7] transition-colors rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm">
              {cat.icon}
            </div>

            {/* Category Name */}
            <h3 className="text-[#1a2b3c] font-black text-sm md:text-xl mb-1 md:mb-1.5 group-hover:text-[#047262] transition-colors">
              {cat.title}
            </h3>

            {/* Properties Count */}
            <span className="text-gray-500 text-[11px] md:text-xs font-medium tracking-wide">
              {cat.propertiesCount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrowseByCategory;
