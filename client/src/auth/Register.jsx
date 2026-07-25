import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('buyer');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration attempt:', { fullName, email, password, role });
    // Add registration logic here, for example redirecting based on role or to login
    // if (role === 'seller') navigate('/seller/dashboard');
    // else navigate('/properties');
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white rounded-[2rem] p-8 md:p-11 shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-gray-100 max-w-md w-full transition-all duration-300 my-4 relative">
        
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-[#047262] mb-6 text-xs md:text-sm font-extrabold transition-all transform hover:-translate-x-1 duration-200 focus:outline-none w-fit"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#047262] mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm font-normal">
            Join our community to find or list properties
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Field */}
          <div>
            <label className="block text-[#1a2b3c] text-sm font-extrabold mb-2 text-left">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
            />
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-[#1a2b3c] text-sm font-extrabold mb-2 text-left">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#1a2b3c] text-sm font-extrabold mb-2 text-left">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#047262] focus:ring-4 focus:ring-[#047262]/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Select Role Field */}
          <div>
            <label className="block text-[#1a2b3c] text-sm font-extrabold mb-2 text-left">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none ${
                  role === 'buyer'
                    ? 'bg-[#e0f5f0] text-[#1a2b3c] border-2 border-[#047262] shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none ${
                  role === 'seller'
                    ? 'bg-[#e0f5f0] text-[#1a2b3c] border-2 border-[#047262] shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                Seller
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#047262] hover:bg-[#03594d] text-white font-extrabold text-base py-3.5 rounded-xl shadow-[0_8px_20px_rgba(4,114,98,0.25)] hover:shadow-[0_12px_25px_rgba(4,114,98,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-4"
          >
            Create Account
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
