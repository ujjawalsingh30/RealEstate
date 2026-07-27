import React, { useState, useMemo } from 'react';
import { 
  Users, Filter, Search, Mail, Phone, Lock, Unlock, 
  Trash2, Shield, UserCheck, UserX, ChevronDown, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';

const UsersManager = () => {
  const { showToast } = usePropertyContext();

  // Initial user dataset matching and expanding the provided Admin User Management screenshot
  const [usersList, setUsersList] = useState([
    {
      id: 'EDDE5155',
      name: 'HDS',
      initials: 'H',
      avatarColor: 'bg-emerald-100 text-emerald-800',
      role: 'ADMIN',
      email: 'gsukuna310@gmail.com',
      phone: '',
      status: 'Active',
      joined: '2026-06-12'
    },
    {
      id: '92F45267',
      name: 'om',
      initials: 'O',
      avatarColor: 'bg-cyan-100 text-cyan-800',
      role: 'BUYER',
      email: 'omprakashkhatuasonu@gmail.com',
      phone: '',
      status: 'Active',
      joined: '2026-06-15'
    },
    {
      id: '92F45281',
      name: 'suresh',
      initials: 'S',
      avatarColor: 'bg-teal-100 text-teal-800',
      role: 'SELLER',
      email: 'sureshbarik969@gmail.com',
      phone: '9692530661',
      status: 'Active',
      joined: '2026-06-18'
    },
    {
      id: '71C54028',
      name: 'Jack',
      initials: 'J',
      avatarColor: 'bg-blue-100 text-blue-800',
      role: 'BUYER',
      email: 'abidmohsinaidi9@gmail.com',
      phone: '',
      status: 'Active',
      joined: '2026-06-22'
    },
    {
      id: '71C54036',
      name: 'Tim',
      initials: 'T',
      avatarColor: 'bg-indigo-100 text-indigo-800',
      role: 'SELLER',
      email: 'abidmohsinaidi8@gmail.com',
      phone: '',
      status: 'Active',
      joined: '2026-06-25'
    },
    {
      id: '71C54168',
      name: 'Hexagon',
      initials: 'H',
      avatarColor: 'bg-emerald-100 text-emerald-800',
      role: 'SELLER',
      email: 'hexagonsservices@gmail.com',
      phone: '8566889666',
      status: 'Active',
      joined: '2026-07-02'
    },
    {
      id: '71C54215',
      name: 'Ankit',
      initials: 'A',
      avatarColor: 'bg-teal-100 text-teal-800',
      role: 'SELLER',
      email: 'harshitjaiswal270702@gmail.com',
      phone: '',
      status: 'Active',
      joined: '2026-07-05'
    },
    {
      id: '71C54230',
      name: 'Harshit Jaiswal',
      initials: 'H',
      avatarColor: 'bg-purple-100 text-purple-800',
      role: 'BUYER',
      email: 'harshitjaiswal@gmail.com',
      phone: '',
      status: 'Active',
      joined: '2026-07-10'
    },
    {
      id: '88F19234',
      name: 'Rajiv Mehra',
      initials: 'R',
      avatarColor: 'bg-amber-100 text-amber-800',
      role: 'SELLER',
      email: 'rajiv.mehra@realtyindia.in',
      phone: '9811234567',
      status: 'Active',
      joined: '2026-07-14'
    },
    {
      id: '45D99211',
      name: 'Priyanka Desai',
      initials: 'P',
      avatarColor: 'bg-pink-100 text-pink-800',
      role: 'BUYER',
      email: 'priyanka.desai99@gmail.com',
      phone: '9822441100',
      status: 'Active',
      joined: '2026-07-20'
    }
  ]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Toggle User Lock/Suspend Status
  const toggleUserStatus = (id, name, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsersList((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
    );
    if (showToast) {
      showToast(
        `User "${name}" has been ${newStatus === 'Suspended' ? 'suspended & restricted' : 'activated'}!`,
        newStatus === 'Suspended' ? 'error' : 'success'
      );
    }
  };

  // Delete User
  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete platform account for "${name}"?`)) {
      setUsersList((prev) => prev.filter((user) => user.id !== id));
      if (showToast) {
        showToast(`Account for "${name}" (ID: ${id}) permanently removed.`, 'info');
      }
    }
  };

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
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1650px] mx-auto text-left font-sans antialiased bg-gray-50 min-h-screen">
      
      {/* =====================================================================
          HEADER SECTION: Title, Search & Filter Options
          ===================================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] tracking-tight flex items-center gap-3">
            <span>User Management</span>
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs hidden sm:inline-block">
              {usersList.length} Accounts
            </span>
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base mt-1.5">
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-[#1a2b3c] focus:outline-none focus:border-[#047262] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-md"
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
                  : 'bg-white hover:bg-gray-50 text-[#1a2b3c] border-gray-200'
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
                <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1a2b3c]">Filter Accounts</span>
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
                            roleFilter === role ? 'bg-[#047262] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                            statusFilter === st ? 'bg-[#1a2b3c] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
      <div className="bg-white rounded-[32px] sm:rounded-[36px] border border-gray-100 shadow-[0_6px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Panel Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] tracking-tight">
            Platform Users
          </h2>
          <span className="text-xs sm:text-sm font-bold text-gray-400 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
            Showing {filteredUsers.length} users
          </span>
        </div>

        {/* Table View */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 sm:p-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#1a2b3c] mb-1">No Matching Platform Users</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-6">
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
                <tr className="border-b border-gray-100 text-[11px] font-black tracking-widest text-gray-400 uppercase bg-gray-50/60">
                  <th className="py-4 px-6 sm:px-8">USER INFO</th>
                  <th className="py-4 px-6">ROLE</th>
                  <th className="py-4 px-6">CONTACT DETAILS</th>
                  <th className="py-4 px-6">ACCOUNT STATUS</th>
                  <th className="py-4 px-6 sm:px-8 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/90 text-sm font-sans">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50/50 transition-colors duration-150 group"
                  >
                    
                    {/* USER INFO COLUMN */}
                    <td className="py-4 px-6 sm:px-8">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-full ${user.avatarColor} font-black text-sm flex items-center justify-center shrink-0 shadow-2xs border-2 border-white select-none`}>
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1a2b3c] text-[15px] leading-snug group-hover:text-[#047262] transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs font-bold text-gray-400">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE COLUMN */}
                    <td className="py-4 px-6">
                      {user.role === 'ADMIN' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-amber-100/90 text-amber-800 font-extrabold text-xs uppercase tracking-wider shadow-2xs">
                          ADMIN
                        </span>
                      )}
                      {user.role === 'BUYER' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-blue-100/90 text-blue-700 font-extrabold text-xs uppercase tracking-wider shadow-2xs">
                          BUYER
                        </span>
                      )}
                      {user.role === 'SELLER' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-[#e0f5f0]/90 text-[#047262] font-extrabold text-xs uppercase tracking-wider shadow-2xs">
                          SELLER
                        </span>
                      )}
                    </td>

                    {/* CONTACT DETAILS COLUMN */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Mail size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[220px]" title={user.email}>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                            <Phone size={14} className="text-gray-400 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ACCOUNT STATUS COLUMN */}
                    <td className="py-4 px-6">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600">
                          <Unlock size={14} className="text-emerald-500 shrink-0" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black text-rose-600 bg-rose-50 border border-rose-200/60">
                          <Lock size={14} className="text-rose-500 shrink-0" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="py-4 px-6 sm:px-8 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {/* Lock / Unlock Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.id, user.name, user.status)}
                          className={`p-2.5 rounded-xl transition-all shadow-2xs active:scale-90 ${
                            user.status === 'Active'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-500'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                          }`}
                          title={user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>

                        {/* Delete User Button */}
                        <button
                          type="button"
                          onClick={() => deleteUser(user.id, user.name)}
                          className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-all shadow-2xs active:scale-90"
                          title="Permanently Delete User Account"
                          disabled={user.role === 'ADMIN' && user.id === 'EDDE5155'} // protect main admin account from accidental deletion
                        >
                          <Trash2 size={16} />
                        </button>
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
