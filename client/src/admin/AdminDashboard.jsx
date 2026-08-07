import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building, ShieldCheck, TrendingUp, ArrowUpRight, 
  Clock, CheckCircle2, XCircle, AlertCircle, Sparkles, Shield, 
  Store, Home, MessageSquare, UserCheck
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';
import api from '../config/api';

const AdminDashboard = () => {
  const { properties = [], adminMessages = [], showToast } = usePropertyContext();
  const [dashboardStats, setDashboardStats] = useState({
    totalSellers: 0,
    totalBuyers: 0,
    verifiedSellers: 0,
    pendingSellers: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        
        if (response.data.success) {
          const { stats, recentRequests } = response.data;
          
          setDashboardStats({
            totalSellers: stats.totalSellers,
            totalBuyers: stats.totalBuyers,
            verifiedSellers: stats.verifiedSellers,
            pendingSellers: stats.pendingSellers
          });
          
          setRecentRequests(recentRequests);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Comprehensive 6-card platform analytics showcasing Total Sellers, Total Buyers, Verified Sellers, and inventory
  const stats = [
    { 
      title: 'Total Sellers', 
      count: dashboardStats.totalSellers.toString(), 
      change: 'Registered sellers', 
      icon: <Store size={24} />, 
      color: 'bg-emerald-50 text-[#047262] border-[#047262]/20', 
      badgeColor: 'bg-[#e0f5f0] text-[#047262]',
      link: '/admin/users' 
    },
    { 
      title: 'Total Buyers', 
      count: dashboardStats.totalBuyers.toString(), 
      change: 'Active property seekers', 
      icon: <Users size={24} />, 
      color: 'bg-blue-50 text-blue-600 border-blue-100', 
      badgeColor: 'bg-blue-100/70 text-blue-700',
      link: '/admin/users' 
    },
    { 
      title: 'Verified Sellers', 
      count: dashboardStats.verifiedSellers.toString(), 
      change: 'Approved accounts', 
      icon: <ShieldCheck size={24} />, 
      color: 'bg-amber-50 text-amber-600 border-amber-100', 
      badgeColor: 'bg-amber-100/80 text-amber-800',
      link: '/admin/users' 
    },
    { 
      title: 'Total Active Properties', 
      count: properties.length.toString(), 
      change: 'Live verified listing inventory', 
      icon: <Home size={24} />, 
      color: 'bg-purple-50 text-purple-600 border-purple-100', 
      badgeColor: 'bg-purple-100/70 text-purple-700',
      link: '/admin/properties' 
    },
    { 
      title: 'Pending Approvals', 
      count: dashboardStats.pendingSellers.toString(), 
      change: 'Action required', 
      icon: <AlertCircle size={24} />, 
      color: 'bg-rose-50 text-rose-600 border-rose-100', 
      badgeColor: 'bg-rose-100/70 text-rose-700',
      link: '/admin/users' 
    },
    { 
      title: 'Support Inbox Tickets', 
      count: adminMessages.length.toString(), 
      change: 'Real-time support', 
      icon: <MessageSquare size={24} />, 
      color: 'bg-cyan-50 text-cyan-700 border-cyan-100', 
      badgeColor: 'bg-cyan-100/70 text-cyan-800',
      link: '/admin/message-inbox' 
    }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1650px] mx-auto text-left font-sans antialiased bg-gray-50 dark:bg-[#0b131e] min-h-screen space-y-8 sm:space-y-10 transition-colors duration-300">
      
      {/* Header & Status Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-[#e0f5f0] dark:bg-[#047262]/20 text-[#047262] dark:text-[#0dc5a5] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#047262] dark:bg-[#0dc5a5] animate-ping" />
              <span>System Operational: Normal & Auditing Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight">
            Root Administrator Console
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base mt-1">
            Global diagnostic overview of registered sellers, active buyers, verified credentials, and platform inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/users"
            className="px-6 py-3.5 bg-[#047262] hover:bg-[#03594d] text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-[#047262]/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Users size={17} />
            <span>Manage Platform Users</span>
          </Link>
          <Link
            to="/admin/seller-requests"
            className="px-5 py-3.5 bg-white dark:bg-[#111c2a] hover:bg-gray-50 dark:hover:bg-[#1b2b3f] text-[#1a2b3c] dark:text-white rounded-2xl font-extrabold text-xs sm:text-sm border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-2 shadow-xs active:scale-95"
          >
            <ShieldCheck size={17} className="text-[#047262] dark:text-[#0dc5a5]" />
            <span>Review SLA Audits</span>
          </Link>
        </div>
      </div>

      {/* =====================================================================
          6 KEY ANALYTICS METRIC GRID (Sellers, Buyers, Verified, etc.)
          ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
        {stats.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="bg-white dark:bg-[#111c2a] p-6 sm:p-7 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-[0_6px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_45px_rgba(4,114,98,0.08)] hover:border-[#047262]/30 dark:hover:border-[#0dc5a5]/50 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl border ${item.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <span className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:bg-[#e0f5f0] dark:group-hover:bg-[#047262]/20 group-hover:text-[#047262] dark:group-hover:text-[#0dc5a5] transition-colors">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">{item.title}</p>
              <h3 className="text-3xl sm:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight mb-3">{item.count}</h3>
              <span className={`text-xs font-black px-3 py-1.5 rounded-xl inline-block ${item.badgeColor}`}>
                {item.change}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Seller & Audit Requests Card */}
      <div className="bg-white dark:bg-[#111c2a] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-[0_6px_40px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c] dark:text-white flex items-center gap-2.5">
              <span>Pending Audit & Seller Requests</span>
              <span className="px-3 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-black rounded-full uppercase">
                2 New Action Required
              </span>
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1">Review seller background credentials before authorizing higher property upload quotas.</p>
          </div>
          <Link to="/admin/users" className="text-xs sm:text-sm font-black text-[#047262] dark:text-[#0dc5a5] hover:underline shrink-0">
            View All Requests →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase bg-gray-50/60 dark:bg-gray-800/30">
                <th className="py-3.5 px-5">REQUEST ID</th>
                <th className="py-3.5 px-5">SELLER ENTITY</th>
                <th className="py-3.5 px-5">AUDIT TYPE</th>
                <th className="py-3.5 px-5">SUBMITTED ON</th>
                <th className="py-3.5 px-5 text-right">STATUS & ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm font-sans">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="py-4 px-5 font-bold text-gray-500 dark:text-gray-400">{req.id}</td>
                  <td className="py-4 px-5 font-extrabold text-[#1a2b3c] dark:text-white">{req.seller}</td>
                  <td className="py-4 px-5 font-bold text-gray-600 dark:text-gray-400">{req.type}</td>
                  <td className="py-4 px-5 text-xs font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-2">
                    <Clock size={13} />
                    <span>{req.date}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {req.status === 'Pending Review' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            showToast(`Navigate to Users Manager to approve ${req.seller}!`, 'info');
                          }}
                          className="px-3.5 py-1.5 bg-[#e0f5f0] hover:bg-[#047262] text-[#047262] hover:text-white font-black text-xs rounded-xl transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} />
                          <span>Review</span>
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-xs rounded-xl border border-emerald-200/50">
                        <CheckCircle2 size={13} />
                        <span>Approved</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
