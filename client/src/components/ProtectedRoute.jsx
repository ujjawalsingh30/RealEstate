import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, Home } from 'lucide-react';

const ProtectedRoute = ({ allowedRole, allowedRoles, children }) => {
  const { token, role, loading } = useAuth();
  const location = useLocation();

  const hasToken = !!(token || localStorage.getItem('authToken'));
  const currentRole = role || localStorage.getItem('userRole') || 'buyer';

  // Display clean spinner during active authentication state transition
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0b131e] transition-colors duration-300 gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#e0f5f0] dark:bg-[#047262]/20 flex items-center justify-center text-[#047262] dark:text-[#2de2c5] shadow-lg animate-pulse">
          <Loader2 size={26} className="animate-spin" />
        </div>
        <p className="text-sm font-extrabold text-[#1a2b3c] dark:text-gray-200 tracking-wide">
          Verifying secure access...
        </p>
      </div>
    );
  }

  // 1. Verify Session Token (Unauthenticated -> Redirect to Login with callback state)
  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Verify Role Authorization
  const permittedRoles = allowedRoles ? allowedRoles : allowedRole ? [allowedRole] : null;

  if (permittedRoles && !permittedRoles.includes(currentRole)) {
    // Helper to safely navigate user back to their designated workspace
    const getFallbackPath = () => {
      if (currentRole === 'admin') return '/admin/dashboard';
      if (currentRole === 'seller') return '/seller/dashboard';
      return '/buyer/home';
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0b131e] transition-colors duration-300">
        <div className="bg-white dark:bg-[#162231] max-w-md w-full rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700 text-center relative animate-fadeIn">
          
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center justify-center text-red-500 shadow-xs">
            <ShieldAlert size={36} strokeWidth={2.2} />
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[#1a2b3c] dark:text-white mb-2 tracking-tight">
            Access Denied
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium leading-relaxed">
            Your active user role (<span className="font-extrabold text-[#047262] dark:text-[#2de2c5] capitalize">{currentRole}</span>) lacks authorization to access this secured page.
          </p>

          <div className="space-y-3">
            <Link
              to={getFallbackPath()}
              className="w-full flex items-center justify-center gap-2 bg-[#047262] hover:bg-[#03594d] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(4,114,98,0.25)] transition-all transform hover:-translate-y-0.5"
            >
              <Home size={18} />
              <span>Go to {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Workspace</span>
            </Link>

            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#1b2b3f] hover:bg-gray-200 dark:hover:bg-[#23374f] text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              <span>Switch Account / Re-login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated and Authorized!
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
