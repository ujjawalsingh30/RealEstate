import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Heart, CheckCircle, AlertCircle, X } from 'lucide-react';
import assets from '../assets/assets';
import { useTheme } from './ThemeContext';

const PropertyContext = createContext();

export const usePropertyContext = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [wishlistIds, setWishlistIds] = useState([1, 2]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const initialProperties = [
    {
      id: 1,
      displayId: '642B896E',
      title: 'DLF Urban Grande Towers',
      location: 'Sector 62 Extension, Near NH-24, Delhi',
      city: 'Delhi',
      priceText: '₹1,65,00,000',
      priceVal: 1.65,
      category: 'FLAT',
      type: 'Flat',
      bhk: '3',
      baths: '3',
      furnishing: 'Furnished',
      sqft: '1850',
      area: '1850 Sqft',
      status: 'For Sale',
      addedOn: '4/15/2026',
      dateAdded: '2026-07-20',
      views: 69,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R1 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        assets.R2 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        assets.R3 || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Hexagon',
        initials: 'H',
        icon: 'hexagon',
        verified: true,
        role: 'Verified Seller'
      },
      description: 'Premium high-rise apartment offering modern lifestyle with spacious layouts and luxury interiors. Features large balconies, modular kitchen, and excellent cross ventilation. Located near business hubs with seamless connectivity to highways and metro.',
      amenities: [
        'Parking',
        'Power Backup',
        'Club House',
        'Pool',
        'Gym',
        'Garden',
        'Security',
        'Wifi'
      ]
    },
    {
      id: 2,
      displayId: '642B88BF',
      title: 'Lakeview Apartments',
      location: 'Near ITPL Main Road, Whitefield Phase 1, Bengaluru',
      city: 'Bengaluru',
      priceText: '₹95,00,000',
      priceVal: 0.95,
      category: 'FLAT',
      type: 'Flat',
      bhk: '3',
      baths: '2',
      furnishing: 'Semi-Furnished',
      sqft: '1600',
      area: '1600 Sqft',
      status: 'For Sale',
      addedOn: '4/15/2026',
      dateAdded: '2026-07-22',
      views: 110,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R2 || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        assets.R3 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        assets.R4 || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Ankit',
        initials: 'AN',
        verified: true,
        role: 'Verified Seller'
      },
      description: 'Scenic apartment overlooking lake with modern amenities. Designed with spacious balconies, abundant natural lighting, premium modular kitchen fittings, and 24/7 security. Perfect for families seeking peace, comfort, and unmatched connectivity in the heart of Bengaluru.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    },
    {
      id: 3,
      displayId: '642B899A',
      title: 'Emerald Sky Signature Villas',
      location: 'Sector 150, Near Noida-Greater Noida Express, Noida',
      city: 'Noida',
      priceText: '₹1,85,00,000',
      priceVal: 1.85,
      category: 'FLAT',
      type: 'Flat',
      bhk: '4',
      baths: '4',
      furnishing: 'Furnished',
      sqft: '2400',
      area: '2400 Sqft',
      status: 'For Sale',
      addedOn: '4/18/2026',
      dateAdded: '2026-07-23',
      views: 30,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R3 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        assets.R4 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        assets.R1 || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Rajiv Mehra',
        initials: 'RM',
        verified: true,
        role: 'Verified Seller'
      },
      description: 'Ultra-luxurious signature residency featuring automated smart-home lighting, Italian marble flooring, zero-edge swimming pool access, and world-class concierge assistance.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    },
    {
      id: 4,
      displayId: '642B8A12',
      title: 'Coral Bay Elite Residency',
      location: 'Vibhuti Khand, Gomti Nagar Extension, Lucknow',
      city: 'Lucknow',
      priceText: '₹56,00,000',
      priceVal: 0.56,
      category: 'COMMERCIAL',
      type: 'Commercial',
      bhk: '2',
      baths: '2',
      furnishing: 'Furnished',
      sqft: '980',
      area: '980 Sqft',
      status: 'For Sale',
      addedOn: '4/20/2026',
      dateAdded: '2026-07-24',
      views: 17,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R4 || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        assets.R1 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        assets.R2 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Aman Verma',
        initials: 'AV',
        verified: true,
        role: 'Verified Seller'
      },
      description: 'Prime commercial executive suites situated in the financial hub. Fully fitted with conference lounges, robust HVAC systems, high-speed fiber connectivity, and abundant parking.',
      amenities: [
        'Parking',
        'Power Backup',
        'Security',
        'Wifi'
      ]
    },
    {
      id: 5,
      displayId: '642B8B33',
      title: 'Prestige Golfshire Estates',
      location: 'Nandi Hills Road, Devanahalli, Bangalore',
      city: 'Bangalore',
      priceText: '₹4,20,00,000',
      priceVal: 4.20,
      category: 'VILLA',
      type: 'Villa',
      bhk: '5+',
      baths: '6',
      furnishing: 'Furnished',
      sqft: '5200',
      area: '5200 Sqft',
      status: 'For Sale',
      addedOn: '4/10/2026',
      dateAdded: '2026-07-15',
      views: 142,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R1 || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        assets.R2 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        assets.R3 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Prestige Estates',
        initials: 'PE',
        verified: true,
        role: 'Verified Builder'
      },
      description: 'Exclusive independent hillside villa overlooking an ultra-green 18-hole championship golf course. Equipped with private lap pool, temperature controlled wine cellar, and private elevator.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    },
    {
      id: 6,
      displayId: '642B8C91',
      title: 'Oberoi Three Sixty West',
      location: 'Worli Sea Face, Mumbai',
      city: 'Mumbai',
      priceText: '₹8,50,00,000',
      priceVal: 8.50,
      category: 'PENTHOUSE',
      type: 'Penthouse',
      bhk: '4',
      baths: '5',
      furnishing: 'Furnished',
      sqft: '4100',
      area: '4100 Sqft',
      status: 'For Sale',
      addedOn: '4/25/2026',
      dateAdded: '2026-07-25',
      views: 218,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R2 || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        assets.R3 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        assets.R4 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Oberoi Realty',
        initials: 'OR',
        verified: true,
        role: 'Verified Builder'
      },
      description: 'Iconic beachfront penthouse offering uninhibited 360-degree views of the Arabian Sea and city skyline. Featuring triple-height ceilings, bespoke interior fittings, and rooftop sky deck.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    },
    {
      id: 7,
      displayId: '642B8D21',
      title: 'Lodha Altamount Grand Residence',
      location: 'Altamount Road, Tardeo, Mumbai',
      city: 'Mumbai',
      priceText: '₹6,80,00,000',
      priceVal: 6.80,
      category: 'FLAT',
      type: 'Flat',
      bhk: '4',
      baths: '4',
      furnishing: 'Semi-Furnished',
      sqft: '3600',
      area: '3600 Sqft',
      status: 'For Sale',
      addedOn: '4/05/2026',
      dateAdded: '2026-07-10',
      views: 95,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R3 || 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        assets.R1 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        assets.R2 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Lodha Group',
        initials: 'LG',
        verified: true,
        role: 'Verified Builder'
      },
      description: 'Ultra-elite residential community on Billionaire\'s Row. High privacy protocols, 5-star concierge, chauffeur lounges, temperature-controlled swimming pools, and private theater.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    },
    {
      id: 8,
      displayId: '642B8E55',
      title: 'Godrej South Estate Landmark',
      location: 'Okhla Phase 1, South Delhi',
      city: 'Delhi',
      priceText: '₹2,40,00,000',
      priceVal: 2.40,
      category: 'FLAT',
      type: 'Flat',
      bhk: '3',
      baths: '3',
      furnishing: 'Furnished',
      sqft: '2150',
      area: '2150 Sqft',
      status: 'For Sale',
      addedOn: '4/12/2026',
      dateAdded: '2026-07-18',
      views: 112,
      isNew: true,
      verified: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R4 || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        assets.R1 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        assets.R2 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Godrej Properties',
        initials: 'GP',
        verified: true,
        role: 'Verified Builder'
      },
      description: 'Stunning copper-clad landmark residency offering FTL air-purification systems, resort-inspired clubhouse, and landscaped botanical gardens.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    },
    {
      id: 9,
      displayId: '642B8F77',
      title: 'Emaar Palm Springs Luxury Retreat',
      location: 'Golf Course Road, Sector 54, Gurgaon',
      city: 'Gurgaon',
      priceText: '₹5,15,00,000',
      priceVal: 5.15,
      category: 'VILLA',
      type: 'Villa',
      bhk: '4',
      baths: '5',
      furnishing: 'Furnished',
      sqft: '4800',
      area: '4800 Sqft',
      status: 'For Sale',
      addedOn: '4/14/2026',
      dateAdded: '2026-07-12',
      views: 156,
      isNew: false,
      verified: true,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      images: [
        assets.R1 || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        assets.R3 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        assets.R4 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        name: 'Emaar India',
        initials: 'EI',
        verified: true,
        role: 'Verified Builder'
      },
      description: 'Exemplary Mediterranean-styled community situated on Gurgaon\'s most prestigious arterial boulevard. Offers expansive private lawns, terrace entertainment gardens, and complete smart security.',
      amenities: [
        'Pool',
        'Club House',
        'Garden',
        'Gym',
        'Wifi',
        'Security',
        'Parking',
        'Power Backup'
      ]
    }
  ];

  const [properties, setProperties] = useState(initialProperties);

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
    toggleTheme
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
