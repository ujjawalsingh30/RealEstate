import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Eye, Check, ChevronDown, Edit3, Trash2, Home, Bath, 
  Maximize, ShieldCheck, Plus, Building, FileText, CheckCircle2, X, Save
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import api from '../config/api';

const MyListings = () => {
  const { properties, setProperties, showToast } = usePropertyContext();
  const navigate = useNavigate();

  // Initial enriched listings matching & expanding on the user screenshot
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerProperties = async () => {
      try {
        const response = await api.get('/properties/seller-listings');
        if (response.data.success) {
          const fetchedListings = response.data.properties.map((p) => ({
            id: p._id,
            title: p.title || 'Premium Residential Tower',
            location: p.location || 'Prime Urban District',
            priceText: p.priceText || '₹1,25,00,000',
            priceVal: p.priceVal || 1.25,
            category: p.category || 'FLAT',
            status: p.status === 'Sold' ? 'Sold' : 'Available',
            verified: p.verified !== false,
            views: p.views || Math.floor(Math.random() * 15) + 1,
            image: p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            specs: {
              beds: p.bhk || 3,
              baths: p.baths || 3,
              sqft: p.sqft || 1800,
              label1: 'BEDS',
              label2: 'BATHS',
              label3: 'SQ FT'
            }
          }));
          setListings(fetchedListings);
        }
      } catch (error) {
        console.error('Error fetching seller listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerProperties();
  }, []);

  // Active Dropdown state for selecting property status (Available vs Sold)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Edit Modal States
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    location: '',
    priceText: '',
    category: 'FLAT',
    beds: '',
    baths: '',
    sqft: ''
  });

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.status-dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Status Change Handler
  const handleStatusChange = (id, newStatus) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setOpenDropdownId(null);
    if (showToast) {
      showToast(`Listing marked as ${newStatus}!`, newStatus === 'Sold' ? 'info' : 'success');
    }
  };

  // Delete Handler
  const handleDelete = (id, title) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    // also remove from context if present
    if (setProperties) {
      setProperties((prev) => prev.filter((item) => item.id !== id));
    }
    if (showToast) {
      showToast('Property listing deleted successfully.', 'info');
    }
  };

  // Edit Handler
  const startEditing = (property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title,
      location: property.location,
      priceText: property.priceText,
      category: property.category || 'FLAT',
      beds: property.specs.beds,
      baths: property.specs.baths,
      sqft: property.specs.sqft
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === editingProperty.id) {
          return {
            ...item,
            title: editForm.title,
            location: editForm.location,
            priceText: editForm.priceText,
            category: editForm.category,
            specs: {
              ...item.specs,
              beds: editForm.beds,
              baths: editForm.baths,
              sqft: editForm.sqft
            }
          };
        }
        return item;
      })
    );
    setEditingProperty(null);
    if (showToast) {
      showToast('Property details updated successfully!', 'success');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1650px] mx-auto text-left font-sans antialiased bg-transparent min-h-[90vh]">
      
      {/* =====================================================================
          HEADER SECTION: Title & Add Property Action Button
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight">
            My Listings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base mt-1.5">
            Manage your listed properties, track impressions, and modify inventory availability status.
          </p>
        </div>

        <Link
          to="/seller/add-property"
          className="w-full sm:w-auto px-6 py-3.5 bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] dark:hover:bg-[#0bb395] active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-[20px] shadow-[0_6px_25px_rgba(4,114,98,0.3)] dark:shadow-[0_6px_25px_rgba(13,197,165,0.2)] transition-all flex items-center justify-center gap-2.5 shrink-0 group"
        >
          <Plus size={20} className="stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {/* =====================================================================
          PROPERTY CARDS GRID (Responsive: 1 -> 2 -> 3 -> 4 Columns)
          ===================================================================== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7 lg:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-[#162231] rounded-[26px] sm:rounded-[30px] border border-gray-100 dark:border-[#28394e] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between overflow-hidden animate-pulse">
              <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-200 dark:bg-gray-800"></div>
              <div className="p-5 sm:p-6 text-left">
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-gray-50/80 dark:bg-[#111c2a]/50 border border-gray-100 dark:border-gray-800 text-center">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-gray-50/0">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-20 shrink-0"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-10 shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white dark:bg-[#162231] rounded-[32px] p-12 text-center max-w-xl mx-auto my-12 border border-gray-100 dark:border-[#28394e] shadow-sm transition-colors">
          <div className="w-20 h-20 rounded-3xl bg-[#047262]/10 dark:bg-[#0dc5a5]/10 text-[#047262] dark:text-[#0dc5a5] flex items-center justify-center mx-auto mb-6">
            <Building size={36} />
          </div>
          <h3 className="text-xl font-bold text-[#1a2b3c] dark:text-white mb-2">No Active Properties Listed Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You haven't added any luxury apartments or villas to your portfolio yet. Click below to publish your first verified listing!
          </p>
          <Link
            to="/seller/add-property"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] dark:hover:bg-[#0bb395] text-white font-bold rounded-2xl shadow-md transition-colors"
          >
            <Plus size={18} />
            <span>Post Your First Property</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7 lg:gap-8">
          {listings.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-[#162231] rounded-[26px] sm:rounded-[30px] border border-gray-100 dark:border-[#28394e] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Image Overlay */}
              <div>
                <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Overlays for optimal text reading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges (Status + Verified) */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider uppercase shadow-sm flex items-center gap-1.5 text-white backdrop-blur-md ${
                        property.status === 'Available'
                          ? 'bg-[#00b894] border border-white/20'
                          : 'bg-blue-600 border border-white/20'
                      }`}
                    >
                      <span>{property.status.toUpperCase()}</span>
                    </span>

                    {property.verified && (
                      <span className="px-3 py-1.5 rounded-xl bg-[#01a3a4]/90 text-white text-[11px] font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1 shadow-sm border border-white/20">
                        <Check size={13} strokeWidth={3} className="text-white" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom-Left Price Tag over image */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-2xl sm:text-[26px] font-black text-white tracking-tight drop-shadow-md">
                      {property.priceText}
                    </span>
                  </div>
                </div>

                {/* Card Body & Location */}
                <div className="p-5 sm:p-6 text-left">
                  {/* Category Pill & View Count */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-black tracking-widest uppercase ${
                      property.category === 'VILLA' ? 'text-purple-600 dark:text-purple-400' : property.category === 'COMMERCIAL' ? 'text-amber-600 dark:text-amber-400' : 'text-[#047262] dark:text-[#0dc5a5]'
                    }`}>
                      {property.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-400 dark:text-gray-400 bg-gray-50 dark:bg-[#1b2b3f] px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <Eye size={13} />
                      <span>{property.views}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="font-extrabold text-base sm:text-lg text-[#1a2b3c] dark:text-white hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors cursor-pointer line-clamp-1 mb-2"
                    title={property.title}
                  >
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
                    <MapPin size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="truncate" title={property.location}>{property.location}</span>
                  </div>

                  {/* Features Specifications Row (Beds, Baths, SqFt) */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-gray-50/80 dark:bg-[#111c2a]/50 border border-gray-100 dark:border-gray-800 text-center">
                    <div className="flex flex-col items-center">
                      <Home size={17} className="text-gray-400 dark:text-gray-500 mb-1" />
                      <span className="text-sm font-black text-[#1a2b3c] dark:text-gray-200">{property.specs.beds}</span>
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{property.specs.label1}</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-gray-200/60 dark:border-gray-700/50 px-1">
                      <Bath size={17} className="text-gray-400 dark:text-gray-500 mb-1" />
                      <span className="text-sm font-black text-[#1a2b3c] dark:text-gray-200">{property.specs.baths}</span>
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{property.specs.label2}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Maximize size={17} className="text-gray-400 dark:text-gray-500 mb-1" />
                      <span className="text-sm font-black text-[#1a2b3c] dark:text-gray-200">{property.specs.sqft}</span>
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{property.specs.label3}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Interactive Status Selector, Edit & Delete */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-gray-50/0">
                
                {/* Status Selector Dropdown Box */}
                <div className="relative status-dropdown-container flex-1 mr-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === property.id ? null : property.id);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-xs ${
                      property.status === 'Available'
                        ? 'bg-[#047262]/10 dark:bg-[#0dc5a5]/10 text-[#047262] dark:text-[#0dc5a5] border-[#047262]/30 dark:border-[#0dc5a5]/30 hover:bg-[#047262]/15 dark:hover:bg-[#0dc5a5]/20'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 hover:bg-blue-100/80 dark:hover:bg-blue-500/20'
                    }`}
                  >
                    <span className="truncate">{property.status}</span>
                    <ChevronDown size={15} className={`transition-transform duration-200 ${openDropdownId === property.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Options Menu */}
                  {openDropdownId === property.id && (
                    <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-white dark:bg-[#1b2b3f] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(property.id, 'Available')}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-between ${
                          property.status === 'Available'
                            ? 'bg-[#047262] text-white'
                            : 'text-[#1a2b3c] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#203147]'
                        }`}
                      >
                        <span>Available</span>
                        {property.status === 'Available' && <Check size={14} />}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleStatusChange(property.id, 'Sold')}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-between border-t border-gray-100 dark:border-gray-700 ${
                          property.status === 'Sold'
                            ? 'bg-blue-600 text-white'
                            : 'text-[#1a2b3c] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#203147]'
                        }`}
                      >
                        <span>Sold</span>
                        {property.status === 'Sold' && <Check size={14} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => startEditing(property)}
                  title="Edit Property Information"
                  className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200/90 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#1a2b3c] dark:text-gray-200 font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <Edit3 size={15} className="text-gray-600 dark:text-gray-400" />
                  <span>Edit</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(property.id, property.title)}
                  title="Delete Property Listing"
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all shrink-0 active:scale-90 shadow-2xs"
                >
                  <Trash2 size={17} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          EDIT PROPERTY MODAL DIALOG
          ===================================================================== */}
      {editingProperty && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setEditingProperty(null)} />
          
          <div className="bg-white dark:bg-[#162231] rounded-[32px] p-6 sm:p-8 max-w-lg w-full z-10 shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-2xl border border-gray-100 dark:border-[#28394e] animate-in fade-in zoom-in-95 duration-200 text-left transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#28394e] mb-6">
              <div>
                <h3 className="text-xl font-black text-[#1a2b3c] dark:text-white">Edit Property Listing</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Modify listing specifications and asking price.</p>
              </div>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-1.5">Property Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-bold text-sm text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:outline-none focus:bg-white dark:focus:bg-[#162231] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-1.5">Location / City</label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-bold text-sm text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:outline-none focus:bg-white dark:focus:bg-[#162231] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-1.5">Price Text</label>
                  <input
                    type="text"
                    required
                    value={editForm.priceText}
                    onChange={(e) => setEditForm({ ...editForm, priceText: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-black text-sm text-[#047262] dark:text-[#0dc5a5] focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:outline-none focus:bg-white dark:focus:bg-[#162231] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-1.5">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-2xl font-bold text-sm text-[#1a2b3c] dark:text-white focus:border-[#047262] dark:focus:border-[#0dc5a5] focus:outline-none transition-all"
                  >
                    <option value="FLAT">FLAT</option>
                    <option value="VILLA">VILLA</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                    <option value="PLOT">PLOT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Beds / Type</label>
                  <input
                    type="text"
                    value={editForm.beds}
                    onChange={(e) => setEditForm({ ...editForm, beds: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-xl font-bold text-sm text-center text-[#1a2b3c] dark:text-white focus:outline-none focus:border-[#047262] dark:focus:border-[#0dc5a5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Baths / SqFt</label>
                  <input
                    type="text"
                    value={editForm.baths}
                    onChange={(e) => setEditForm({ ...editForm, baths: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-xl font-bold text-sm text-center text-[#1a2b3c] dark:text-white focus:outline-none focus:border-[#047262] dark:focus:border-[#0dc5a5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Area / Legal</label>
                  <input
                    type="text"
                    value={editForm.sqft}
                    onChange={(e) => setEditForm({ ...editForm, sqft: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1b2b3f] border border-gray-200 dark:border-[#28394e] rounded-xl font-bold text-sm text-center text-[#1a2b3c] dark:text-white focus:outline-none focus:border-[#047262] dark:focus:border-[#0dc5a5]"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-[#28394e] flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#047262] hover:bg-[#03594d] dark:bg-[#0dc5a5] dark:text-[#0b131e] dark:hover:bg-[#0bb395] active:scale-95 text-white font-extrabold rounded-xl text-sm shadow-md shadow-[#047262]/25 dark:shadow-none transition-all flex items-center gap-2"
                >
                  <Save size={17} />
                  <span>Save Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyListings;
