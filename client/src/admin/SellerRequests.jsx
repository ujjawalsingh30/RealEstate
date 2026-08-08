import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, Search, Filter, Mail, Phone, FileText, 
  CheckCircle2, XCircle, Clock, AlertCircle, Trash2, ExternalLink, Building, Check, Loader2
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import api from '../config/api';

const SellerRequests = () => {
  const { showToast } = usePropertyContext();

  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch live sellers from backend
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await api.get('/admin/sellers');
        if (response.data.success) {
          const formatted = response.data.sellers.map(s => ({
            id: s._id,
            sellerName: s.name,
            agencyName: s.agencyName || 'Independent',
            email: s.email,
            phone: s.phone || 'N/A',
            reraNumber: s.reraNumber || 'Not Provided',
            status: s.status === 'pending' ? 'Pending Review' : s.status === 'approved' ? 'Approved' : s.status === 'blocked' ? 'Blocked' : 'Rejected',
            submittedDate: new Date(s.createdAt).toLocaleDateString(),
            requestType: 'New Seller Registration',
            documents: ['Identity Proof', 'Agency License'],
            initials: (s.agencyName || s.name).charAt(0).toUpperCase(),
            avatarColor: 'bg-emerald-100 text-emerald-700'
          }));
          setSellerRequests(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch sellers:', err);
        if (showToast) showToast('Failed to load seller requests.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  // Handle Approve (Unlocks seller property uploads!)
  const handleApprove = async (id, agencyName) => {
    try {
      const res = await api.put(`/admin/sellers/${id}/status`, { status: 'approved' });
      if (res.data.success) {
        setSellerRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: 'Approved' } : req))
        );
        if (showToast) {
          showToast(`Approved SLA request for "${agencyName}"! Seller account unlocked.`, 'success');
        }
      }
    } catch (err) {
      if (showToast) showToast('Failed to approve seller.', 'error');
    }
  };

  // Handle Reject / Clarification
  const handleReject = async (id, agencyName) => {
    try {
      const res = await api.put(`/admin/sellers/${id}/status`, { status: 'rejected' });
      if (res.data.success) {
        setSellerRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: 'Rejected' } : req))
        );
        if (showToast) {
          showToast(`Request for "${agencyName}" rejected.`, 'error');
        }
      }
    } catch (err) {
      if (showToast) showToast('Failed to reject seller.', 'error');
    }
  };

  // Handle Block
  const handleBlock = async (id, agencyName) => {
    try {
      const res = await api.put(`/admin/sellers/${id}/status`, { status: 'blocked' });
      if (res.data.success) {
        setSellerRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: 'Blocked' } : req))
        );
        if (showToast) {
          showToast(`Account for "${agencyName}" has been blocked.`, 'error');
        }
      }
    } catch (err) {
      if (showToast) showToast('Failed to block seller.', 'error');
    }
  };

  // Delete Request Archive function removed

  // Document preview mock toast
  const handleViewDocs = (docName, agencyName) => {
    if (showToast) {
      showToast(`Opening secure document view for "${docName}" submitted by ${agencyName}...`, 'info');
    }
  };

  // Computed filtered list
  const filteredRequests = useMemo(() => {
    return sellerRequests.filter((req) => {
      const matchesSearch = 
        req.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reraNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sellerRequests, searchQuery, statusFilter]);

  const pendingCount = sellerRequests.filter((r) => r.status === 'Pending Review').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="animate-spin text-[#047262]" />
        <p className="text-gray-500 font-bold">Loading seller requests...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1650px] mx-auto text-left font-sans antialiased bg-gray-50 dark:bg-black min-h-screen transition-colors duration-300">
      
      {/* =====================================================================
          HEADER & METRICS BANNER
          ===================================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight flex items-center gap-3">
            <span>Seller Verification Requests</span>
            {pendingCount > 0 && (
              <span className="bg-[#047262] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                {pendingCount} Action Required
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base mt-1.5">
            Audit licensed agent RERA credentials, background documentation, and listing quota expansion authorizations.
          </p>
        </div>

        {/* Right Controls: Search & Tabs */}
        <div className="w-full md:w-auto flex items-center gap-3 relative shrink-0">
          <div className="relative flex-1 sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search seller, RERA number or agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111c2a] border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-sm text-[#1a2b3c] dark:text-white focus:outline-none focus:border-[#047262] dark:focus:border-[#0dc5a5] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          STATUS FILTER PILLS
          ===================================================================== */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {['ALL', 'Pending Review', 'Approved', 'Rejected', 'Blocked'].map((st) => {
          const isActive = statusFilter === st;
          const count = st === 'ALL' ? sellerRequests.length : sellerRequests.filter(r => r.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-2xs ${
                isActive
                  ? 'bg-[#1a2b3c] dark:bg-[#0dc5a5] text-white dark:text-[#1a2b3c] border-[#1a2b3c] dark:border-[#0dc5a5] shadow-md'
                  : 'bg-white dark:bg-[#111c2a] hover:bg-gray-50 dark:hover:bg-[#1b2b3f] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{st}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[11px] ${isActive ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          REQUESTS CARDS / AUDIT LIST
          ===================================================================== */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-[#111c2a] rounded-[32px] p-12 sm:p-16 border border-gray-100 dark:border-gray-800 text-center max-w-lg mx-auto shadow-[0_6px_35px_rgba(0,0,0,0.02)]">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-[#1b2b3f] text-gray-400 dark:text-gray-500 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#1a2b3c] dark:text-white mb-1">No Matching Seller Requests</h3>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mb-6">
            We couldn't find any agent verification records matching your current filter criteria.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
            className="px-6 py-2.5 bg-[#047262] text-white font-bold text-sm rounded-xl shadow-xs hover:bg-[#03594d] transition-colors"
          >
            Show All Requests
          </button>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-[#111c2a] rounded-[30px] sm:rounded-[36px] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-[0_6px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.07)] dark:hover:border-gray-700 transition-all duration-200 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100/90 dark:border-gray-800">
                
                {/* Seller & Agency Profile Column */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${req.avatarColor} font-black text-lg flex items-center justify-center shrink-0 shadow-2xs border-2 border-white dark:border-gray-800`}>
                    {req.initials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white group-hover:text-[#047262] dark:group-hover:text-[#0dc5a5] transition-colors">
                        {req.agencyName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-extrabold text-[11px]">
                        {req.id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <span className="text-[#047262] dark:text-[#0dc5a5] font-black">{req.sellerName}</span>
                      <span>•</span>
                      <span>{req.reraNumber}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                        <Clock size={12} />
                        <span>Submitted {req.submittedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Status Badge */}
                <div className="flex items-center gap-3 self-start lg:self-center">
                  {req.status === 'Pending Review' && (
                    <span className="px-4 py-2 rounded-2xl bg-amber-100/90 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <AlertCircle size={15} className="text-amber-600 dark:text-amber-500" />
                      <span>Pending Audit</span>
                    </span>
                  )}
                  {req.status === 'Approved' && (
                    <span className="px-4 py-2 rounded-2xl bg-[#e0f5f0] dark:bg-[#047262]/20 text-[#047262] dark:text-[#0dc5a5] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 size={15} className="text-[#047262] dark:text-[#0dc5a5]" />
                      <span>Verified & Approved</span>
                    </span>
                  )}
                  {req.status === 'Rejected' && (
                    <span className="px-4 py-2 rounded-2xl bg-rose-100/90 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <XCircle size={15} className="text-rose-600 dark:text-rose-500" />
                      <span>Rejected / Inactive</span>
                    </span>
                  )}
                  {req.status === 'Blocked' && (
                    <span className="px-4 py-2 rounded-2xl bg-red-100/90 dark:bg-red-500/20 text-red-800 dark:text-red-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <XCircle size={15} className="text-red-600 dark:text-red-500" />
                      <span>Blocked</span>
                    </span>
                  )}
                </div>

              </div>

              {/* Request Type & Contact & Documents Details Row */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Audit Purpose */}
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block">Audit Purpose / Authorization</span>
                  <p className="text-sm font-extrabold text-[#1a2b3c] dark:text-white">
                    {req.requestType}
                  </p>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block">Verified Contact Coordinates</span>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={14} className="text-[#047262] dark:text-[#0dc5a5]" />
                      <span>{req.email}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} className="text-[#047262] dark:text-[#0dc5a5]" />
                      <span>{req.phone}</span>
                    </span>
                  </div>
                </div>

                {/* Submitted Documents Badges & Action Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-3">
                  <div className="space-y-1 flex-1 md:hidden">
                    <span className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block">Submitted Documents</span>
                    <div className="flex flex-wrap gap-1.5">
                      {req.documents.map((doc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleViewDocs(doc, req.agencyName)}
                          className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200/70 dark:border-gray-700 inline-flex items-center gap-1 transition-colors"
                        >
                          <FileText size={12} />
                          <span>{doc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audit Actions (Approve / Reject / Block / Delete) */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {req.status !== 'Approved' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(req.id, req.agencyName)}
                        className="px-5 py-3 rounded-2xl bg-[#047262] hover:bg-[#03594d] text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-[#047262]/20 flex items-center gap-1.5 active:scale-95"
                      >
                        <Check size={16} strokeWidth={3} />
                        <span>{req.status === 'Blocked' ? 'Unblock' : 'Approve'}</span>
                      </button>
                    )}

                    {req.status === 'Pending Review' && (
                      <button
                        type="button"
                        onClick={() => handleReject(req.id, req.agencyName)}
                        className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold text-xs sm:text-sm transition-all active:scale-95"
                      >
                        <span>Reject</span>
                      </button>
                    )}

                    {req.status === 'Approved' && (
                      <button
                        type="button"
                        onClick={() => handleBlock(req.id, req.agencyName)}
                        className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 font-extrabold text-xs sm:text-sm transition-all active:scale-95"
                      >
                        <span>Block Seller</span>
                      </button>
                    )}

                  </div>
                </div>

              </div>

              {/* Desktop Document Badge Bar */}
              <div className="hidden md:flex items-center gap-2 pt-5 mt-5 border-t border-gray-50 dark:border-gray-800 text-xs">
                <span className="font-extrabold text-gray-400 dark:text-gray-500 mr-2 uppercase tracking-wider text-[10px]">Attached Verification Pack ({req.documents.length} Docs):</span>
                {req.documents.map((doc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleViewDocs(doc, req.agencyName)}
                    className="px-3 py-1.5 bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100/90 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200/80 dark:border-gray-700 inline-flex items-center gap-1.5 transition-all shadow-2xs hover:text-[#047262] dark:hover:text-[#0dc5a5]"
                  >
                    <FileText size={13} className="text-[#047262] dark:text-[#0dc5a5]" />
                    <span>{doc}</span>
                    <ExternalLink size={11} className="text-gray-400 dark:text-gray-500 ml-1" />
                  </button>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SellerRequests;
