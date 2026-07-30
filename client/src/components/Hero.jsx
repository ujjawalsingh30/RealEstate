import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Home as HomeIcon, Search, ShieldCheck, ChevronDown, 
  Sparkles, TrendingUp, Star, CheckCircle2, ArrowRight, Building, DollarSign 
} from 'lucide-react';
import bannerImage from '../assets/bannerimage.png';

const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [locationInput, setLocationInput] = useState('');
  const [selectedType, setSelectedType] = useState('Select Type');
  const [selectedBudget, setSelectedBudget] = useState('Any Budget');

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to listings page with filter criteria
    navigate('/properties');
  };

  const tabs = [
    { id: 'buy', label: 'Buy Property' },
    { id: 'rent', label: 'Rent / Lease' },
    { id: 'projects', label: 'New Projects' },
    { id: 'commercial', label: 'Commercial' },
  ];

  return (
    <section className="relative pt-6 sm:pt-10 md:pt-12 pb-20 px-4 sm:px-6 md:px-12 max-w-[1450px] mx-auto overflow-hidden text-left font-sans antialiased">
      
      {/* Subtle Background Accent Glows */}
      <div className="absolute top-10 left-1/4 -z-10 w-72 h-72 bg-[#047262]/10 dark:bg-[#0dc5a5]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 -z-10 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10">
        
        {/* =========================================================================
            LEFT COLUMN: HEADLINE, TABS & INTERACTIVE SEARCH
           ========================================================================= */}
        <div className="w-full lg:w-[56%] flex flex-col items-start text-left z-10">
          
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0f5f0] dark:bg-[#0dc5a5]/15 border border-[#047262]/20 dark:border-[#0dc5a5]/30 text-[#047262] dark:text-[#0dc5a5] font-extrabold text-[11px] sm:text-xs tracking-wider uppercase mb-6 sm:mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#047262] dark:bg-[#0dc5a5] animate-ping" />
            <Sparkles size={14} className="shrink-0" />
            <span>India's #1 AI-Audited & Trusted Property Portal</span>
          </div>
          
          {/* Main Headline with Highlight Tone */}
          <h1 className="text-3xl sm:text-5xl lg:text-[4.2rem] font-black text-[#1a2b3c] dark:text-white leading-[1.15] lg:leading-[1.08] tracking-tight mb-5 sm:mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#047262] via-[#0bc4a1] to-[#03594d] dark:from-[#0dc5a5] dark:via-teal-300 dark:to-emerald-400">Perfect</span> <br className="hidden sm:inline" />
            Next Chapter.
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl font-normal">
            Experience the most advanced real estate marketplace. Explore over 20,000+ legal audited residences, connect instantly with RERA certified agents, and negotiate zero-commission deals.
          </p>

          {/* =========================================================================
              MULTI-TAB INTERACTIVE SEARCH CAPSULE
             ========================================================================= */}
          <div className="w-full max-w-[760px] mb-12 sm:mb-16">
            
            {/* Purpose Selector Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-200/60 dark:bg-[#13202e] p-1.5 rounded-2xl w-fit mb-3 border border-gray-200/50 dark:border-gray-800 backdrop-blur-md">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-white dark:bg-[#1c2c40] text-[#047262] dark:text-[#0dc5a5] shadow-sm scale-102 border border-gray-100 dark:border-gray-700' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-[#1a2b3c] dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Main Pill Search Box */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-3 sm:p-4 md:p-3 shadow-[0_15px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)] border border-gray-100/90 dark:border-gray-800 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-2 relative z-20 transition-all duration-300">
              
              {/* Location Field */}
              <div className="flex items-center gap-3 px-3 sm:px-4 py-2 flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-[#e0f5f0]/80 dark:bg-[#1e2f45] flex items-center justify-center text-[#047262] dark:text-[#0dc5a5] shrink-0">
                  <MapPin size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col w-full text-left">
                  <span className="text-[10px] sm:text-[11px] font-black text-gray-800 dark:text-gray-300 tracking-wider">LOCATION</span>
                  <input 
                    type="text" 
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Search by city, landmark..." 
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-100 outline-none w-full bg-transparent mt-0.5 font-bold placeholder:font-normal placeholder:text-gray-400 truncate" 
                  />
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-700/80 my-auto shrink-0" />
              <div className="block md:hidden w-full h-px bg-gray-100 dark:bg-gray-800" />

              {/* Property Type Field */}
              <div className="flex items-center gap-3 px-3 sm:px-4 py-2 md:w-[190px] lg:w-[180px] cursor-pointer shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#e0f5f0]/80 dark:bg-[#1e2f45] flex items-center justify-center text-[#047262] dark:text-[#0dc5a5] shrink-0">
                  <HomeIcon size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col w-full relative text-left">
                  <span className="text-[10px] sm:text-[11px] font-black text-gray-800 dark:text-gray-300 tracking-wider">TYPE</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 font-bold outline-none w-full bg-transparent appearance-none cursor-pointer pr-5 truncate"
                    >
                      <option className="dark:bg-[#162231]">All Types</option>
                      <option className="dark:bg-[#162231]">Flat/Apartment</option>
                      <option className="dark:bg-[#162231]">Villa / House</option>
                      <option className="dark:bg-[#162231]">Penthouse</option>
                      <option className="dark:bg-[#162231]">Commercial</option>
                    </select>
                    <ChevronDown size={14} className="text-gray-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="hidden lg:block w-px h-10 bg-gray-200 dark:bg-gray-700/80 my-auto shrink-0" />
              <div className="block lg:hidden w-full h-px bg-gray-100 dark:bg-gray-800" />

              {/* Budget Range Selector (Visible on larger screens) */}
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 w-[170px] cursor-pointer shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#e0f5f0]/80 dark:bg-[#1e2f45] flex items-center justify-center text-[#047262] dark:text-[#0dc5a5] shrink-0">
                  <DollarSign size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col w-full relative text-left">
                  <span className="text-[11px] font-black text-gray-800 dark:text-gray-300 tracking-wider">BUDGET</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <select 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="text-sm text-gray-800 dark:text-gray-100 font-bold outline-none w-full bg-transparent appearance-none cursor-pointer pr-5 truncate"
                    >
                      <option className="dark:bg-[#162231]">Any Budget</option>
                      <option className="dark:bg-[#162231]">Under ₹50 Lakhs</option>
                      <option className="dark:bg-[#162231]">₹50L - ₹1.5 Cr</option>
                      <option className="dark:bg-[#162231]">₹1.5 Cr - ₹5 Cr</option>
                      <option className="dark:bg-[#162231]">₹5 Cr+ Luxury</option>
                    </select>
                    <ChevronDown size={14} className="text-gray-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Glowing Search Button */}
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#047262] to-[#058a75] hover:from-[#03594d] hover:to-[#047262] dark:from-[#0dc5a5] dark:to-emerald-600 text-white dark:text-slate-950 font-black px-8 py-4 sm:py-4 md:py-4 rounded-[22px] sm:rounded-3xl md:rounded-[28px] flex items-center justify-center gap-2.5 transition-all transform hover:scale-102 active:scale-95 shadow-lg shadow-[#047262]/25 dark:shadow-emerald-900/30 shrink-0 w-full md:w-auto mt-2 md:mt-0 cursor-pointer"
              >
                <Search size={19} strokeWidth={3} className="text-white dark:text-slate-950" /> 
                <span className="text-base">Explore</span>
              </button>
            </form>
          </div>

          {/* =========================================================================
              KEY PERFORMANCE METRICS & COMMUNITY PROOF
             ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center justify-start gap-y-6 gap-x-8 sm:gap-12 w-full pt-2 border-t border-gray-200/60 dark:border-gray-800/80">
            
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-black text-[#1a2b3c] dark:text-white tracking-tight">12,500+</span>
                <span className="text-[#047262] dark:text-[#0dc5a5] font-black text-sm">✦</span>
              </div>
              <span className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">
                Verified Inventory
              </span>
            </div>
            
            <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-800" />
            
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-black text-[#1a2b3c] dark:text-white tracking-tight">500+</span>
                <CheckCircle2 size={16} className="text-[#047262] dark:text-[#0dc5a5] fill-[#047262]/20 shrink-0 ml-0.5" />
              </div>
              <span className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">
                RERA Agent Network
              </span>
            </div>
            
            <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-800" />
            
            <div className="flex flex-col text-left col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#1a2b3c] dark:text-white tracking-tight">4.9/5</span>
                <div className="flex items-center text-amber-400">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">
                User Satisfaction Rate
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: PREMIUM ARCHITECTURAL SHOWCASE & FLOATING GLASS CARDS
           ========================================================================= */}
        <div className="w-full lg:w-[42%] relative mt-8 lg:mt-0 flex justify-center">
          <div className="relative w-full max-w-[520px] lg:max-w-none">
            
            {/* Background Decorative Frame Glow */}
            <div className="absolute -inset-2 rounded-[3rem] bg-gradient-to-tr from-[#047262]/20 via-transparent to-blue-500/20 dark:from-emerald-500/10 dark:to-indigo-500/10 blur-xl -z-10" />

            {/* Main Architectural Showcase Photo */}
            <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-4 border-white dark:border-gray-800 group">
              <img 
                src={bannerImage} 
                alt="Modern Luxury Residence" 
                className="w-full h-[380px] sm:h-[480px] lg:h-[540px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-75 group-hover:opacity-85 transition-opacity" />

              {/* Top Left Floating Tag: Live Tour Enabled */}
              <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold text-[11px] tracking-wide uppercase">Live 3D Tour Available</span>
              </div>
            </div>
            
            {/* ---------------------------------------------------------------------
                FLOATING GLASS CARD 1 (Bottom Left): RERA Verified Badge
               --------------------------------------------------------------------- */}
            <div className="absolute -bottom-6 left-3 sm:-left-8 bg-white/95 dark:bg-[#162231]/95 backdrop-blur-xl rounded-[22px] sm:rounded-3xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)] border border-gray-100 dark:border-gray-700/80 flex items-center gap-4 z-30 max-w-[280px] sm:max-w-[310px] transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-[#e0f5f0] dark:bg-emerald-500/20 p-3 sm:p-3.5 rounded-2xl shrink-0 text-[#047262] dark:text-[#0dc5a5] shadow-sm">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              
              <div className="flex flex-col flex-1 text-left">
                <span className="font-extrabold text-[#1a2b3c] dark:text-white text-sm sm:text-base leading-tight">
                  100% Verified Listing
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight font-medium">
                  Inspected by our licensed SLA technical auditors
                </span>
              </div>

              <div className="bg-gradient-to-br from-[#047262] to-[#03594d] dark:from-[#0dc5a5] dark:to-emerald-600 text-white dark:text-slate-950 font-black text-[9px] px-2.5 py-2 rounded-xl text-center uppercase tracking-wider shrink-0 shadow-sm">
                RERA <br/> PASSED
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                FLOATING GLASS CARD 2 (Top Right): Market Trends Pill
               --------------------------------------------------------------------- */}
            <div className="hidden sm:flex absolute top-10 -right-8 bg-white/95 dark:bg-[#162231]/95 backdrop-blur-xl rounded-2xl p-3 px-4 shadow-[0_12px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)] border border-gray-100 dark:border-gray-700/80 items-center gap-3 z-30 transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <TrendingUp size={18} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-[#1a2b3c] dark:text-white">+18.4% ROI Growth</div>
                <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-400">Prime Metro Sector Value</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
