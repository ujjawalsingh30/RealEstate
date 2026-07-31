import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Sun, Moon, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePropertyContext } from '../context/PropertyContext';

const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const { loginUser, loading } = useAuth();
  const { showToast } = usePropertyContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('buyer');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = await loginUser(email, password, role);

    if (res.success) {
      if (showToast) showToast(res.message || 'Welcome back! Login successful.', 'success');

      // Navigate based on verified role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'seller') {
        navigate('/seller/home');
      } else {
        navigate('/buyer/home');
      }
    } else {
      setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      if (showToast) showToast(res.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-[#0b131e] transition-colors duration-300">
      <div className="bg-white dark:bg-[#162231] rounded-[2rem] p-8 md:p-11 shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-700 max-w-md w-full transition-all duration-300 relative">
        
        {/* Top Controls: Back Button & Theme Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#047262] dark:hover:text-white text-xs md:text-sm font-extrabold transition-all transform hover:-translate-x-1 duration-200 focus:outline-none w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#1b2b3f] text-[#1a2b3c] dark:text-amber-400 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-105 transition-all shadow-2xs"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} className="animate-spin-slow" /> : <Moon size={17} />}
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-[#047262] mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-normal">
            Sign in to access your properties, dashboard, and messages
          </p>
        </div>

        {/* Error Notification Badge */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2.5 text-red-700 dark:text-red-300 text-xs font-bold animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection (Buyer / Seller / Admin Toggle) */}
          <div>
            <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2.5 text-left">
              Select Account Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-50 dark:bg-[#111c29] rounded-2xl border border-gray-200/60 dark:border-gray-700">
              <button
                type="button"
                onClick={() => { setRole('buyer'); setErrorMessage(''); }}
                className={`py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
                  role === 'buyer'
                    ? 'bg-[#e0f5f0] dark:bg-[#047262]/30 text-[#047262] dark:text-[#2de2c5] border border-[#047262]/20 shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-transparent border border-transparent'
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => { setRole('seller'); setErrorMessage(''); }}
                className={`py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
                  role === 'seller'
                    ? 'bg-[#e0f5f0] dark:bg-[#047262]/30 text-[#047262] dark:text-[#2de2c5] border border-[#047262]/20 shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-transparent border border-transparent'
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setErrorMessage(''); }}
                className={`py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
                  role === 'admin'
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-300/50 shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-transparent border border-transparent'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2 text-left">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@realestate.com' : 'name@company.com'}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#1b2b3f] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#047262] dark:focus:border-amber-400 focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold text-left">
                Password
              </label>
              <Link
                to="/reset-password"
                className="text-xs font-bold text-[#047262] dark:text-amber-400 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-4 pr-11 py-3 bg-white dark:bg-[#1b2b3f] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#047262] dark:focus:border-amber-400 focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#047262] hover:bg-[#03594d] disabled:bg-gray-400 text-white font-extrabold text-base py-3.5 rounded-xl shadow-[0_8px_20px_rgba(4,114,98,0.25)] hover:shadow-[0_12px_25px_rgba(4,114,98,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#047262] font-black hover:underline ml-1 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
