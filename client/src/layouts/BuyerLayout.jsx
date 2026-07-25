import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Building, Heart, MessageSquare, Phone, LogOut, User } from 'lucide-react';
import logo from '../assets/logo.png';

const BuyerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/buyer/home', icon: <Home size={18} /> },
    { name: 'Property', path: '/properties', icon: <Building size={18} /> },
    { name: 'Wishlist', path: '/wishlist', icon: <Heart size={18} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={18} /> },
    { name: 'Contact Us', path: '/contact-us', icon: <Phone size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Buyer Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-6 md:px-12 py-4 border-b border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link to="/buyer/home" className="flex items-center gap-2.5 group">
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
          <nav className="hidden lg:flex items-center gap-8 xl:gap-11 bg-white border border-gray-200/80 rounded-full px-10 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-[15px] font-medium transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#047262] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#047262] after:rounded-full'
                      : 'text-[#1a2b3c] hover:text-[#047262]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: User Avatar ("SI") & Logout (Desktop) */}
          <div className="hidden sm:flex items-center gap-4 md:gap-5">
            <div 
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#047262] hover:bg-[#03594d] text-white flex items-center justify-center font-bold text-sm md:text-base shadow-[0_4px_12px_rgba(4,114,98,0.3)] transition-all duration-200 transform hover:scale-105 select-none cursor-pointer border-2 border-white"
              title="Logged in as Buyer (SI)"
            >
              SI
            </div>
            <button
              onClick={handleLogout}
              className="text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors focus:outline-none flex items-center gap-1.5 py-2 px-1"
            >
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#047262] text-white flex items-center justify-center font-black text-sm shadow-sm">
              SI
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-700 hover:text-[#047262] focus:outline-none transition-colors"
              aria-label="Open Buyer Navigation Menu"
            >
              <Menu size={28} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Sliding Side Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative bg-white w-72 max-w-[80vw] h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header with User Info */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#047262] text-white flex items-center justify-center font-black text-base shadow-md">
                    SI
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1a2b3c] text-base leading-tight">Signed In</h4>
                    <span className="text-xs font-bold text-[#047262]">Buyer Account</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label="Close Menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="mt-6 flex flex-col space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-[#e0f5f0] text-[#047262] font-semibold shadow-xs'
                          : 'text-gray-700 font-normal hover:bg-gray-50 hover:text-[#047262]'
                      }`
                    }
                  >
                    <span className="text-[#047262]">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Drawer Footer: Logout */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3.5 rounded-2xl transition-colors text-sm shadow-xs"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area with top padding for fixed navbar */}
      <main className="flex-1 pt-20 md:pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default BuyerLayout;
