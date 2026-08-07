import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, LifeBuoy } from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const PendingApproval = () => {
  const { showToast } = usePropertyContext();
  const { user, updateProfile } = useAuth();
  
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);
    
    try {
      const res = await api.get('/seller/profile');
      if (res.data?.seller) {
        updateProfile(res.data.seller);
        if (res.data.seller.status === 'approved') {
          setStatusMessage('✔ Good news! Your account SLA has been verified by Admin HQ. Your property dashboard is now fully unlocked!');
        } else if (res.data.seller.status === 'rejected') {
          setStatusMessage('❌ Verification rejected. Please contact Admin HQ for clarification.');
        } else {
          setStatusMessage('⏳ Verification in progress: Your registration credentials are currently under review in the Admin Console. Once an Admin clicks "Approve", your account will be unlocked!');
        }
      }
    } catch (err) {
      setStatusMessage('Error checking status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center min-h-[90vh]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Soft Yellow Clock Icon Container */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#fff9eb] dark:bg-amber-500/10 flex items-center justify-center mb-6 shadow-sm border border-[#fef3d0]/80 dark:border-amber-500/20 animate-pulse">
          <Clock size={46} className="text-[#e89b25] dark:text-amber-400" strokeWidth={2.3} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight mb-3">
          SLA Approval Pending
        </h1>

        <span className="px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-6 inline-block shadow-2xs">
          🔒 Property Upload Quota Restricted Until Verified
        </span>

        {/* Explanatory Subtext */}
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
          Hello partner, your seller registration packet has been automatically transmitted to <span className="text-[#1a2b3c] dark:text-white font-bold">Admin HQ</span>. Once the Root Administrator reviews and accepts your RERA request in the Admin Console, your property upload quota will unlock instantly!
        </p>

        {/* Interactive Status Toast if triggered */}
        {statusMessage && (
          <div className="mb-8 p-4 md:p-5 rounded-2xl bg-[#e0f5f0] dark:bg-[#047262]/20 border border-[#047262]/30 dark:border-[#0dc5a5]/30 text-[#1a2b3c] dark:text-gray-200 text-xs md:text-sm font-semibold max-w-lg leading-relaxed animate-in fade-in duration-300 flex items-center gap-3 text-left shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#047262] dark:bg-[#0dc5a5] flex-shrink-0 animate-ping" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/properties')}
            className="w-full sm:w-auto bg-[#1a2b3c] hover:bg-[#111e2b] dark:bg-[#162231] dark:hover:bg-[#1b2b3f] dark:border dark:border-[#28394e] text-white font-bold text-sm md:text-base px-8 py-4 rounded-2xl shadow-lg transition-all"
          >
            Browse Marketplace
          </button>
          
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] dark:hover:bg-[#0bb395] text-white font-bold text-sm md:text-base px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md shadow-[#047262]/20 dark:shadow-none disabled:opacity-70"
          >
            <RefreshCw 
              size={18} 
              className={`flex-shrink-0 ${isChecking ? 'animate-spin' : ''}`} 
            />
            <span>{isChecking ? 'Checking Status...' : 'Check Status Now'}</span>
          </button>
        </div>

        {/* Seamless testing shortcut for developer/admin demonstration */}
        <div className="mt-8">
          <button
            type="button"
            onClick={async () => {
              try {
                await api.put(`/admin/sellers/${user?._id}/status`, { status: 'approved' });
                const res = await api.get('/seller/profile');
                if (res.data?.seller) updateProfile(res.data.seller);
                if (showToast) showToast('⚡ [Demo Mode]: Admin SLA approved! Seller account unlocked!', 'success');
              } catch (err) {
                console.error("Demo approval failed.", err);
              }
            }}
            className="px-6 py-2.5 bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 text-gray-700 font-extrabold text-xs rounded-xl transition-all"
          >
            ⚡ [Demo Toggle]: Attempt Auto-Approve Verification
          </button>
        </div>

        {/* Footer Support Help Note */}
        <div className="mt-14 pt-8 border-t border-gray-100 dark:border-gray-800 w-full">
          <p className="text-xs md:text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
            <LifeBuoy size={16} className="text-[#047262] dark:text-[#0dc5a5]" />
            <span>Need immediate SLA verification?</span>
            <Link 
              to="/seller/support" 
              className="text-[#047262] dark:text-[#0dc5a5] font-bold hover:underline transition-colors"
            >
              Contact Admin Support
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default PendingApproval;
