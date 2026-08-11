import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, Home } from 'lucide-react';
import Loader from '../auth/Loader';
const ProtectedRoute = ({ allowedRole, allowedRoles, children }) => {
  const { token, role, loading } = useAuth();
  const location = useLocation();

  const hasToken = !!(token || localStorage.getItem('authToken'));
  const currentRole = role || localStorage.getItem('userRole') || 'buyer';

  // Display clean spinner during active authentication state transition
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
        <Loader text="Verifying secure access" />
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
