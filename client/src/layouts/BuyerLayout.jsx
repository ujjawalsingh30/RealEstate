import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Building, Heart, MessageSquare, Phone, LogOut, User, Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png';
import { usePropertyContext } from '../context/PropertyContext';

const BuyerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = usePropertyContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b131e] flex flex-col transition-colors duration-300">
      {/* Sticky Buyer Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0f1926]/95 backdrop-blur-md px-6 md:px-12 py-3.5 border-b border-gray-100 dark:border-gray-800 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link to="/buyer/home" className="flex items-center gap-2.5 group">
            <img 
              src={logo} 
              alt="RealEstate Logo" 
              className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <span className="text-[#047262] dark:text-[#0dc5a5] font-black text-xl md:text-2xl tracking-tight">
              RealEstate
            </span>
          </Link>

          {/* Center: Rounded Nav Pill (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-10 bg-white dark:bg-[#162231] border border-gray-200/80 dark:border-[#28394e] rounded-full px-9 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-bold transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#047262] dark:text-[#0dc5a5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#047262] dark:after:bg-[#0dc5a5] after:rounded-full'
                      : 'text-[#1a2b3c] dark:text-gray-300 hover:text-[#047262] dark:hover:text-[#0dc5a5]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: Theme Toggle, User Avatar & Logout (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-[#1b2b3f] text-[#1a2b3c] dark:text-amber-400 border border-gray-200/70 dark:border-gray-700/60 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all duration-200"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={19} className="animate-spin-slow" /> : <Moon size={19} />}
            </button>

            <div className="relative">
              <div 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] text-white flex items-center justify-center font-black text-sm md:text-base shadow-md transition-all duration-200 transform hover:scale-105 select-none cursor-pointer border-2 border-white dark:border-gray-800"
                title="Account Options"
              >
                SI
              </div>

              {/* Profile Avatar Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#162231] rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-700 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-gray-700 mb-1.5 text-left">
                      <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">Signed in as</span>
                      <span className="text-sm font-black text-[#1a2b3c] dark:text-white truncate block">Buyer Account</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/buyer/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-[#047262] dark:hover:text-[#0dc5a5] hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl transition-all text-left"
                    >
                      <User size={18} className="text-[#047262] dark:text-[#0dc5a5]" />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all text-left mt-1 border-t border-gray-100 dark:border-gray-700 pt-3"
                    >
                      <LogOut size={18} className="text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex sm:hidden items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#1b2b3f] text-[#1a2b3c] dark:text-amber-400 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-2xs"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <div className="relative">
              <div 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-9 h-9 rounded-xl bg-[#047262] text-white flex items-center justify-center font-black text-sm shadow-sm cursor-pointer select-none"
              >
                SI
              </div>

              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#162231] rounded-[20px] shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/buyer/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#047262] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <User size={17} className="text-[#047262]" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all border-t border-gray-100 dark:border-gray-700 mt-1"
                    >
                      <LogOut size={17} className="text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-gray-700 dark:text-gray-200 hover:text-[#047262] focus:outline-none transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={26} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Sliding Side Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative bg-white dark:bg-[#131f2f] w-72 max-w-[80vw] h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header with User Info */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#047262] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e] flex items-center justify-center font-black text-base shadow-md">
                    SI
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1a2b3c] dark:text-white text-base leading-tight">Signed In</h4>
                    <span className="text-xs font-bold text-[#047262] dark:text-[#0dc5a5]">Buyer Account</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 transition-colors"
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
                          ? 'bg-[#e0f5f0] dark:bg-[#047262]/20 text-[#047262] dark:text-[#0dc5a5] font-extrabold shadow-2xs'
                          : 'text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#047262]'
                      }`
                    }
                  >
                    <span className="text-[#047262] dark:text-[#0dc5a5]">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Drawer Footer: Theme Option & Logout */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appearance</span>
                <button
                  onClick={toggleTheme}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#1a2b3f] text-[#1a2b3c] dark:text-amber-400 font-bold text-xs flex items-center gap-2 shadow-2xs"
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold py-3.5 rounded-2xl transition-colors text-sm shadow-xs"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area with top padding for fixed navbar */}
      <main className="flex-1 pt-20 md:pt-22 transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default BuyerLayout;
