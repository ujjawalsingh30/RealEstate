import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutGrid, FileText, TrendingUp, MessageSquare, User, LifeBuoy, LogOut, X } from 'lucide-react';
import logo from '../assets/logo.png';

const SellerSidebar = ({ isMobileOpen, onCloseMobile, onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutGrid size={20} /> },
    { name: 'My Listings', path: '/seller/my-listings', icon: <FileText size={20} /> },
    { name: 'Leads', path: '/seller/leads', icon: <TrendingUp size={20} /> },
    { name: 'Messages', path: '/seller/messages', icon: <MessageSquare size={20} /> },
    { name: 'Profile', path: '/seller/profile', icon: <User size={20} /> },
    { name: 'Support', path: '/seller/support', icon: <LifeBuoy size={20} /> },
  ];

  const renderNavLinks = (onClickHandler = () => {}) => (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={onClickHandler}
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
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar (Docked) */}
      <aside className="hidden lg:flex w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-gray-100/80 p-6 flex-col justify-between z-40 shadow-[2px_0_20px_rgba(0,0,0,0.01)]">
        <div>
          {/* Header & Logo (Links back to Seller Home) */}
          <div className="mb-10 px-2 pt-2">
            <Link to="/seller/home" className="flex items-center gap-3 group" title="Go to Seller Home">
              <img src={logo} alt="RealEstate Logo" className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105" />
              <span className="text-[#047262] font-bold text-2xl tracking-tight">
                RealEstate
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          {renderNavLinks()}
        </div>

        {/* Bottom Logout Button */}
        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 bg-red-50/50 hover:bg-red-100/70 text-red-500 hover:text-red-600 font-medium text-[15px] rounded-2xl transition-all duration-200 text-left shadow-xs"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Out Sidebar Drawer (< lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300"
            onClick={onCloseMobile}
          />

          {/* Slide-out Panel */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Mobile Header & Logo */}
              <div className="flex items-center justify-between pb-6 mb-4 border-b border-gray-100/80">
                <Link to="/seller/home" onClick={onCloseMobile} className="flex items-center gap-2.5 group">
                  <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
                  <span className="text-[#047262] font-bold text-xl tracking-tight">
                    RealEstate
                  </span>
                </Link>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  title="Close Sidebar"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>
              </div>

              {/* Navigation Items (closing mobile drawer on click) */}
              {renderNavLinks(onCloseMobile)}
            </div>

            {/* Bottom Logout Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 font-bold text-sm rounded-2xl transition-all duration-200 text-left shadow-xs"
              >
                <LogOut size={18} className="flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default SellerSidebar;
