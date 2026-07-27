import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, RefreshCw, LifeBuoy, CheckCircle2, Building, 
  TrendingUp, Plus, ArrowUpRight, ShieldCheck, Sparkles, Eye 
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';

const SellerDashboard = () => {
  const { isSellerVerified, setIsSellerVerified, properties = [], showToast } = usePropertyContext();
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  const handleCheckStatus = () => {
    setIsChecking(true);
    setStatusMessage(null);
    
    // Check global verification status
    setTimeout(() => {
      setIsChecking(false);
      if (isSellerVerified) {
        setStatusMessage('✔ Good news! Your account SLA has been verified by Admin HQ. Your property dashboard is now fully unlocked!');
      } else {
        setStatusMessage('⏳ Verification in progress: Your registration credentials are currently under review in the Admin Seller Requests console. Once an Admin clicks "Approve", your account will be immediately unlocked!');
      }
    }, 1000);
  };

  // ==========================================================================
  // VIEW 1: VERIFIED & APPROVED SELLER DASHBOARD
  // ==========================================================================
  if (isSellerVerified) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto text-left font-sans antialiased bg-gray-50 min-h-screen space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Account Status: Verified SLA Licensed Partner</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] tracking-tight">
              Seller Executive Center
            </h1>
            <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base mt-1">
              Manage your commercial towers, residential flats, lead inquiries, and promotional listings in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/seller/add-property"
              className="px-6 py-3.5 bg-[#047262] hover:bg-[#03594d] active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-[#047262]/20 transition-all flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={3} />
              <span>Add New Property</span>
            </Link>
            <Link
              to="/seller/my-listings"
              className="px-5 py-3.5 bg-white hover:bg-gray-50 active:scale-95 text-[#1a2b3c] rounded-2xl font-extrabold text-xs sm:text-sm border border-gray-200 transition-all flex items-center gap-2 shadow-xs"
            >
              <Building size={17} className="text-[#047262]" />
              <span>My Listings</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#047262] border border-[#047262]/10 flex items-center justify-center">
                <Building size={26} />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">Active Inventory</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">My Live Properties</p>
              <h3 className="text-3xl font-black text-[#1a2b3c]">3 Listings</h3>
              <p className="text-xs font-extrabold text-gray-500 mt-2">All towers syndicated on public marketplace</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Eye size={26} />
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-100/60 px-3 py-1 rounded-xl">+24% This Week</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Buyer Impressions</p>
              <h3 className="text-3xl font-black text-[#1a2b3c]">1,842 Views</h3>
              <p className="text-xs font-extrabold text-gray-500 mt-2">High engagement on featured villas & flats</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <ShieldCheck size={26} />
              </div>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-xl">SLA Approved</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Authorized Quota</p>
              <h3 className="text-3xl font-black text-[#1a2b3c]">50 Towers Limit</h3>
              <p className="text-xs font-extrabold text-[#047262] mt-2">RERA credentials verified by Admin HQ</p>
            </div>
          </div>
        </div>

        {/* Action Callout Box */}
        <div className="bg-[#1a2b3c] rounded-[36px] p-8 sm:p-10 text-white relative overflow-hidden shadow-lg shadow-[#1a2b3c]/20">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">Grow Your Real Estate Reach</span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Ready to showcase your next luxury property?</h2>
            <p className="text-gray-300 font-medium text-sm sm:text-base leading-relaxed mb-6">
              With your verified seller SLA credentials, you can immediately list commercial complexes, residential villas, and independent land layouts with 360° virtual tours and high-resolution photo galleries.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/seller/add-property"
                className="px-7 py-3.5 bg-[#047262] hover:bg-[#03594d] active:scale-95 text-white rounded-2xl font-black text-sm shadow-lg shadow-[#047262]/30 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Upload Property Now</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('sellerVerified', 'false');
                  if (setIsSellerVerified) setIsSellerVerified(false);
                  if (showToast) showToast('Switched to Unverified / Approval Pending view for demonstration!', 'info');
                }}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-gray-300 font-extrabold text-xs rounded-xl transition-all border border-white/10"
              >
                ⚡ [Test Toggle]: Reset to Unverified State
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: APPROVAL PENDING (WHEN SELLER ACCOUNT CREATED BUT NOT YET ACCEPTED)
  // ==========================================================================
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center min-h-[90vh]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Soft Yellow Clock Icon Container */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#fff9eb] flex items-center justify-center mb-6 shadow-sm border border-[#fef3d0]/80 animate-pulse">
          <Clock size={46} className="text-[#e89b25]" strokeWidth={2.3} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-black text-[#1a2b3c] tracking-tight mb-3">
          SLA Approval Pending
        </h1>

        <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wider mb-6 inline-block shadow-2xs">
          🔒 Property Upload Quota Restricted Until Verified
        </span>

        {/* Explanatory Subtext */}
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
          Hello partner, your seller registration packet has been automatically transmitted to <span className="text-[#1a2b3c] font-bold">Admin HQ</span>. Once the Root Administrator reviews and accepts your RERA request in the Admin Console, your property upload quota will unlock instantly!
        </p>

        {/* Interactive Status Toast if triggered */}
        {statusMessage && (
          <div className="mb-8 p-4 md:p-5 rounded-2xl bg-[#e0f5f0] border border-[#047262]/30 text-[#1a2b3c] text-xs md:text-sm font-semibold max-w-lg leading-relaxed animate-in fade-in duration-300 flex items-center gap-3 text-left shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#047262] flex-shrink-0 animate-ping" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/properties')}
            className="w-full sm:w-auto bg-[#1a2b3c] hover:bg-[#111e2b] text-white font-bold text-sm md:text-base px-8 py-4 rounded-2xl shadow-lg transition-all"
          >
            Browse Marketplace
          </button>
          
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm md:text-base px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md shadow-[#047262]/20 disabled:opacity-70"
          >
            <RefreshCw 
              size={18} 
              className={`flex-shrink-0 text-white ${isChecking ? 'animate-spin' : ''}`} 
            />
            <span>{isChecking ? 'Checking Status...' : 'Check Status Now'}</span>
          </button>
        </div>

        {/* Seamless testing shortcut for developer/admin demonstration */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('sellerVerified', 'true');
              if (setIsSellerVerified) setIsSellerVerified(true);
              if (showToast) showToast('⚡ [Demo Mode]: Admin SLA approved! Seller account unlocked!', 'success');
            }}
            className="px-6 py-2.5 bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-extrabold text-xs rounded-xl transition-all"
            title="Click to simulate Admin accepting the request in SellerRequests"
          >
            ⚡ [Demo Toggle]: Simulate Admin Accepting Request & Unlock Quota
          </button>
        </div>

        {/* Footer Support Help Note */}
        <div className="mt-14 pt-8 border-t border-gray-100 w-full">
          <p className="text-xs md:text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
            <LifeBuoy size={16} className="text-[#047262]" />
            <span>Need immediate SLA verification?</span>
            <Link 
              to="/seller/support" 
              className="text-[#047262] font-bold hover:underline transition-colors"
            >
              Contact Admin Support
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
