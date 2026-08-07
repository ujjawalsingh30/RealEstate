import React, { useState, useMemo } from 'react';
import { 
  Users, Filter, Search, Mail, Phone, Lock, Unlock, 
  Trash2, Shield, UserCheck, UserX, ChevronDown, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import api from '../config/api';

const UsersManager = () => {
  const { showToast } = usePropertyContext();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.data.success) {
          setUsersList(response.data.users);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        if (showToast) showToast('Failed to load user list.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Toggle User Lock/Suspend Status
  const toggleUserStatus = async (id, name, currentStatus, role) => {
    if (role === 'ADMIN') {
      if (showToast) showToast('Cannot modify admin status.', 'error');
      return;
    }
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await api.put(`/admin/users/${role}/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setUsersList((prev) =>
          prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
        );
        if (showToast) {
          showToast(
            `User "${name}" has been ${newStatus === 'Suspended' ? 'suspended & restricted' : 'activated'}!`,
            newStatus === 'Suspended' ? 'error' : 'success'
          );
        }
      }
    } catch (err) {
      if (showToast) showToast('Failed to update user status.', 'error');
    }
  };

  // Delete User function removed

  // Filter & Search computation
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1650px] mx-auto text-left font-sans antialiased bg-gray-50 dark:bg-[#0b131e] min-h-screen transition-colors duration-300">
      
      {/* =====================================================================
          HEADER SECTION: Title, Search & Filter Options
          ===================================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight flex items-center gap-3">
            <span>User Management</span>
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs hidden sm:inline-block">
              {usersList.length} Accounts
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base mt-1.5">
            Monitor platform users, audit verification status, and govern role access levels across the ecosystem.
          </p>
        </div>

        {/* Right Controls: Search Box & Filter Button */}
        <div className="w-full md:w-auto flex items-center gap-3 relative shrink-0">
          <div className="relative flex-1 sm:w-72">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search user, email or ID..."
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

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`px-5 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all border shadow-xs ${
                roleFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'bg-[#047262] text-white border-[#047262]'
                  : 'bg-white dark:bg-[#111c2a] hover:bg-gray-50 dark:hover:bg-[#1b2b3f] text-[#1a2b3c] dark:text-white border-gray-200 dark:border-gray-700'
              }`}
            >
              <Filter size={17} />
              <span>Filter</span>
              {(roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>

            {/* Filter Options Popover */}
            {isFilterMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterMenuOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-[#1b2b3f] rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-700 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1a2b3c] dark:text-white">Filter Accounts</span>
                    <button
                      type="button"
                      onClick={() => {
                        setRoleFilter('ALL');
                        setStatusFilter('ALL');
                        setIsFilterMenuOpen(false);
                      }}
                      className="text-[11px] font-bold text-rose-500 hover:underline"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Role Selector */}
                  <div className="mb-4">
                    <span className="block text-[11px] font-extrabold uppercase text-gray-400 mb-2">Platform Role</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['ALL', 'ADMIN', 'BUYER', 'SELLER'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setRoleFilter(role)}
                          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-colors text-left ${
                            roleFilter === role ? 'bg-[#047262] text-white' : 'bg-gray-50 dark:bg-[#111c2a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div>
                    <span className="block text-[11px] font-extrabold uppercase text-gray-400 mb-2">Account Status</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['ALL', 'Active', 'Suspended'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`py-2 px-2.5 rounded-xl font-extrabold text-xs text-center transition-colors ${
                            statusFilter === st ? 'bg-[#1a2b3c] dark:bg-[#0dc5a5] text-white dark:text-[#1a2b3c]' : 'bg-gray-50 dark:bg-[#111c2a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFilterMenuOpen(false)}
                    className="w-full mt-5 py-2.5 bg-gray-900 hover:bg-black text-white font-black text-xs rounded-xl uppercase tracking-wider transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          USERS TABLE PANEL CARD
          ===================================================================== */}
      <div className="bg-white dark:bg-[#111c2a] rounded-[32px] sm:rounded-[36px] border border-gray-100 dark:border-gray-800 shadow-[0_6px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Panel Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#111c2a]">
          <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white tracking-tight">
            Platform Users
          </h2>
          <span className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3.5 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
            Showing {filteredUsers.length} users
          </span>
        </div>

        {/* Table View */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 sm:p-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-[#1b2b3f] text-gray-400 dark:text-gray-500 flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#1a2b3c] dark:text-white mb-1">No Matching Platform Users</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mb-6">
              We couldn't find any accounts matching your current search query or role filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); setStatusFilter('ALL'); }}
              className="px-6 py-2.5 bg-[#047262] text-white font-bold text-sm rounded-xl shadow-xs hover:bg-[#03594d] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase bg-gray-50/60 dark:bg-[#18273a]">
                  <th className="py-4 px-6 sm:px-8">USER INFO</th>
                  <th className="py-4 px-6">ROLE</th>
                  <th className="py-4 px-6">CONTACT DETAILS</th>
                  <th className="py-4 px-6">ACCOUNT STATUS</th>
                  <th className="py-4 px-6 sm:px-8 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/90 dark:divide-gray-800/90 text-sm font-sans">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-[#1b2b3f] transition-colors duration-150 group"
                  >
                    
                    {/* USER INFO COLUMN */}
                    <td className="py-4 px-6 sm:px-8">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-full ${user.avatarColor} font-black text-sm flex items-center justify-center shrink-0 shadow-2xs border-2 border-white dark:border-gray-700 select-none`}>
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1a2b3c] dark:text-white text-[15px] leading-snug group-hover:text-[#047262] dark:group-hover:text-[#0dc5a5] transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE COLUMN */}
                    <td className="py-4 px-6">
                      {user.role === 'ADMIN' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-amber-100/90 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider shadow-2xs">
                          ADMIN
                        </span>
                      )}
                      {user.role === 'BUYER' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-blue-100/90 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wider shadow-2xs">
                          BUYER
                        </span>
                      )}
                      {user.role === 'SELLER' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-[#e0f5f0]/90 dark:bg-[#047262]/20 text-[#047262] dark:text-[#0dc5a5] font-extrabold text-xs uppercase tracking-wider shadow-2xs">
                          SELLER
                        </span>
                      )}
                    </td>

                    {/* CONTACT DETAILS COLUMN */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                          <Mail size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                          <span className="truncate max-w-[220px]" title={user.email}>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                            <Phone size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ACCOUNT STATUS COLUMN */}
                    <td className="py-4 px-6">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          <Unlock size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20">
                          <Lock size={14} className="text-rose-500 dark:text-rose-400 shrink-0" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="py-4 px-6 sm:px-8 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {/* Lock / Unlock Toggle Button */}
                        {user.role !== 'ADMIN' && (
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user.id, user.name, user.status, user.role)}
                            className={`p-2.5 rounded-xl transition-all shadow-2xs active:scale-90 ${
                              user.status === 'Active'
                                ? 'bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-500 dark:text-amber-400'
                                : 'bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            }`}
                            title={user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                          >
                            {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default UsersManager;
