import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Sun, Moon, Loader2, AlertCircle } from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { addSellerRequest, showToast } = usePropertyContext();
  const { theme, toggleTheme } = useTheme();
  const { registerUser, loading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('buyer');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = {
      name: fullName,
      email,
      password,
      phone,
      ...(role === 'seller' && { agencyName: agencyName || 'Independent Realtor' })
    };

    const res = await registerUser(formData, role);

    if (res.success) {
      if (role === 'seller') {
        if (addSellerRequest) addSellerRequest({ name: fullName, email, phone });
        if (showToast) showToast('Seller Account registered! Pending admin review for property additions.', 'success');
        navigate('/seller/dashboard');
      } else {
        if (showToast) showToast('Account successfully registered as Buyer!', 'success');
        navigate('/buyer/home');
      }
    } else {
      setErrorMessage(res.message || 'Registration failed. Email may already be in use.');
      if (showToast) showToast(res.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="bg-white dark:bg-[#162231] rounded-[2rem] p-8 md:p-11 shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-700 max-w-md w-full transition-all duration-300 my-4 relative">
        
        {/* Top Controls: Back Button & Theme Toggle */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#047262] dark:hover:text-white text-xs md:text-sm font-extrabold transition-all transform hover:-translate-x-1 duration-200 focus:outline-none w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Back</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-[#047262] mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">
            Join our real estate platform to discover or publish listings
          </p>
        </div>

        {/* Error Notification Badge */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2.5 text-red-700 dark:text-red-300 text-xs font-bold animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Select Role Field First */}
          <div>
            <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2 text-left">
              Select Account Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setRole('buyer'); setErrorMessage(''); }}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none ${
                  role === 'buyer'
                    ? 'bg-[#e0f5f0] dark:bg-[#047262]/30 text-[#047262] dark:text-[#2de2c5] border-2 border-[#047262] shadow-xs'
                    : 'bg-white dark:bg-[#1b2b3f] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                Buyer (Find Homes)
              </button>
              <button
                type="button"
                onClick={() => { setRole('seller'); setErrorMessage(''); }}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none ${
                  role === 'seller'
                    ? 'bg-[#e0f5f0] dark:bg-[#047262]/30 text-[#047262] dark:text-[#2de2c5] border-2 border-[#047262] shadow-xs'
                    : 'bg-white dark:bg-[#1b2b3f] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                Seller (List Properties)
              </button>
            </div>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2 text-left">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#1b2b3f] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#047262] dark:focus:border-amber-400 focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
            />
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
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#1b2b3f] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#047262] dark:focus:border-amber-400 focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
            />
          </div>

          {/* Phone Number (Optional / Recommended) */}
          <div>
            <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2 text-left">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 bg-white dark:bg-[#1b2b3f] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#047262] dark:focus:border-amber-400 focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
            />
          </div>

          {/* Agency Name Field (Only shown for Sellers) */}
          {role === 'seller' && (
            <div className="animate-fadeIn">
              <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2 text-left">
                Agency / Company Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Metro Prime Real Estate (Optional)"
                className="w-full px-4 py-3 bg-white dark:bg-[#1b2b3f] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#047262] dark:focus:border-amber-400 focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-[#1a2b3c] dark:text-gray-200 text-sm font-extrabold mb-2 text-left">
              Password
            </label>
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
            className="w-full flex items-center justify-center gap-2 bg-[#047262] hover:bg-[#03594d] disabled:bg-gray-400 text-white font-extrabold text-base py-3.5 rounded-xl shadow-[0_8px_20px_rgba(4,114,98,0.25)] hover:shadow-[0_12px_25px_rgba(4,114,98,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create {role === 'seller' ? 'Seller' : 'Buyer'} Account</span>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#047262] font-black hover:underline ml-1 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
