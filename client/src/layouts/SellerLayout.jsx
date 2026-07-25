import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../assets/logo.png';
import SellerSidebar from '../seller/SellerSidebar';

const SellerLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsMobileSidebarOpen(false);
    setIsMobileNavOpen(false);
    navigate('/login');
  };

  const handleDashboardClick = () => {
    setIsMobileNavOpen(false);
    navigate('/seller/dashboard');
  };

  // Check if we are currently looking at a seller management/dashboard page
  const isDashboardMode = 
    location.pathname.startsWith('/seller/dashboard') ||
    location.pathname.startsWith('/seller/my-listings') ||
    location.pathname.startsWith('/seller/add-property') ||
    location.pathname.startsWith('/seller/leads') ||
    location.pathname.startsWith('/seller/messages') ||
    location.pathname.startsWith('/seller/profile') ||
    location.pathname.startsWith('/seller/support');

  // =========================================================================
  // STATE 1: SELLER DASHBOARD VIEW (Docked Left Sidebar + Main Content)
  // =========================================================================
  if (isDashboardMode) {
    return (
      <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
        {/* Mobile Header Bar for Dashboard Mode */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-xs">
          <Link to="/seller/home" className="flex items-center gap-2.5">
            <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
            <span className="text-[#047262] font-bold text-xl tracking-tight">RealEstate</span>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-700 hover:text-[#047262] focus:outline-none transition-colors"
            aria-label="Open Seller Navigation"
          >
            <Menu size={26} />
          </button>
        </header>

        {/* Docked Desktop Sidebar + Mobile Slide-Out Drawer */}
        <SellerSidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Dashboard Main Content Area (shifted left by 64 (256px) on Desktop) */}
        <main className="flex-1 lg:pl-64 min-h-screen bg-white flex flex-col transition-all duration-300">
          <Outlet />
        </main>
      </div>
    );
  }

  // =========================================================================
  // STATE 2: SELLER BROWSING VIEW (Top Navbar for Home, Browse Properties, etc.)
  // =========================================================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Top Seller Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-6 md:px-12 py-4 border-b border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between relative">
          
          {/* Left: Brand Logo */}
          <Link to="/seller/home" className="flex items-center gap-2.5 group z-10">
            <img 
              src={logo} 
              alt="RealEstate Logo" 
              className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <span className="text-[#047262] font-bold text-xl md:text-2xl tracking-tight">
              RealEstate
            </span>
          </Link>

          {/* Center: White Rounded Nav Pill (Desktop) */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200/80 rounded-full px-9 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] items-center gap-8 z-10">
            <Link 
              to="/seller/home" 
              className={`text-[15px] font-medium transition-colors py-1 ${
                location.pathname === '/seller/home' ? 'text-[#047262] font-semibold' : 'text-[#1a2b3c] hover:text-[#047262]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={`text-[15px] font-medium transition-colors py-1 ${
                location.pathname === '/properties' ? 'text-[#047262] font-semibold' : 'text-[#1a2b3c] hover:text-[#047262]'
              }`}
            >
              Browse Properties
            </Link>
            <button 
              onClick={handleDashboardClick}
              className="text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors py-1 focus:outline-none cursor-pointer flex items-center gap-1"
            >
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Right: User Avatar ("SS") & Logout (Desktop & Tablet) */}
          <div className="flex items-center gap-4 md:gap-5 z-10">
            <div 
              onClick={handleDashboardClick}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#047262] hover:bg-[#03594d] text-white flex items-center justify-center font-bold text-sm md:text-base shadow-[0_4px_12px_rgba(4,114,98,0.3)] transition-all duration-200 transform hover:scale-105 select-none cursor-pointer border-2 border-white"
              title="Logged in as Seller (SS) - Click to open Dashboard"
            >
              SS
            </div>
            
            <button
              onClick={handleLogout}
              className="hidden sm:flex text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors focus:outline-none items-center gap-1.5 py-2 px-1"
            >
              <span>Logout</span>
            </button>

            {/* Mobile Hamburger Icon for smaller viewports */}
            <button 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden text-[#1a2b3c] hover:text-[#047262] focus:outline-none p-1 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu size={28} />
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Nav Menu for Browsing View */}
        {isMobileNavOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 px-2 animate-in fade-in duration-200">
            <Link 
              to="/seller/home" 
              onClick={() => setIsMobileNavOpen(false)}
              className="text-[#1a2b3c] font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 text-base"
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              onClick={() => setIsMobileNavOpen(false)}
              className="text-[#1a2b3c] font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 text-base"
            >
              Browse Properties
            </Link>
            <button 
              onClick={handleDashboardClick}
              className="text-left text-[#047262] font-bold py-2 px-3 rounded-xl bg-[#e0f5f0]/50 text-base"
            >
              Open Dashboard
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pt-20 md:pt-24 flex-1 flex flex-col bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
