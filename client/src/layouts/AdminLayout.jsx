import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';
import logo from '../assets/logo.png';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsMobileSidebarOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      
      {/* Mobile Top App Bar (Visible on < 1024px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-gray-100 flex items-center justify-between shadow-xs">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
          <span className="text-[#047262] font-bold text-xl tracking-tight">RealEstate</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <Shield size={10} className="fill-amber-500 text-amber-600" />
            <span>Admin</span>
          </span>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-700 hover:text-[#047262] focus:outline-none transition-colors"
            aria-label="Open Admin Navigation"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Docked Desktop Sidebar + Mobile Slide-Out Drawer */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Admin Content Area (shifted right by 64 (256px) on Desktop) */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen bg-gray-50 flex flex-col transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
