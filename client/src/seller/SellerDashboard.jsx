import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Plus, ShieldCheck, Eye, CheckCircle2
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const SellerDashboard = () => {
  const { showToast } = usePropertyContext();
  const { updateProfile } = useAuth();
  
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto text-left font-sans antialiased bg-transparent min-h-[90vh] space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span>Account Status: Verified SLA Licensed Partner</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight">
            Seller Executive Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base mt-1">
            Manage your commercial towers, residential flats, lead inquiries, and promotional listings in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/seller/add-property"
            className="px-6 py-3.5 bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] dark:hover:bg-[#0bb395] active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-[#047262]/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Add New Property</span>
          </Link>
          <Link
            to="/seller/my-listings"
            className="px-5 py-3.5 bg-white dark:bg-[#162231] hover:bg-gray-50 dark:hover:bg-[#1b2b3f] active:scale-95 text-[#1a2b3c] dark:text-gray-200 rounded-2xl font-extrabold text-xs sm:text-sm border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-2 shadow-xs"
          >
            <Building size={17} className="text-[#047262] dark:text-[#0dc5a5]" />
            <span>My Listings</span>
          </Link>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#162231] p-7 rounded-[32px] border border-gray-100 dark:border-[#28394e] shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-[#047262] dark:text-[#0dc5a5] border border-[#047262]/10 dark:border-emerald-500/20 flex items-center justify-center">
              <Building size={26} />
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-xl">Active Inventory</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">My Live Properties</p>
            <h3 className="text-3xl font-black text-[#1a2b3c] dark:text-white">3 Listings</h3>
            <p className="text-xs font-extrabold text-gray-500 dark:text-gray-400 mt-2">All towers syndicated on public marketplace</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#162231] p-7 rounded-[32px] border border-gray-100 dark:border-[#28394e] shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
              <Eye size={26} />
            </div>
            <span className="text-xs font-black text-blue-700 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-500/10 px-3 py-1 rounded-xl">+24% This Week</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Buyer Impressions</p>
            <h3 className="text-3xl font-black text-[#1a2b3c] dark:text-white">1,842 Views</h3>
            <p className="text-xs font-extrabold text-gray-500 dark:text-gray-400 mt-2">High engagement on featured villas & flats</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#162231] p-7 rounded-[32px] border border-gray-100 dark:border-[#28394e] shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center">
              <ShieldCheck size={26} />
            </div>
            <span className="text-xs font-black text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-3 py-1 rounded-xl">SLA Approved</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Authorized Quota</p>
            <h3 className="text-3xl font-black text-[#1a2b3c] dark:text-white">50 Towers Limit</h3>
            <p className="text-xs font-extrabold text-[#047262] dark:text-[#0dc5a5] mt-2">RERA credentials verified by Admin HQ</p>
          </div>
        </div>
      </div>

      {/* Action Callout Box */}
      <div className="bg-[#1a2b3c] dark:bg-[#1c2c3e] border border-transparent dark:border-[#28394e] rounded-[36px] p-8 sm:p-10 text-white relative overflow-hidden shadow-lg shadow-[#1a2b3c]/20 dark:shadow-none">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-black text-emerald-400 dark:text-[#0dc5a5] uppercase tracking-widest block mb-2">Grow Your Real Estate Reach</span>
          <h2 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Ready to showcase your next luxury property?</h2>
          <p className="text-gray-300 font-medium text-sm sm:text-base leading-relaxed mb-6">
            With your verified seller SLA credentials, you can immediately list commercial complexes, residential villas, and independent land layouts with 360° virtual tours and high-resolution photo galleries.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/seller/add-property"
              className="px-7 py-3.5 bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] dark:hover:bg-[#0bb395] active:scale-95 text-white rounded-2xl font-black text-sm shadow-lg shadow-[#047262]/30 dark:shadow-none transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Upload Property Now</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.put(`/seller/profile`, { status: 'pending' });
                  const res = await api.get('/seller/profile');
                  if (res.data?.seller) updateProfile(res.data.seller);
                  if (showToast) showToast('Switched to Unverified / Approval Pending view for demonstration!', 'info');
                } catch (err) {
                  console.error(err);
                }
              }}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-gray-300 font-extrabold text-xs rounded-xl transition-all border border-white/10"
            >
              ⚡ [Test Toggle]: Reset DB Status to Unverified
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SellerDashboard;
