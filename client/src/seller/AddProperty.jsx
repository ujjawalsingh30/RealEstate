import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building, MapPin, DollarSign, Home, Maximize, Check, Plus, 
  Image as ImageIcon, Upload, FileText, Sparkles, ArrowLeft, 
  ShieldCheck, CheckCircle2, Shield, Dumbbell, Coffee, Car, Wifi, Trash2, Lock, Clock
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const AddProperty = () => {
  const navigate = useNavigate();
  const { setProperties, showToast } = usePropertyContext();
  const { user } = useAuth();
  
  const isSellerVerified = user?.status === 'approved';

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'FLAT',
    type: 'Flat',
    status: 'For Sale',
    priceText: '₹1,25,00,000',
    priceVal: 1.25,
    city: 'Mumbai',
    location: '',
    bhk: '3',
    baths: '3',
    sqft: '1850',
    furnishing: 'Furnished',
    description: '',
    amenities: ['Parking', 'Security', 'Power Backup', 'Club House'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [localFiles, setLocalFiles] = useState([]);
  const [localPreviews, setLocalPreviews] = useState([]);

  // Curated Luxury Sample Photo Library for effortless testing
  const samplePhotos = [
    { name: 'Modern High-Rise', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Luxury Infinity Villa', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80' },
    { name: 'Contemporary Penthouse', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Lakeview Towers', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
    { name: 'Executive Commercial', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
    { name: 'Suburban Duplex', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
  ];

  // List of amenities with styling icons
  const availableAmenities = [
    { name: 'Parking', icon: <Car size={16} /> },
    { name: 'Security', icon: <Shield size={16} /> },
    { name: 'Power Backup', icon: <Sparkles size={16} /> },
    { name: 'Club House', icon: <Coffee size={16} /> },
    { name: 'Pool', icon: <Dumbbell size={16} /> },
    { name: 'Gym', icon: <Dumbbell size={16} /> },
    { name: 'Garden', icon: <Home size={16} /> },
    { name: 'Wifi', icon: <Wifi size={16} /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== item) : [...prev.amenities, item],
      };
    });
  };

  const handleAddCustomImage = (e) => {
    e.preventDefault();
    if (customImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, customImageUrl.trim()],
        image: prev.image || customImageUrl.trim()
      }));
      setCustomImageUrl('');
      if (showToast) showToast('Photo URL added to gallery preview!', 'info');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image: updated[0] || (localPreviews.length > 0 ? '' : samplePhotos[0].url)
      };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setLocalFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setLocalPreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveLocalImage = (index) => {
    setLocalFiles(prev => prev.filter((_, i) => i !== index));
    setLocalPreviews(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Optional: Revoke URL to avoid memory leaks
      // URL.revokeObjectURL(prev[index]);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location) {
      if (showToast) showToast('Please provide both property title and location.', 'error');
      return;
    }

    const formDataPayload = new FormData();
    
    // Append standard fields
    Object.keys(formData).forEach(key => {
      if (key === 'images' || key === 'amenities') {
        formDataPayload.append(key, JSON.stringify(formData[key]));
      } else {
        formDataPayload.append(key, formData[key]);
      }
    });

    // These are not in formData state, so we append them safely
    formDataPayload.append('area', `${formData.sqft} Sqft`);
    formDataPayload.append('isNewProperty', 'true');
    formDataPayload.append('verified', 'true');

    // Append files
    localFiles.forEach(file => {
      formDataPayload.append('localImages', file);
    });

    try {
      const response = await api.post('/properties', formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        if (setProperties) {
          setProperties((prev) => [response.data.property, ...prev]);
        }

        if (showToast) {
          showToast('Property listing published successfully!', 'success');
        }
        
        navigate('/seller/my-listings');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast(err.response?.data?.message || 'Failed to publish property', 'error');
    }
  };

  if (!isSellerVerified) {
    return (
      <div className="p-6 sm:p-10 md:p-14 max-w-4xl mx-auto text-center font-sans antialiased min-h-[75vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center mx-auto mb-6 shadow-md shadow-amber-500/10 animate-pulse">
          <ShieldCheck size={48} className="text-amber-500 dark:text-amber-400" />
        </div>
        
        <span className="px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-4 inline-block shadow-2xs">
          ⏳ Admin Verification in Progress
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight mb-4">
          Property Upload Quota Locked
        </h1>

        <p className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          To maintain marketplace safety and zero-fraud inventory, all newly registered seller accounts must undergo RERA SLA verification by the <span className="text-[#047262] dark:text-[#0dc5a5] font-black">Root Administrator</span> before property listings can be published.
        </p>

        <div className="w-full bg-white dark:bg-[#162231] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#28394e] shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-none text-left space-y-4 mb-8 transition-colors">
          <h3 className="font-extrabold text-sm text-[#1a2b3c] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#047262] dark:text-[#0dc5a5]" />
            <span>How to complete SLA onboarding:</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 list-disc pl-5">
            <li>Your account registration has automatically dispatched an SLA verification packet to <span className="text-[#1a2b3c] dark:text-white">Admin HQ</span>.</li>
            <li>An administrator will review your broker initials, contact coordinates, and Government RERA deed in <span className="text-[#047262] dark:text-[#0dc5a5]">Seller Requests</span>.</li>
            <li>Once approved in the Admin Console, your property upload quota will unlock instantaneously!</li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/seller/dashboard"
            className="px-7 py-3.5 bg-gray-900 dark:bg-gray-800 hover:bg-black dark:hover:bg-gray-700 text-white font-black text-sm rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            to="/seller/support"
            className="px-7 py-3.5 bg-white dark:bg-[#162231] hover:bg-gray-50 dark:hover:bg-[#1b2b3f] text-[#047262] dark:text-[#0dc5a5] border border-gray-200 dark:border-[#28394e] font-extrabold text-sm rounded-2xl transition-all shadow-xs active:scale-95"
          >
            Contact Admin Concierge
          </Link>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('sellerVerified', 'true');
              if (setIsSellerVerified) setIsSellerVerified(true);
              if (showToast) showToast('⚡ [Demo Mode]: Account instantly verified! You may now publish properties!', 'success');
            }}
            className="w-full sm:w-auto mt-2 px-6 py-2.5 bg-[#e0f5f0] dark:bg-[#047262]/20 hover:bg-[#047262] text-[#047262] dark:text-[#0dc5a5] hover:text-white dark:hover:text-white font-black text-xs rounded-xl transition-all border border-[#047262]/20 dark:border-[#0dc5a5]/30"
            title="Click to simulate admin approval for testing"
          >
            ⚡ [Demo Toggle]: Simulate Admin Approval & Unlock Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto text-left font-sans antialiased bg-gray-50 dark:bg-transparent min-h-screen">
      
      {/* =====================================================================
          HEADER & BACK NAVIGATION
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div className="space-y-1">
          <Link 
            to="/seller/my-listings" 
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#047262] dark:hover:text-[#0dc5a5] font-extrabold text-xs uppercase tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back to My Listings</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight flex items-center gap-3">
            <span>Post New Property Listing</span>
            <span className="bg-[#047262]/10 dark:bg-[#0dc5a5]/10 text-[#047262] dark:text-[#0dc5a5] text-xs font-extrabold uppercase px-3 py-1 rounded-full hidden md:inline-flex items-center gap-1">
              <ShieldCheck size={14} className="fill-[#047262] dark:fill-[#0dc5a5] text-white dark:text-[#0b131e]" />
              <span>RERA VERIFIED FORM</span>
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base mt-1.5">
            Complete the details below to showcase your premium property to our verified network of homebuyers and investors.
          </p>
        </div>
      </div>

      {/* =====================================================================
          MAIN PROPERTY SUBMISSION FORM
          ===================================================================== */}
      <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
        
        {/* -------------------------------------------------------------------
            SECTION 1: BASIC PROPERTY DETAILS
           ------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none space-y-6 transition-colors">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-[#e0f5f0] dark:bg-[#047262]/20 text-[#047262] dark:text-[#0dc5a5] flex items-center justify-center font-bold shadow-xs">
              <Building size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white">1. Basic Information & Pricing</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Define your property's primary title, classification, and expected price.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            {/* Property Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Property Title / Tower Name *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. DLF Urban Grande Towers or Lakeview Penthouse"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-bold text-base text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Category / Type Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                Property Category
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {['FLAT', 'VILLA', 'COMMERCIAL'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat, type: cat === 'FLAT' ? 'Flat' : cat === 'VILLA' ? 'Villa' : 'Commercial' })}
                    className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all ${
                      formData.category === cat
                        ? 'bg-[#047262] text-white border-[#047262] shadow-md shadow-[#047262]/20 dark:shadow-none'
                        : 'bg-gray-50 dark:bg-[#1b2b3f] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#28394e] hover:bg-gray-100 dark:hover:bg-[#203147]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Status Toggle */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                Listing Purpose
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {['For Sale', 'For Rent'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: st })}
                    className={`py-3 px-4 rounded-xl font-extrabold text-sm border transition-all ${
                      formData.status === st
                        ? 'bg-[#1a2b3c] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e] border-[#1a2b3c] dark:border-[#0dc5a5] shadow-md'
                        : 'bg-gray-50 dark:bg-[#1b2b3f] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#28394e] hover:bg-gray-100 dark:hover:bg-[#203147]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Text Display */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Display Price Text (in ₹) *
              </label>
              <input
                type="text"
                name="priceText"
                required
                placeholder="e.g. ₹1,45,00,000 or ₹65,000 / Month"
                value={formData.priceText}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-black text-base text-[#047262] dark:text-[#0dc5a5] focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Raw Numerical Valuation */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Price Valuation (in Crores / Lakhs)
              </label>
              <input
                type="number"
                step="0.01"
                name="priceVal"
                placeholder="e.g. 1.45 (for filter sorting)"
                value={formData.priceVal}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-bold text-base text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 2: LOCATION & ADDRESS
           ------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none space-y-6 transition-colors">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-xs">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white">2. Location & Geographical Accessibility</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Help buyers accurately locate your development for planned site tours.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {/* Primary City */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Primary City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-extrabold text-sm text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi / NCR</option>
                <option value="Noida">Noida Extension</option>
                <option value="Bengaluru">Bengaluru / Whitefield</option>
                <option value="Hyderabad">Hyderabad / Gachibowli</option>
                <option value="Pune">Pune / Kharadi</option>
                <option value="Kolkata">Kolkata / Rajarhat</option>
                <option value="Lucknow">Lucknow / Gomti Nagar</option>
              </select>
            </div>

            {/* Locality & Landmark */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Detailed Locality & Expressway Landmark *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Sector 150, Near Noida-Greater Noida Expressway or Worli Sea Face"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-bold text-sm sm:text-base text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 3: SPECIFICATIONS & DIMENSIONS
           ------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none space-y-6 transition-colors">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-xs">
              <Maximize size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white">3. Architectural Specifications & Area</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Specify unit configurations, super built-up area, and furnishing grade.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {/* BHK / Bedrooms */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Bedrooms / BHK
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {['1', '2', '3', '4', '5+'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, bhk: num })}
                    className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                      formData.bhk === num
                        ? 'bg-[#047262] text-white border-[#047262] shadow-xs dark:shadow-none'
                        : 'bg-gray-50 dark:bg-[#1b2b3f] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#28394e] hover:bg-gray-100 dark:hover:bg-[#203147]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Bathrooms / Washrooms
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4+'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, baths: num })}
                    className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                      formData.baths === num
                        ? 'bg-[#047262] text-white border-[#047262] shadow-xs dark:shadow-none'
                        : 'bg-gray-50 dark:bg-[#1b2b3f] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#28394e] hover:bg-gray-100 dark:hover:bg-[#203147]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Built-up Area */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Built-up Area (SqFt)
              </label>
              <input
                type="number"
                name="sqft"
                required
                value={formData.sqft}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-black text-sm sm:text-base text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Furnishing Status
              </label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleInputChange}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-extrabold text-sm text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
              >
                <option value="Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished / Bare Shell</option>
              </select>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 4: AMENITIES & LIFESTYLE FEATURES
           ------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none space-y-6 transition-colors">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white">4. Premium Lifestyle Amenities</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Select available lifestyle privileges included within the community.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
            {availableAmenities.map((am) => {
              const isSelected = formData.amenities.includes(am.name);
              return (
                <button
                  key={am.name}
                  type="button"
                  onClick={() => toggleAmenity(am.name)}
                  className={`p-4 rounded-[20px] border text-left flex items-center justify-between gap-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#e0f5f0]/80 dark:bg-[#047262]/20 border-[#047262] dark:border-[#0dc5a5]/40 text-[#047262] dark:text-[#0dc5a5] font-black shadow-xs scale-[1.02]'
                      : 'bg-gray-50/70 dark:bg-[#1b2b3f] border-gray-200 dark:border-[#28394e] text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100/90 dark:hover:bg-[#203147]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-[#047262] dark:text-[#0dc5a5]' : 'text-gray-400 dark:text-gray-500'}>{am.icon}</span>
                    <span className="text-xs sm:text-sm">{am.name}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-[#047262] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e]' : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'}`}>
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 5: PHOTO GALLERY & VISUAL PREVIEW
           ------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none space-y-6 transition-colors">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white">5. Visual Showcase & Photo Gallery</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Select from verified high-resolution samples or input custom image URLs for your visual showcase.</p>
            </div>
          </div>

          {/* Quick Curated Sample Selectors */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              One-Click Sample Photo Library (Click any to add to gallery)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {samplePhotos.map((img, idx) => {
                const isSelected = formData.images.includes(img.url);
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (!isSelected) {
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, img.url],
                          image: prev.image || img.url
                        }));
                        if (showToast) showToast(`Added "${img.name}" photo!`, 'info');
                      }
                    }}
                    className={`relative rounded-2xl h-24 sm:h-28 overflow-hidden border-2 cursor-pointer group transition-all ${
                      isSelected ? 'border-[#047262] dark:border-[#0dc5a5] shadow-md scale-[1.03]' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-extrabold text-white truncate w-full">{img.name}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#047262] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e] flex items-center justify-center shadow-md">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom URL Ingester & Device Upload */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Add Images From Your Device
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full px-5 py-4 bg-[#e0f5f0]/50 dark:bg-[#047262]/10 border-2 border-dashed border-[#047262]/30 dark:border-[#0dc5a5]/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#e0f5f0] dark:hover:bg-[#047262]/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#047262] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e] flex items-center justify-center shadow-md">
                    <Upload size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-extrabold text-[#047262] dark:text-[#0dc5a5] text-sm">Click or Drag to Upload Photos</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Supports JPG, PNG, WEBP (Max 5MB per image)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Or Add Custom Image URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 px-5 py-3.5 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-semibold text-sm text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImage}
                  className="px-6 py-3.5 bg-[#1a2b3c] dark:bg-[#203147] hover:bg-[#2c3e50] dark:hover:bg-[#2a405c] text-white font-extrabold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Upload size={17} />
                  <span>Add URL</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Gallery Thumbnails */}
          <div>
            <span className="block text-xs font-black uppercase tracking-wider text-[#047262] dark:text-[#0dc5a5] mb-3">
              Active Listing Gallery ({formData.images.length + localPreviews.length} Photos - First photo is Main Cover)
            </span>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {formData.images.map((imgUrl, i) => (
                <div key={`url-${i}`} className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] overflow-hidden border border-gray-200 dark:border-[#28394e] shadow-sm group">
                  <img src={imgUrl} alt={`Gallery item ${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-black uppercase bg-[#047262] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e] text-center py-0.5 rounded-lg shadow-2xs">
                      MAIN COVER
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md opacity-90 hover:opacity-100 transition-opacity"
                    title="Remove Photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              
              {/* Local File Previews */}
              {localPreviews.map((preview, i) => (
                <div key={`local-${i}`} className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] overflow-hidden border border-[#047262]/30 dark:border-[#0dc5a5]/30 shadow-sm group">
                  <img src={preview} alt={`Local Upload ${i}`} className="w-full h-full object-cover opacity-90" />
                  {formData.images.length === 0 && i === 0 && (
                    <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-black uppercase bg-[#047262] dark:bg-[#0dc5a5] text-white dark:text-[#0b131e] text-center py-0.5 rounded-lg shadow-2xs">
                      MAIN COVER
                    </span>
                  )}
                  <div className="absolute inset-0 border-2 border-[#047262]/20 dark:border-[#0dc5a5]/20 rounded-[22px] pointer-events-none"></div>
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase bg-[#1a2b3c]/80 text-white px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                    <CheckCircle2 size={10} className="text-[#0dc5a5]"/> TO UPLOAD
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocalImage(i)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md opacity-90 hover:opacity-100 transition-opacity"
                    title="Remove Photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* -------------------------------------------------------------------
            SECTION 6: PROPERTY DESCRIPTION & HIGHLIGHTS
           ------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#162231] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none space-y-6 transition-colors">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white">6. Property Narrative & Highlights</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Detail prime highlights, panoramic balcony vistas, and nearby transport conveniences.</p>
            </div>
          </div>

          <div>
            <textarea
              name="description"
              rows="5"
              placeholder="e.g. Ultra-luxurious signature residence featuring automated smart-home lighting, Italian marble flooring, zero-edge swimming pool access, and world-class concierge assistance..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-5 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-[22px] font-medium text-sm sm:text-base text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:bg-white dark:focus:bg-[#162231] focus:outline-none transition-all leading-relaxed shadow-xs"
            />
          </div>
        </div>

        {/* =====================================================================
            FINAL ACTION BAR (CANCEL / PUBLISH)
            ===================================================================== */}
        <div className="bg-white dark:bg-[#162231] p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] border border-gray-100 dark:border-[#28394e] shadow-[0_6px_35px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-3.5 w-full sm:w-auto text-left">
            <div className="w-11 h-11 rounded-2xl bg-[#047262]/15 dark:bg-[#0dc5a5]/15 text-[#047262] dark:text-[#0dc5a5] hidden sm:flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} className="fill-[#047262] dark:fill-[#0dc5a5] text-white dark:text-[#162231]" />
            </div>
            <div>
              <span className="block font-black text-[#1a2b3c] dark:text-white text-sm sm:text-base">Ready to go live?</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your listing will instantly appear on the public Browse Properties and Home page.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/seller/my-listings"
              className="flex-1 sm:flex-initial px-7 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm text-center transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="flex-1 sm:flex-initial px-9 py-4 rounded-2xl bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:hover:bg-[#0bb395] active:scale-95 text-white dark:text-[#0b131e] font-black text-sm sm:text-base shadow-lg shadow-[#047262]/30 dark:shadow-none transition-all flex items-center justify-center gap-2.5"
            >
              <Sparkles size={19} />
              <span>Publish Verified Listing</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AddProperty;
