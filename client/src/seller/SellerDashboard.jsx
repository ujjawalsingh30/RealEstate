import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, LifeBuoy, CheckCircle2 } from 'lucide-react';

const SellerDashboard = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  const handleCheckStatus = () => {
    setIsChecking(true);
    setStatusMessage(null);
    
    // Simulate real-time status query to administration system
    setTimeout(() => {
      setIsChecking(false);
      setStatusMessage(
        '⏳ Verification in progress: Your identity and seller credentials are currently in the final review queue. Thank you for your patience!'
      );
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center min-h-[90vh]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Soft Yellow Clock Icon Container */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#fff9eb] flex items-center justify-center mb-6 shadow-sm border border-[#fef3d0]/80 animate-pulse">
          <Clock size={46} className="text-[#e89b25]" strokeWidth={2.3} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-black text-[#1a2b3c] tracking-tight mb-4">
          Approval Pending
        </h1>

        {/* Explanatory Subtext */}
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
          Hello singh sahab, your seller account is currently under review by our administration
          team. Approval usually takes less than 24 hours. You'll gain full dashboard access
          once verified.
        </p>

        {/* Interactive Status Toast if triggered */}
        {statusMessage && (
          <div className="mb-8 p-4 md:p-5 rounded-2xl bg-[#e0f5f0] border border-[#047262]/30 text-[#1a2b3c] text-xs md:text-sm font-semibold max-w-lg leading-relaxed animate-in fade-in duration-300 flex items-center gap-3 text-left">
            <span className="w-2 h-2 rounded-full bg-[#047262] flex-shrink-0 animate-ping" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/properties')}
            className="w-full sm:w-auto bg-[#047262] hover:bg-[#03594d] text-white font-bold text-sm md:text-base px-8 py-4 rounded-2xl shadow-[0_10px_25px_rgba(4,114,98,0.25)] hover:shadow-[0_15px_30px_rgba(4,114,98,0.35)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Browse Properties
          </button>
          
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto bg-[#f0f6fc] hover:bg-[#e3edfa] text-[#047262] font-bold text-sm md:text-base px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none shadow-xs disabled:opacity-70"
          >
            <RefreshCw 
              size={18} 
              className={`flex-shrink-0 text-[#047262] ${isChecking ? 'animate-spin' : ''}`} 
            />
            <span>{isChecking ? 'Checking Status...' : 'Check Status Now'}</span>
          </button>
        </div>

        {/* Footer Support Help Note */}
        <div className="mt-16 pt-8">
          <p className="text-xs md:text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
            <LifeBuoy size={16} className="text-[#047262]" />
            <span>Need help?</span>
            <Link 
              to="/contact-us" 
              className="text-[#047262] font-bold hover:underline transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
