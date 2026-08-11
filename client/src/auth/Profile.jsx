import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Edit3, CheckCircle2, 
  Key, Bell, Lock, LogOut, Building, Heart, MessageSquare, 
  Award, ExternalLink, Save, Camera, Check, AlertCircle, Briefcase, Sun, Moon, Loader2
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Profile = () => {
  const navigate = useNavigate();
  const { properties, wishlistIds, showToast } = usePropertyContext();
  const { theme, toggleTheme } = useTheme();
  const { user: authUser, role: authRole, updateProfile: updateAuthProfile, logout: authLogout } = useAuth();
  
  // Detect current role from context or localStorage (defaults to buyer if none)
  const role = authRole || localStorage.getItem('userRole') || 'buyer';

  // Role themed metadata and labels
  const getRoleBadge = () => {
    switch (role) {
      case 'seller':
        return {
          title: 'Verified Seller & Real Estate Agent',
          badgeText: 'LICENSED AGENT',
          bgTint: 'from-[#047262] via-[#058a77] to-[#03594d]',
          badgeColor: 'bg-amber-500 text-white',
          initials: 'SS',
          defaultName: 'Suresh Sharma',
          defaultEmail: 'suresh.sharma@realestate.com',
          defaultPhone: '+91 98765 43210',
          defaultLocation: 'Noida Extension, Delhi NCR',
          defaultBio: 'Senior Real Estate Consultant & RERA Certified Property Agent specializing in luxury residential apartments, independent villas, and high-yield commercial spaces across Delhi NCR.',
          agencyName: 'Urban Grande Properties Ltd.',
          reraId: 'RERA-UP-N-2025-0984'
        };
      case 'admin':
        return {
          title: 'System Administrator & Superuser',
          badgeText: 'SUPER ADMIN',
          bgTint: 'from-[#1a2b3c] via-[#2c3e50] to-[#111c27]',
          badgeColor: 'bg-purple-600 text-white',
          initials: 'AD',
          defaultName: 'Ujjawal Singh',
          defaultEmail: 'admin@realestate.com',
          defaultPhone: '+91 99887 76655',
          defaultLocation: 'Corporate Headquarters, Delhi',
          defaultBio: 'Platform Administrator governing property verifications, agency registrations, listing compliance, and secure buyer-seller messaging workflows across the RealEstate portal.',
          agencyName: 'RealEstate Central Admin',
          reraId: 'PLATFORM-MASTER'
        };
      default:
        // buyer
        return {
          title: 'Verified Property Buyer & Investor',
          badgeText: 'VERIFIED BUYER',
          bgTint: 'from-[#047262] to-[#0d5248]',
          badgeColor: 'bg-[#047262] text-white',
          initials: 'SI',
          defaultName: 'Siddharth (Buyer)',
          defaultEmail: 'siddharth.buyer@gmail.com',
          defaultPhone: '+91 91234 56789',
          defaultLocation: 'Sector 62, Noida',
          defaultBio: 'Active real estate investor and prospective homeowner seeking 3 BHK & 4 BHK premium high-rise luxury apartments and verified independent villas near corporate tech parks.',
          agencyName: 'Personal Buyer Account',
          reraId: 'N/A'
        };
    }
  };

  const roleInfo = getRoleBadge();

  // Profile Form States
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingServerData, setLoadingServerData] = useState(false);
  const [savingToServer, setSavingToServer] = useState(false);
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(`realestate_profile_${role}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default if corrupted
      }
    }
    return {
      fullName: authUser?.name || roleInfo.defaultName,
      email: authUser?.email || roleInfo.defaultEmail,
      phone: authUser?.phone || roleInfo.defaultPhone,
      location: authUser?.location || roleInfo.defaultLocation,
      bio: authUser?.bio || roleInfo.defaultBio,
      agency: authUser?.agencyName || roleInfo.agencyName,
      reraId: authUser?.reraNumber || roleInfo.reraId,
      emailAlerts: true,
      priceDrops: true,
      whatsappNotify: true,
      weeklyNewsletter: false
    };
  });

  // Fetch live user profile data directly from backend server on mount
  useEffect(() => {
    const fetchServerProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        setLoadingServerData(true);
        let serverUser = null;

        if (role === 'admin') {
          const res = await api.get('/admin/verify');
          serverUser = res.data?.admin || res.data?.user;
        } else {
          const res = await api.get(`/${role}/profile`);
          serverUser = res.data?.seller || res.data?.buyer || res.data?.user;
        }

        if (serverUser) {
          setFormData((prev) => {
            const updated = {
              ...prev,
              fullName: serverUser.name || serverUser.fullName || prev.fullName,
              email: serverUser.email || prev.email,
              phone: serverUser.phone || prev.phone,
              location: serverUser.location || prev.location,
              bio: serverUser.bio || prev.bio,
              agency: serverUser.agencyName || serverUser.agency || prev.agency,
              reraId: serverUser.reraNumber || serverUser.reraId || prev.reraId,
            };
            localStorage.setItem(`realestate_profile_${role}`, JSON.stringify(updated));
            return updated;
          });
        }
      } catch (error) {
        console.warn('Unable to synchronize server profile data; using local profile state.', error?.message);
      } finally {
        setLoadingServerData(false);
      }
    };

    fetchServerProfile();
  }, [role]);

  const getInitials = (name) => {
    if (!name) return roleInfo.initials;
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0] ? (name[0].toUpperCase() + (name[1]?.toUpperCase() || '')) : roleInfo.initials;
  };

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingToServer(true);

      if (role === 'seller' || role === 'buyer') {
        const payload = {
          name: formData.fullName,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          ...(role === 'seller' && {
            agencyName: formData.agency,
            reraNumber: formData.reraId
          })
        };
        await api.put(`/${role}/profile`, payload);
        if (updateAuthProfile) {
          updateAuthProfile(payload);
        }
      }

      localStorage.setItem(`realestate_profile_${role}`, JSON.stringify(formData));
      setIsEditing(false);
      if (showToast) {
        showToast('Profile updated directly on the server successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to update server profile:', error);
      localStorage.setItem(`realestate_profile_${role}`, JSON.stringify(formData));
      setIsEditing(false);
      if (showToast) {
        showToast(`Saved locally (Server sync note: ${error.response?.data?.message || 'Network error'})`, 'warning');
      }
    } finally {
      setSavingToServer(false);
    }
  };

  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      if (showToast) showToast('New password and confirm password do not match!', 'error');
      return;
    }
    
    try {
      setUpdatingPassword(true);
      await api.put(`/${role}/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (showToast) showToast('Password successfully changed!', 'success');
    } catch (error) {
      console.error('Failed to change password:', error);
      if (showToast) {
        showToast(error.response?.data?.message || 'Failed to change password', 'error');
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    if (authLogout) {
      authLogout();
    } else {
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    if (showToast) showToast('You have successfully logged out.', 'info');
    navigate('/login');
  };

  // Stats Calculations
  const sellerListingCount = properties.length || 6;
  const wishlistCount = wishlistIds ? wishlistIds.length : 2;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black py-6 sm:py-10 px-3 sm:px-6 md:px-8 lg:px-12 font-sans antialiased text-left transition-colors duration-300">
      <div className="max-w-[1360px] mx-auto">
        
        {/* =========================================================================
            HERO BANNER & AVATAR CARD
           ========================================================================= */}
        <div className="relative mb-8 sm:mb-10">
          {/* Gradient Banner Background */}
          <div className={`w-full h-48 sm:h-60 md:h-64 rounded-[28px] sm:rounded-[36px] bg-gradient-to-r ${roleInfo.bgTint} shadow-[0_8px_30px_rgba(4,114,98,0.2)] overflow-hidden relative flex items-center justify-end px-8`}>
            {/* Background pattern decor */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-bold text-xs tracking-wider uppercase z-10 mr-4">
              <ShieldCheck size={16} className="text-white" />
              <span>{roleInfo.title}</span>
            </div>
          </div>

          {/* Floating Profile Details Over the Banner */}
          <div className="-mt-20 sm:-mt-24 px-4 sm:px-8 max-w-[1280px] mx-auto z-20 relative">
            <div className="bg-white dark:bg-[#162231] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-9 shadow-[0_12px_45px_rgba(0,0,0,0.07)] border border-gray-100/90 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-all">
              
              {/* Left: Avatar Initial Circle + Name & Role */}
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 sm:gap-7 w-full md:w-auto">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[28px] sm:rounded-[34px] bg-gradient-to-br from-[#047262] to-[#1a2b3c] text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl border-4 border-white dark:border-gray-800">
                    {getInitials(formData.fullName)}
                  </div>
                  <button 
                    title="Change Avatar" 
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-xl bg-white dark:bg-[#1b2b3f] text-[#1a2b3c] dark:text-gray-200 hover:bg-[#047262] hover:text-white flex items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700 transition-all cursor-pointer"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight flex items-center gap-2">
                      <span>{formData.fullName}</span>
                      {loadingServerData && (
                        <Loader2 size={18} className="animate-spin text-[#047262] opacity-75" title="Synchronizing with server..." />
                      )}
                    </h1>
                    <span className="inline-flex items-center gap-1 bg-[#047262]/15 dark:bg-[#0dc5a5]/15 text-[#047262] dark:text-[#0dc5a5] font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      <CheckCircle2 size={13} className="fill-[#047262] dark:fill-[#0dc5a5] text-white" />
                      {roleInfo.badgeText}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm pt-1">
                    <span className="flex items-center gap-1.5">
                      <Mail size={15} className="text-[#047262] dark:text-[#0dc5a5]" />
                      {formData.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={15} className="text-[#047262] dark:text-[#0dc5a5]" />
                      {formData.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-[#047262] dark:text-[#0dc5a5]" />
                      {formData.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions & Theme Toggle */}
              <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto justify-center md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                
                {/* Dedicated Profile Theme Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  title="Switch Display Theme"
                  className="p-3.5 bg-gray-100 dark:bg-[#1b2b3f] hover:bg-gray-200 dark:hover:bg-[#23354c] text-gray-700 dark:text-amber-400 border border-gray-200/80 dark:border-gray-700 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                >
                  {theme === 'dark' ? <Sun size={18} className="animate-spin-slow" /> : <Moon size={18} />}
                  <span className="hidden sm:inline-block text-xs uppercase">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setActiveTab('personal');
                  }}
                  className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isEditing 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' 
                      : 'bg-[#047262] hover:bg-[#03594d] text-white shadow-[#047262]/25 shadow-md active:scale-95'
                  }`}
                >
                  <Edit3 size={17} />
                  <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Logout Account"
                  className="p-3.5 bg-gray-100 dark:bg-rose-500/15 hover:bg-gray-200 dark:hover:bg-rose-500/25 text-gray-700 dark:text-rose-400 rounded-2xl transition-all flex items-center justify-center font-bold text-sm gap-2"
                >
                  <LogOut size={18} className="text-gray-600 dark:text-rose-400" />
                  <span className="sm:hidden md:inline lg:hidden xl:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ROLE-BASED STATS & METRICS GRID
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {role === 'seller' && (
            <>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#047262]/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Active Listings</span>
                  <div className="w-10 h-10 rounded-xl bg-[#e0f5f0] text-[#047262] flex items-center justify-center font-bold">
                    <Building size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">{sellerListingCount}</span>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Verified properties on portal</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#047262]/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Buyer Inquiries</span>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">34</span>
                  <p className="text-xs text-[#047262] font-bold mt-1">+8 new leads this week</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#047262]/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Total Impressions</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">1,420</span>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Across all active listings</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#047262] to-[#03594d] p-6 rounded-[24px] text-white shadow-[0_6px_25px_rgba(4,114,98,0.25)] flex flex-col justify-between">
                <div>
                  <span className="text-white/80 font-black text-xs uppercase tracking-wider">Quick Seller Actions</span>
                  <p className="font-bold text-sm mt-1">Manage inventories or post a new residential unit</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link 
                    to="/seller/my-listings" 
                    className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-center text-xs font-bold transition-all"
                  >
                    My Listings
                  </Link>
                  <Link 
                    to="/seller/add-property" 
                    className="flex-1 py-2.5 bg-white text-[#047262] font-extrabold rounded-xl text-center text-xs hover:bg-white/95 shadow-sm transition-all"
                  >
                    + Add New
                  </Link>
                </div>
              </div>
            </>
          )}

          {role === 'buyer' && (
            <>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#047262]/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Saved Wishlist</span>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Heart size={20} className="fill-rose-500 text-rose-500" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">{wishlistCount}</span>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Properties bookmarked for comparison</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#047262]/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Active Inquiries</span>
                  <div className="w-10 h-10 rounded-xl bg-[#e0f5f0] text-[#047262] flex items-center justify-center font-bold">
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">4</span>
                  <p className="text-xs text-[#047262] font-bold mt-1">Ongoing discussions with sellers</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#047262]/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Tours Scheduled</span>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">2</span>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Site visits scheduled this weekend</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#047262] to-[#03594d] p-6 rounded-[24px] text-white shadow-[0_6px_25px_rgba(4,114,98,0.25)] flex flex-col justify-between">
                <div>
                  <span className="text-white/80 font-black text-xs uppercase tracking-wider">Ready to Explore?</span>
                  <p className="font-bold text-sm mt-1">Browse verified new towers & luxury villas</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link 
                    to="/wishlist" 
                    className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-center text-xs font-bold transition-all"
                  >
                    My Wishlist
                  </Link>
                  <Link 
                    to="/properties" 
                    className="flex-1 py-2.5 bg-white text-[#047262] font-extrabold rounded-xl text-center text-xs hover:bg-white/95 shadow-sm transition-all"
                  >
                    Browse Listings
                  </Link>
                </div>
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Platform Users</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <User size={20} />
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">1,280</span>
                <p className="text-xs text-green-600 font-bold mt-1">+12% user growth this month</p>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">Verified Listings</span>
                  <div className="w-10 h-10 rounded-xl bg-[#e0f5f0] text-[#047262] flex items-center justify-center font-bold">
                    <Building size={20} />
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">450</span>
                <p className="text-xs text-gray-500 font-semibold mt-1">Approved & RERA Verified</p>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-wider">System Health</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-[#1a2b3c]">100%</span>
                <p className="text-xs text-[#047262] font-bold mt-1">All real-time databases online</p>
              </div>

              <div className="bg-gradient-to-br from-[#1a2b3c] to-[#111c27] p-6 rounded-[24px] text-white shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-purple-300 font-black text-xs uppercase tracking-wider">Admin Governance</span>
                  <p className="font-bold text-sm mt-1">Manage user accounts & verify agency credentials</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link 
                    to="/admin/users" 
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-center text-xs transition-all shadow-md"
                  >
                    Open Users Manager
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* =========================================================================
            TABS NAVIGATION (Personal Info, Password Security, Notifications)
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Navigation Pills */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-white rounded-[28px] p-4 sm:p-5 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-1.5 lg:sticky lg:top-32">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full py-3.5 px-5 rounded-2xl text-left font-bold text-sm flex items-center gap-3.5 transition-all ${
                activeTab === 'personal'
                  ? 'bg-[#047262] text-white shadow-md shadow-[#047262]/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a2b3c]'
              }`}
            >
              <User size={19} className={activeTab === 'personal' ? 'text-white' : 'text-gray-400'} />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full py-3.5 px-5 rounded-2xl text-left font-bold text-sm flex items-center gap-3.5 transition-all ${
                activeTab === 'security'
                  ? 'bg-[#047262] text-white shadow-md shadow-[#047262]/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a2b3c]'
              }`}
            >
              <Lock size={19} className={activeTab === 'security' ? 'text-white' : 'text-gray-400'} />
              <span>Password & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full py-3.5 px-5 rounded-2xl text-left font-bold text-sm flex items-center justify-between transition-all ${
                activeTab === 'notifications'
                  ? 'bg-[#047262] text-white shadow-md shadow-[#047262]/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a2b3c]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bell size={19} className={activeTab === 'notifications' ? 'text-white' : 'text-gray-400'} />
                <span>Notifications</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeTab === 'notifications' ? 'bg-white/20 text-white' : 'bg-[#047262]/10 text-[#047262]'
              }`}>
                ON
              </span>
            </button>
          </aside>

          {/* Right Main Tab Content */}
          <main className="flex-1 w-full bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 border border-gray-100 shadow-[0_6px_35px_rgba(0,0,0,0.03)]">
            
            {/* ---------------------------------------------------------------------
                TAB 1: PERSONAL INFORMATION & AGENCY DETAILS
               --------------------------------------------------------------------- */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSaveProfile}>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1a2b3c] tracking-tight">
                      {isEditing ? 'Edit Personal Information' : 'Personal Information'}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
                      Manage your profile identity and contact details visible to verified users.
                    </p>
                  </div>
                  {isEditing && (
                    <span className="text-xs font-black uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full animate-pulse">
                      Editing Mode
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold text-[#1a2b3c] transition-all ${
                          isEditing 
                            ? 'bg-white border-2 border-gray-200 focus:border-[#047262] focus:outline-none shadow-sm' 
                            : 'bg-gray-50/80 border border-gray-100 text-gray-700 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold text-[#1a2b3c] transition-all ${
                          isEditing 
                            ? 'bg-white border-2 border-gray-200 focus:border-[#047262] focus:outline-none shadow-sm' 
                            : 'bg-gray-50/80 border border-gray-100 text-gray-700 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Phone / Telephone
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold text-[#1a2b3c] transition-all ${
                          isEditing 
                            ? 'bg-white border-2 border-gray-200 focus:border-[#047262] focus:outline-none shadow-sm' 
                            : 'bg-gray-50/80 border border-gray-100 text-gray-700 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Location / City */}
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Primary City / Location
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold text-[#1a2b3c] transition-all ${
                          isEditing 
                            ? 'bg-white border-2 border-gray-200 focus:border-[#047262] focus:outline-none shadow-sm' 
                            : 'bg-gray-50/80 border border-gray-100 text-gray-700 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Role Specific fields (Seller Agency & RERA) */}
                  {role === 'seller' && (
                    <>
                      <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                          Agency / Company Name
                        </label>
                        <div className="relative">
                          <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#047262]" />
                          <input
                            type="text"
                            name="agency"
                            value={formData.agency}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold text-[#1a2b3c] transition-all ${
                              isEditing 
                                ? 'bg-white border-2 border-gray-200 focus:border-[#047262] focus:outline-none shadow-sm' 
                                : 'bg-gray-50/80 border border-gray-100 text-gray-700 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-[#047262] mb-2 flex items-center gap-1">
                          <span>RERA Registration Number</span>
                          <Check size={14} strokeWidth={3} className="text-[#047262]" />
                        </label>
                        <div className="relative">
                          <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#047262]" />
                          <input
                            type="text"
                            name="reraId"
                            value={formData.reraId}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-black text-[#047262] transition-all ${
                              isEditing 
                                ? 'bg-white border-2 border-[#047262] focus:outline-none shadow-sm' 
                                : 'bg-[#e0f5f0]/40 border border-[#047262]/20 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bio & About */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      About & Real Estate Objectives
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-4.5 rounded-2xl text-sm font-semibold text-[#1a2b3c] leading-relaxed transition-all ${
                        isEditing 
                          ? 'bg-white border-2 border-gray-200 focus:border-[#047262] focus:outline-none shadow-sm' 
                          : 'bg-gray-50/80 border border-gray-100 text-gray-700 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit button when editing */}
                {isEditing && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-sm text-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingToServer}
                      className="px-8 py-3.5 bg-[#047262] hover:bg-[#03594d] disabled:opacity-60 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-[#047262]/30 active:scale-95 transition-all"
                    >
                      {savingToServer ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Saving to Server...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Profile Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* ---------------------------------------------------------------------
                TAB 2: PASSWORD & SECURITY
               --------------------------------------------------------------------- */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate}>
                <div className="pb-6 border-b border-gray-100 mb-8">
                  <h2 className="text-xl sm:text-2xl font-black text-[#1a2b3c] tracking-tight">
                    Account Password & Security
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
                    Update your password and review login security protocols for your {role.toUpperCase()} account.
                  </p>
                </div>

                <div className="max-w-lg space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter your current password"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#1a2b3c] focus:border-[#047262] focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        required
                        min="6"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Create a strong new password"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#1a2b3c] focus:border-[#047262] focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Repeat your new password"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#1a2b3c] focus:border-[#047262] focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="px-8 py-3.5 bg-[#047262] hover:bg-[#03594d] disabled:opacity-60 text-white font-black text-sm rounded-2xl shadow-lg shadow-[#047262]/25 transition-transform active:scale-95 flex items-center gap-2"
                    >
                      {updatingPassword ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ---------------------------------------------------------------------
                TAB 3: NOTIFICATIONS & ALERT PREFERENCES
               --------------------------------------------------------------------- */}
            {activeTab === 'notifications' && (
              <div>
                <div className="pb-6 border-b border-gray-100 mb-8">
                  <h2 className="text-xl sm:text-2xl font-black text-[#1a2b3c] tracking-tight">
                    Notification & Alert Preferences
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
                    Control how you receive real-time updates for new property listings, wishlist price drops, and direct messages.
                  </p>
                </div>

                <div className="space-y-5 max-w-2xl">
                  <label className="flex items-center justify-between p-5 rounded-[22px] border border-gray-100 hover:border-gray-200/90 transition-all cursor-pointer bg-gray-50/50">
                    <div>
                      <span className="block text-[#1a2b3c] font-extrabold text-base">Email Notifications</span>
                      <span className="text-xs text-gray-500 font-medium">Receive instant email updates when sellers reply to your inquiries.</span>
                    </div>
                    <input
                      type="checkbox"
                      name="emailAlerts"
                      checked={formData.emailAlerts}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg accent-[#047262] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-5 rounded-[22px] border border-gray-100 hover:border-gray-200/90 transition-all cursor-pointer bg-gray-50/50">
                    <div>
                      <span className="block text-[#1a2b3c] font-extrabold text-base">Wishlist Price Drop Alerts</span>
                      <span className="text-xs text-gray-500 font-medium">Get notified immediately when a saved tower or villa lowers its price.</span>
                    </div>
                    <input
                      type="checkbox"
                      name="priceDrops"
                      checked={formData.priceDrops}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg accent-[#047262] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-5 rounded-[22px] border border-gray-100 hover:border-gray-200/90 transition-all cursor-pointer bg-gray-50/50">
                    <div>
                      <span className="block text-[#1a2b3c] font-extrabold text-base">WhatsApp Instant Alerts</span>
                      <span className="text-xs text-gray-500 font-medium">Receive verified SMS & WhatsApp alerts for confirmed site tours.</span>
                    </div>
                    <input
                      type="checkbox"
                      name="whatsappNotify"
                      checked={formData.whatsappNotify}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg accent-[#047262] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-5 rounded-[22px] border border-gray-100 hover:border-gray-200/90 transition-all cursor-pointer bg-gray-50/50">
                    <div>
                      <span className="block text-[#1a2b3c] font-extrabold text-base">Weekly Market Insights</span>
                      <span className="text-xs text-gray-500 font-medium">A weekly real estate digest of property appreciation & investment advice.</span>
                    </div>
                    <input
                      type="checkbox"
                      name="weeklyNewsletter"
                      checked={formData.weeklyNewsletter}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg accent-[#047262] cursor-pointer"
                    />
                  </label>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem(`realestate_profile_${role}`, JSON.stringify(formData));
                        if (showToast) showToast('Notification preferences saved!', 'success');
                      }}
                      className="px-8 py-3.5 bg-[#047262] hover:bg-[#03594d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#047262]/25 transition-transform active:scale-95"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

export default Profile;
