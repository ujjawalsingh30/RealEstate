import React from 'react';
import { MapPin, Home, Search, ShieldCheck, ChevronDown } from 'lucide-react';
import bannerImage from '../assets/bannerimage.png';

const Hero = () => {
  return (
    <section className="pt-8 md:pt-12 pb-16 px-6 md:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
      {/* Left Column - Content */}
      <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="inline-block bg-[#e0f5f0] text-[#047262] font-bold text-[10px] md:text-[11px] tracking-widest px-4 py-2 rounded-full mb-6 md:mb-8 uppercase">
          Trusted by 20,000+ Homeowners
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-extrabold text-[#1a2b3c] leading-[1.2] lg:leading-[1.1] mb-4 md:mb-6">
          Find Your <span className="text-[#047262]">Perfect</span><br />
          Next Chapter.
        </h1>
        
        <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0">
          Experience the most advanced real estate search platform. Discover
          verified listings, connect with top agents, and find a place you'll
          love.
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl md:rounded-full p-4 md:p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2 w-full max-w-[700px] mb-12 lg:mb-16 relative z-10 border border-gray-100">
          
          {/* Location Input */}
          <div className="flex items-center gap-4 md:gap-3 px-2 md:px-6 py-2 w-full md:w-auto flex-1">
            <MapPin className="text-[#047262] flex-shrink-0" size={22} strokeWidth={2.5} />
            <div className="flex flex-col w-full text-left">
              <span className="text-[11px] font-black text-gray-900 tracking-wider">LOCATION</span>
              <input 
                type="text" 
                placeholder="Where are you looking?" 
                className="text-sm text-gray-500 outline-none w-full bg-transparent mt-0.5 font-medium placeholder:font-normal" 
              />
            </div>
          </div>

          <div className="block md:hidden w-full h-px bg-gray-100"></div>
          <div className="hidden md:block w-px h-10 bg-gray-200"></div>

          {/* Property Type Input */}
          <div className="flex items-center gap-4 md:gap-3 px-2 md:px-6 py-2 w-full md:w-auto flex-1 cursor-pointer">
            <Home className="text-[#047262] flex-shrink-0" size={22} strokeWidth={2.5} />
            <div className="flex flex-col w-full relative text-left">
              <span className="text-[11px] font-black text-gray-900 tracking-wider">PROPERTY TYPE</span>
              <div className="flex items-center justify-between mt-0.5">
                <select className="text-sm text-gray-800 font-medium outline-none w-full bg-transparent appearance-none cursor-pointer">
                  <option>Select Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                </select>
                <ChevronDown size={14} className="text-gray-500 pointer-events-none absolute right-0" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button className="bg-[#047262] hover:bg-[#03594d] text-white px-8 py-4 md:py-4 rounded-xl md:rounded-full flex items-center justify-center gap-2 font-bold transition-all w-full md:w-auto shadow-lg shadow-[#047262]/30 mt-2 md:mt-0">
            <Search size={18} strokeWidth={3} /> 
            Search
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:flex items-center justify-center lg:justify-start gap-y-8 gap-x-6 md:gap-12 w-full max-w-sm md:max-w-none mx-auto lg:mx-0">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black text-[#1a2b3c]">12k+</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">READY PROPERTIES</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-gray-300"></div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black text-[#1a2b3c]">500+</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">AGENT NETWORK</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-gray-300"></div>
          <div className="flex flex-col col-span-2 md:col-span-1 mt-2 md:mt-0">
            <span className="text-2xl md:text-3xl font-black text-[#1a2b3c]">4.9/5</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">USER RATING</span>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="w-full lg:w-[45%] relative mt-16 lg:mt-0">
        <div className="relative w-full max-w-md lg:max-w-none mx-auto">
          <img 
            src={bannerImage} 
            alt="Modern Luxury Home" 
            className="w-full h-[400px] lg:h-auto rounded-[2.5rem] object-cover shadow-2xl"
          />
          
          {/* Floating Card */}
          <div className="absolute -bottom-6 left-0 right-0 mx-auto md:left-auto md:right-auto md:-left-12 bg-white/85 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/40 flex items-center justify-center md:justify-start gap-4 w-[90%] max-w-[280px]">
            <div className="bg-[#e0f5f0] p-3 rounded-xl flex-shrink-0">
              <ShieldCheck className="text-[#047262]" size={26} strokeWidth={2.5} />
            </div>
            
            <div className="flex flex-col flex-1 text-left">
              <span className="font-extrabold text-[#1a2b3c] text-sm leading-tight">Verified<br/>Listing</span>
              <span className="text-[10px] text-gray-600 mt-1 leading-tight font-medium">Inspected by our<br/>professional team</span>
            </div>

            <div className="bg-[#e0f5f0] text-[#047262] text-[8px] font-extrabold px-2 py-1.5 rounded-lg text-center leading-tight">
              PRE-<br/>APPROVED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
