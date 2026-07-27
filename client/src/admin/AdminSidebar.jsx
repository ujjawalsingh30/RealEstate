import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Users, ShieldCheck, Building, MessageSquare, 
  Inbox, LogOut, X, User, ChevronUp, Lock, Shield
} from 'lucide-react';
import logo from '../assets/logo.png';

const AdminSidebar = ({ isMobileOpen, onCloseMobile = () => {}, onLogout = () => {} }) => {
  const navigate = useNavigate();
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutGrid size={20} /> },
    { name: 'Users Manager', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Seller Requests', path: '/admin/seller-requests', icon: <ShieldCheck size={20} /> },
    { name: 'Properties', path: '/admin/properties', icon: <Building size={20} /> },
    { name: 'Message Inbox', path: '/admin/message-inbox', icon: <Inbox size={20} /> },
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
                ? 'bg-[#d8f4ec] text-[#047262] font-extrabold shadow-xs'
                : 'text-gray-500 font-semibold hover:text-[#047262] hover:bg-[#e0f5f0]/30'
            }`
          }
        >
          <span className="shrink-0">{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* =====================================================================
          DESKTOP FIXED LEFT SIDEBAR (DOCK VIEW)
          ===================================================================== */}
      <aside className="hidden lg:flex w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-gray-100/80 p-6 flex-col justify-between z-40 shadow-[2px_0_20px_rgba(0,0,0,0.01)]">
        <div>
          {/* Header & Logo */}
          <div className="mb-8 px-2 pt-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3 group" title="Admin Overview">
              <img src={logo} alt="RealEstate Logo" className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105" />
              <span className="text-[#047262] font-bold text-2xl tracking-tight">
                RealEstate
              </span>
            </Link>
            <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-lg w-fit">
              <Shield size={12} className="text-amber-600 fill-amber-500" />
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Root Admin Console</span>
            </div>
          </div>

          {/* Navigation Items */}
          {renderNavLinks()}
        </div>

        {/* Bottom Profile Avatar Dropdown (Upward Popover) */}
        <div className="relative pt-4 border-t border-gray-100">
          {/* Dropdown Popover Menu */}
          {isDesktopProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDesktopProfileOpen(false)} 
              />
              <div className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2.5 border-b border-gray-100 mb-1.5 text-left">
                  <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">Signed in as</span>
                  <span className="text-sm font-black text-[#1a2b3c] truncate block">Platform Administrator</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsDesktopProfileOpen(false);
                    navigate('/admin/profile');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-gray-700 hover:text-[#047262] hover:bg-[#e0f5f0]/60 rounded-xl transition-all text-left"
                >
                  <User size={18} className="text-[#047262]" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDesktopProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left mt-1 border-t border-gray-100 pt-3"
                >
                  <LogOut size={18} className="text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}

          {/* Profile Trigger Card */}
          <button
            type="button"
            onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
            className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-gray-50/70 hover:bg-gray-100/90 border border-gray-100 hover:border-gray-200/80 transition-all text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs border-2 border-white">
                AD
              </div>
              <div className="truncate">
                <p className="text-sm font-extrabold text-[#1a2b3c] truncate group-hover:text-[#047262] transition-colors">Admin Console</p>
                <p className="text-[11px] font-bold text-gray-400 truncate">Root Account</p>
              </div>
            </div>
            <ChevronUp size={18} className={`text-gray-400 transition-transform duration-200 shrink-0 ${isDesktopProfileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MOBILE SLIDE-OUT SIDEBAR DRAWER (< lg)
          ===================================================================== */}
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
              <div className="flex items-center justify-between pb-5 mb-4 border-b border-gray-100/80">
                <Link to="/admin/dashboard" onClick={onCloseMobile} className="flex items-center gap-2.5 group">
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

              <div className="mb-4 flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-lg w-fit">
                <Shield size={12} className="text-amber-600 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Root Admin Console</span>
              </div>

              {/* Navigation Items (closing mobile drawer on click) */}
              {renderNavLinks(onCloseMobile)}
            </div>

            {/* Mobile Bottom Profile Avatar Dropdown */}
            <div className="relative pt-4 border-t border-gray-100">
              {/* Dropdown Popover Menu */}
              {isMobileProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMobileProfileOpen(false)} 
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[20px] shadow-xl border border-gray-100 p-2 z-50 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileProfileOpen(false);
                        onCloseMobile();
                        navigate('/admin/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-gray-700 hover:text-[#047262] hover:bg-[#e0f5f0]/60 rounded-xl transition-all"
                    >
                      <User size={17} className="text-[#047262]" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all border-t border-gray-100 mt-1"
                    >
                      <LogOut size={17} className="text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}

              {/* Mobile Profile Trigger Card */}
              <button
                type="button"
                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-gray-50/80 hover:bg-gray-100 border border-gray-100 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    AD
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-extrabold text-[#1a2b3c] truncate">Admin Console</p>
                    <p className="text-[11px] font-semibold text-gray-400 truncate">Root Account</p>
                  </div>
                </div>
                <ChevronUp size={17} className={`text-gray-400 transition-transform duration-200 shrink-0 ${isMobileProfileOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
