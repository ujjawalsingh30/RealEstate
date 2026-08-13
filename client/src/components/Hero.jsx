import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Home as HomeIcon, Search, ShieldCheck, ChevronDown, 
  Sparkles, Star, Building, DollarSign, ArrowRight 
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
    navigate('/properties');
  };

  const tabs = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'projects', label: 'New Projects' }
  ];

  return (
    <section className="relative pt-6 sm:pt-10 md:pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1500px] mx-auto text-left font-sans antialiased">
      
      {/* Background Accent Glows */}
      <div className="absolute top-10 left-1/4 -z-10 w-96 h-96 bg-[#047262]/5 dark:bg-[#0dc5a5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 -z-10 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 w-full">
        
        {/* =========================================================================
            BENTO CARD 1: MAIN SHOWCASE (Image + Headline) - Spans 8 Cols
           ========================================================================= */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gray-900 shadow-2xl h-[420px] sm:h-[480px] lg:h-[540px] group border border-gray-200/50 dark:border-gray-800 flex flex-col justify-end p-6 sm:p-10">
          
          {/* Background Image with Hover Scale */}
          <img 
            src={bannerImage} 
            alt="Luxury Real Estate" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl transform transition-transform duration-700 translate-y-2 group-hover:translate-y-0">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-emerald-500/20 backdrop-blur-md border border-white/20 dark:border-emerald-400/30 text-white dark:text-emerald-300 font-extrabold text-[10px] sm:text-xs tracking-widest uppercase mb-5">
              <Sparkles size={14} className="text-emerald-400" />
              India's #1 Audited Portal
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4 drop-shadow-lg">
              Find Your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">Perfect</span> Next Chapter.
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-lg shadow-black drop-shadow-md">
              Discover exclusive luxury properties in premium locations with zero-commission deals and RERA certified agents.
            </p>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 2: SEARCH CONSOLE - Spans 4 Cols
           ========================================================================= */}
        <div className="lg:col-span-4 bg-white/95 dark:bg-[#162231]/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)] dark:shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1a2b3c] dark:text-white mb-6 flex items-center gap-2">
              <Search className="text-[#047262] dark:text-emerald-400" size={24} /> Search Properties
            </h3>
            
            {/* Tabs */}
            <div className="flex bg-gray-100/80 dark:bg-[#0b131e] p-1.5 rounded-2xl mb-6 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-[#1c2c40] text-[#047262] dark:text-[#0dc5a5] shadow-sm scale-[1.02] border border-gray-200 dark:border-gray-700' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Vertical Form Fields */}
            <form onSubmit={handleSearch} className="space-y-4">
              
              {/* Location Input */}
              <div className="bg-gray-50/80 dark:bg-[#111a27] rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-800 hover:border-[#047262]/30 dark:hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1e2f45] shadow-sm flex items-center justify-center text-[#047262] dark:text-[#0dc5a5] shrink-0">
                  <MapPin size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col w-full text-left">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-wider">LOCATION</span>
                  <input 
                    type="text" 
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="City, neighborhood..." 
                    className="text-sm text-[#1a2b3c] dark:text-gray-100 outline-none w-full bg-transparent mt-0.5 font-bold placeholder:font-normal placeholder:text-gray-400" 
                  />
                </div>
              </div>

              {/* Type Select */}
              <div className="bg-gray-50/80 dark:bg-[#111a27] rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-800 hover:border-[#047262]/30 dark:hover:border-emerald-500/30 transition-colors cursor-pointer relative">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1e2f45] shadow-sm flex items-center justify-center text-[#047262] dark:text-[#0dc5a5] shrink-0">
                  <HomeIcon size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col w-full text-left">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-wider">PROPERTY TYPE</span>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-sm text-[#1a2b3c] dark:text-gray-100 font-bold outline-none w-full bg-transparent appearance-none cursor-pointer mt-0.5 pr-8"
                  >
                    <option className="dark:bg-[#162231]">All Types</option>
                    <option className="dark:bg-[#162231]">Villa / House</option>
                    <option className="dark:bg-[#162231]">Apartment</option>
                    <option className="dark:bg-[#162231]">Penthouse</option>
                  </select>
                </div>
                <ChevronDown size={16} className="text-gray-400 absolute right-4 pointer-events-none" />
              </div>

              {/* Budget Select */}
              <div className="bg-gray-50/80 dark:bg-[#111a27] rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-800 hover:border-[#047262]/30 dark:hover:border-emerald-500/30 transition-colors cursor-pointer relative">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1e2f45] shadow-sm flex items-center justify-center text-[#047262] dark:text-[#0dc5a5] shrink-0">
                  <DollarSign size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col w-full text-left">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-wider">BUDGET RANGE</span>
                  <select 
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="text-sm text-[#1a2b3c] dark:text-gray-100 font-bold outline-none w-full bg-transparent appearance-none cursor-pointer mt-0.5 pr-8"
                  >
                    <option className="dark:bg-[#162231]">Any Budget</option>
                    <option className="dark:bg-[#162231]">₹50L - ₹1.5 Cr</option>
                    <option className="dark:bg-[#162231]">₹1.5 Cr - ₹5 Cr</option>
                    <option className="dark:bg-[#162231]">₹5 Cr+ Luxury</option>
                  </select>
                </div>
                <ChevronDown size={16} className="text-gray-400 absolute right-4 pointer-events-none" />
              </div>
            </form>
          </div>

          <button 
            onClick={handleSearch}
            className="mt-6 w-full bg-gradient-to-r from-[#047262] to-[#0bc4a1] hover:from-[#03594d] hover:to-[#047262] dark:from-[#0dc5a5] dark:to-emerald-600 text-white dark:text-slate-950 font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform transform hover:scale-102 active:scale-95 shadow-xl shadow-[#047262]/20 dark:shadow-emerald-900/30"
          >
            Explore Listings <ArrowRight size={18} />
          </button>
        </div>

        {/* =========================================================================
            BOTTOM BENTO CARDS: METRICS (Spans 4 Cols Each)
           ========================================================================= */}
        
        {/* Metric 1: Verified Properties */}
        <div className="lg:col-span-4 bg-[#f0faf7] dark:bg-emerald-900/10 border border-[#047262]/10 dark:border-emerald-500/20 rounded-[2rem] p-6 sm:p-8 flex items-center gap-5 shadow-sm transform hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 bg-white dark:bg-emerald-500/20 rounded-2xl shadow-sm flex items-center justify-center text-[#047262] dark:text-emerald-400 shrink-0">
            <Building size={26} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1a2b3c] dark:text-white tracking-tight">12,500+</div>
            <div className="text-xs sm:text-sm font-bold text-[#047262] dark:text-emerald-500 mt-0.5">Verified Properties</div>
          </div>
        </div>

        {/* Metric 2: RERA Certified */}
        <div className="lg:col-span-4 bg-white dark:bg-[#162231] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 sm:p-8 flex items-center gap-5 shadow-sm transform hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <ShieldCheck size={26} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1a2b3c] dark:text-white tracking-tight">100% Secure</div>
            <div className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 mt-0.5">RERA Certified Agents</div>
          </div>
        </div>

        {/* Metric 3: User Rating */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#1a2b3c] to-[#0b131e] dark:from-[#0b131e] dark:to-black border border-gray-800 rounded-[2rem] p-6 sm:p-8 flex items-center justify-between shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-transform group">
          <div className="relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">4.9/5</div>
            <div className="text-xs sm:text-sm font-bold text-gray-400 mt-0.5">User Satisfaction</div>
          </div>
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
            <Star size={26} className="fill-amber-400 text-amber-400" />
          </div>
          {/* Decorative Glow inside dark card */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/20 blur-[50px] rounded-full pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

export default Hero;
