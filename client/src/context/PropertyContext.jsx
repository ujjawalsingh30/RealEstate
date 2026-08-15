import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Heart, CheckCircle, AlertCircle, X } from 'lucide-react';
import assets from '../assets/assets';
import { useTheme } from './ThemeContext';
import api from '../config/api';

const PropertyContext = createContext();

export const usePropertyContext = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [wishlistIds, setWishlistIds] = useState(() => {
    const saved = localStorage.getItem('wishlistIds');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlistIds', JSON.stringify(wishlistIds));
  }, [wishlistIds]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await api.get('/properties');
        if (response.data.success) {
          setProperties(response.data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch properties from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const toggleWishlist = (id, navigate) => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'buyer') {
      showToast('Please login as a buyer to save properties to your wishlist.', 'error');
      if (navigate && typeof navigate === 'function') {
        navigate('/login');
      }
      return false;
    }
    setWishlistIds((prev) => {
      const isRemoving = prev.includes(id);
      if (isRemoving) {
        showToast('Property removed from your wishlist.', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Property added to your wishlist! ❤️', 'success');
        return [...prev, id];
      }
    });
    return true;
  };

  const getPropertyById = (id) => {
    if (!id) return properties[0];
    const found = properties.find(
      (p) => String(p.id) === String(id) || String(p.displayId).toLowerCase() === String(id).toLowerCase()
    );
    return found || properties[0];
  };

  const [adminMessages, setAdminMessages] = useState([
    {
      id: 1,
      senderName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      subject: 'Inquiry about DLF Urban Grande',
      message: 'I am interested in the 3 BHK flat. Is it still available for a site visit this weekend?',
      date: '2026-07-28',
      unread: true,
      resolved: false,
      senderRole: 'BUYER'
    },
    {
      id: 2,
      senderName: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      phone: '+91 9123456780',
      subject: 'Seller Account Verification',
      message: 'I have uploaded my RERA certificate for verification. Please approve my seller account.',
      date: '2026-07-27',
      unread: false,
      resolved: false,
      senderRole: 'SELLER'
    },
    {
      id: 3,
      senderName: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+91 9988776655',
      subject: 'Issue with property listing',
      message: 'My property images are not loading on the live site. Can you please check?',
      date: '2026-07-26',
      unread: false,
      resolved: true,
      senderRole: 'SELLER'
    }
  ]);

  const addAdminMessage = async (newMessage) => {
    const roleFromStorage = localStorage.getItem('userRole');
    const computedRole = roleFromStorage ? roleFromStorage.toUpperCase() : (newMessage.senderRole || 'GENERAL');
    
    const messagePayload = {
      senderName: newMessage.senderName || 'Valued Partner',
      senderRole: computedRole,
      email: newMessage.email || 'contact@realty.com',
      phone: newMessage.phone || '+91 98000 00000',
      subject: newMessage.subject || 'Platform Support & Assistance Query',
      message: newMessage.message || 'No additional text provided.'
    };

    try {
      const res = await fetch('http://localhost:5000/api/messages/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('Your message has been transmitted directly to the Admin HQ Inbox!', 'success');
      } else {
        showToast('Failed to send message: ' + data.message, 'error');
      }
    } catch (err) {
      console.error("Error sending message:", err);
      showToast('Error transmitting message to server.', 'error');
    }
  };

  const [isSellerVerified, setIsSellerVerified] = useState(() => {
    return localStorage.getItem('sellerVerified') !== 'false';
  });

  const [sellerRequests, setSellerRequests] = useState([
    {
      id: 'REQ-9214',
      sellerName: 'Suresh Sharma',
      agencyName: 'Sharma & Sons Real Estate Pvt Ltd',
      initials: 'SS',
      avatarColor: 'bg-emerald-100 text-emerald-800',
      email: 'sureshbarik969@gmail.com',
      phone: '+91 96925 30661',
      reraNumber: 'RERA-MH-2026-44120',
      requestType: 'New Licensed Agent Verification & Quota Upgrade',
      documents: ['Govt PAN & Aadhaar', 'RERA Certificate', 'Agency Registration Deed'],
      submittedDate: 'Just now',
      status: 'Pending Review'
    },
    {
      id: 'REQ-9215',
      sellerName: 'Rajiv Mehra',
      agencyName: 'Mehra Luxury Realty Group',
      initials: 'RM',
      avatarColor: 'bg-blue-100 text-blue-800',
      email: 'rajiv.mehra@realtyindia.in',
      phone: '+91 98112 34567',
      reraNumber: 'RERA-DL-2025-89102',
      requestType: 'Commercial Property Portfolio Authorization (50+ Towers)',
      documents: ['Tax Clearance 2025-26', 'Municipal Commercial Audit'],
      submittedDate: '3 hours ago',
      status: 'Pending Review'
    },
    {
      id: 'REQ-9210',
      sellerName: 'Hexagon Real Estate',
      agencyName: 'Hexagon Infra Services Pvt Ltd',
      initials: 'HE',
      avatarColor: 'bg-purple-100 text-purple-800',
      email: 'hexagonsservices@gmail.com',
      phone: '+91 85668 89666',
      reraNumber: 'RERA-KA-2025-11003',
      requestType: 'Annual Background Screening & RERA Renewal',
      documents: ['RERA Renewal Certificate 2026', 'Agent Liability Bond'],
      submittedDate: '5 hours ago',
      status: 'Approved'
    },
    {
      id: 'REQ-9208',
      sellerName: 'Ankit Jaiswal',
      agencyName: 'Jaiswal Urban Homes & Developers',
      initials: 'AJ',
      avatarColor: 'bg-amber-100 text-amber-800',
      email: 'harshitjaiswal270702@gmail.com',
      phone: '+91 98200 12345',
      reraNumber: 'RERA-UP-2025-55421',
      requestType: 'Independent Villa Layout Showcase Approval',
      documents: ['Town Planning Sanction Letter'],
      submittedDate: '1 day ago',
      status: 'Approved'
    }
  ]);

  const addSellerRequest = (newReq) => {
    const initials = (newReq.name || 'New Seller')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const reqItem = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      sellerName: newReq.name || 'New Seller Entity',
      agencyName: newReq.agencyName || (newReq.name ? `${newReq.name} Real Estate Group` : 'Independent Agency'),
      initials,
      avatarColor: 'bg-emerald-100 text-emerald-800',
      email: newReq.email || 'seller.new@realtyindia.in',
      phone: newReq.phone || '+91 98990 12345',
      reraNumber: newReq.reraNumber || `RERA-MH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      requestType: 'New Licensed Agent Onboarding & Property Upload License',
      documents: ['Govt PAN Card', 'RERA Registration Deed'],
      submittedDate: 'Just now',
      status: 'Pending Review'
    };

    setSellerRequests((prev) => [reqItem, ...prev]);
    localStorage.setItem('sellerVerified', 'false');
    setIsSellerVerified(false);
    showToast('Your seller onboarding credentials have been submitted to Admin HQ for SLA verification!', 'info');
  };

  const getSimilarProperties = (currentId, city) => {
    return properties.filter(
      (p) => String(p.id) !== String(currentId) && p.city && p.city.toLowerCase() === (city || '').toLowerCase()
    );
  };

  const value = {
    properties,
    setProperties,
    wishlistIds,
    toggleWishlist,
    getPropertyById,
    getSimilarProperties,
    showToast,
    adminMessages,
    setAdminMessages,
    addAdminMessage,
    sellerRequests,
    setSellerRequests,
    isSellerVerified,
    setIsSellerVerified,
    addSellerRequest,
    theme,
    toggleTheme,
    loading
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}

      {/* Global Interactive Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3.5 px-5 py-4 rounded-[22px] bg-white border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.15)] transition-all duration-300 animate-bounce sm:max-w-md">
          {toast.type === 'success' && (
            <div className="w-11 h-11 rounded-2xl bg-[#047262]/15 text-[#047262] flex items-center justify-center shrink-0 shadow-sm">
              <Heart size={22} className="fill-[#047262] text-[#047262]" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-gray-600 flex items-center justify-center shrink-0">
              <Heart size={22} className="text-gray-500" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle size={22} className="text-rose-600" />
            </div>
          )}
          <div className="flex flex-col pr-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-0.5">
              {toast.type === 'error' ? 'System Notice' : 'Notification'}
            </span>
            <span className="text-sm font-bold text-[#1a2b3c] leading-snug">
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
            aria-label="Close Toast"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </PropertyContext.Provider>
  );
};

export default PropertyContext;
