import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, FileText, TrendingUp, MessageSquare, User, LifeBuoy, LogOut, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const SellerLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsMobileOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutGrid size={20} /> },
    { name: 'My Listings', path: '/seller/my-listings', icon: <FileText size={20} /> },
    { name: 'Leads', path: '/seller/leads', icon: <TrendingUp size={20} /> },
    { name: 'Messages', path: '/seller/messages', icon: <MessageSquare size={20} /> },
    { name: 'Profile', path: '/seller/profile', icon: <User size={20} /> },
    { name: 'Support', path: '/seller/support', icon: <LifeBuoy size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-xs">
        <Link to="/seller/dashboard" className="flex items-center gap-2.5">
          <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
          <span className="text-[#047262] font-bold text-xl tracking-tight">RealEstate</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-700 hover:text-[#047262] focus:outline-none transition-colors"
          aria-label="Open Seller Navigation Menu"
        >
          <Menu size={26} />
        </button>
      </header>

      {/* Desktop Left Sidebar (Fixed) */}
      <aside className="hidden lg:flex w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-gray-100/80 p-6 flex-col justify-between z-40 shadow-[2px_0_20px_rgba(0,0,0,0.01)]">
        <div>
          {/* Brand Logo */}
          <div className="mb-10 px-2 pt-2">
            <Link to="/seller/dashboard" className="flex items-center gap-3 group">
              <img 
                src={logo} 
                alt="RealEstate Logo" 
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="text-[#047262] font-bold text-2xl tracking-tight">
                RealEstate
              </span>
            </Link>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] transition-all duration-200 ${
                    isActive
                      ? 'bg-[#d8f4ec] text-[#047262] font-bold shadow-xs'
                      : 'text-gray-500 font-medium hover:text-[#047262] hover:bg-[#e0f5f0]/30'
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:text-red-600 hover:bg-red-50/70 font-medium text-[15px] rounded-2xl transition-all duration-200 text-left"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Out Sidebar Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Drawer Panel */}
          <aside className="relative bg-white w-72 max-w-[80vw] h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <Link 
                  to="/seller/dashboard" 
                  className="flex items-center gap-2.5"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
                  <span className="text-[#047262] font-bold text-xl tracking-tight">RealEstate</span>
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-[#d8f4ec] text-[#047262] font-bold shadow-xs'
                          : 'text-gray-500 font-medium hover:text-[#047262] hover:bg-[#e0f5f0]/30'
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm rounded-2xl transition-all duration-200 text-left"
              >
                <LogOut size={18} className="flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content View area */}
      <main className="flex-1 lg:pl-64 min-h-screen bg-white flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
