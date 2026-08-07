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
  // FEATURE REMOVED: Role restrictions and the "Access Denied" screen have been disabled as requested.
  // Any logged-in user can now access this route regardless of their specific role.

  // 3. Authenticated and Authorized!
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
