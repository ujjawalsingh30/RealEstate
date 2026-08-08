import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Menu, Shield, Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png';
import AdminSidebar from '../admin/AdminSidebar';
import { usePropertyContext } from '../context/PropertyContext';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = usePropertyContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsMobileSidebarOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col font-sans antialiased transition-colors duration-300">
      
      {/* Mobile Top App Bar (Visible on < 1024px) */}
      <header className="lg:hidden relative z-40 bg-white/95 dark:bg-[#0f1926]/95 backdrop-blur-md px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-xs">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
          <span className="text-[#047262] dark:text-[#0dc5a5] font-bold text-xl tracking-tight">RealEstate</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#1b2b3f] text-[#1a2b3c] dark:text-amber-400 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-2xs"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <Shield size={10} className="fill-amber-500 text-amber-600 dark:text-amber-400" />
            <span>Admin</span>
          </span>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#047262] focus:outline-none transition-colors"
            aria-label="Open Admin Navigation"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        {/* Docked Desktop Sidebar + Mobile Slide-Out Drawer */}
        <AdminSidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Admin Content Area */}
        <main className="flex-1 min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors duration-300 w-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
