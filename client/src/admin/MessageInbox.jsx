import React, { useState, useMemo } from 'react';
import { 
  Inbox, Mail, Phone, Clock, Send, CheckCircle2, AlertCircle, 
  Trash2, Search, Filter, Shield, User, CornerDownRight, MessageSquare, Check, Sparkles, X
} from 'lucide-react';
import { usePropertyContext } from '../context/PropertyContext';

const MessageInbox = () => {
  const { adminMessages = [], setAdminMessages, showToast } = usePropertyContext();

  // Selected Message and Filter States
  const [selectedMsgId, setSelectedMsgId] = useState(adminMessages.length > 0 ? adminMessages[0].id : null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  // Filter computation
  const filteredMessages = useMemo(() => {
    return adminMessages.filter((msg) => {
      const matchesSearch = 
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = 
        activeTab === 'ALL' ||
        (activeTab === 'SELLER' && msg.senderRole === 'SELLER') ||
        (activeTab === 'BUYER' && msg.senderRole === 'BUYER') ||
        (activeTab === 'UNREAD' && msg.unread);

      return matchesSearch && matchesTab;
    });
  }, [adminMessages, searchQuery, activeTab]);

  // Derive current selected message object
  const activeMsg = useMemo(() => {
    return adminMessages.find((m) => m.id === selectedMsgId) || filteredMessages[0] || null;
  }, [adminMessages, selectedMsgId, filteredMessages]);

  // Handle Select & Automatically Mark Read
  const handleSelectMessage = (id) => {
    setSelectedMsgId(id);
    setReplyText('');
    setAdminMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
    );
  };

  // Toggle Read/Unread
  const toggleUnread = (id, currentUnread, e) => {
    if (e) e.stopPropagation();
    setAdminMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: !currentUnread } : m))
    );
    if (showToast) showToast(`Marked ticket as ${!currentUnread ? 'Unread' : 'Read'}.`, 'info');
  };

  // Toggle Resolved
  const toggleResolved = (id, currentResolved) => {
    setAdminMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, resolved: !currentResolved, unread: false } : m))
    );
    if (showToast) {
      showToast(
        !currentResolved ? 'Ticket marked as Resolved & closed!' : 'Ticket reopened for active assistance.',
        !currentResolved ? 'success' : 'info'
      );
    }
  };

  // Delete Message
  const handleDeleteMessage = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Permanently remove this support contact message from Admin HQ?')) {
      const nextList = adminMessages.filter((m) => m.id !== id);
      setAdminMessages(nextList);
      if (selectedMsgId === id && nextList.length > 0) {
        setSelectedMsgId(nextList[0].id);
      }
      if (showToast) showToast('Support contact ticket removed.', 'info');
    }
  };

  // Send Reply
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMsg) {
      if (showToast) showToast('Please enter an official reply message.', 'error');
      return;
    }
    setAdminMessages((prev) =>
      prev.map((m) => (m.id === activeMsg.id ? { ...m, resolved: true, unread: false } : m))
    );
    if (showToast) {
      showToast(`Official resolution reply transmitted to ${activeMsg.senderName}! Ticket closed.`, 'success');
    }
    setReplyText('');
  };

  const unreadCount = adminMessages.filter((m) => m.unread).length;
  const sellerCount = adminMessages.filter((m) => m.senderRole === 'SELLER').length;
  const buyerCount = adminMessages.filter((m) => m.senderRole === 'BUYER').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1650px] mx-auto text-left font-sans antialiased bg-gray-50 min-h-screen">
      
      {/* =====================================================================
          HEADER SECTION
          ===================================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2b3c] tracking-tight flex items-center gap-3">
            <span>Admin HQ Contact Inbox</span>
            {unreadCount > 0 && (
              <span className="bg-[#047262] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base mt-1.5">
            Real-time reception of support inquiries, quota expansion queries, and general guidance messages from platform sellers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-auto relative shrink-0">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets, names, or emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-[#1a2b3c] focus:outline-none focus:border-[#047262] shadow-xs transition-all"
          />
        </div>
      </div>

      {/* =====================================================================
          FILTER TABS PILLS
          ===================================================================== */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {[
          { key: 'ALL', label: 'All Inquiries', count: adminMessages.length },
          { key: 'SELLER', label: 'Seller Support Tickets', count: sellerCount },
          { key: 'BUYER', label: 'Buyer & Concierge', count: buyerCount },
          { key: 'UNREAD', label: 'Unread Only', count: unreadCount },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-2xs ${
                isActive
                  ? 'bg-[#1a2b3c] text-white border-[#1a2b3c] shadow-md'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TWO-PANE INBOX WORKSPACE
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* -------------------------------------------------------------------
            LEFT PANE: SCROLLABLE MESSAGE LIST (5 Columns on Desktop)
           ------------------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-3 lg:max-h-[750px] lg:overflow-y-auto pr-1">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-[28px] p-10 text-center border border-gray-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Inbox size={26} />
              </div>
              <h3 className="font-bold text-[#1a2b3c] text-base mb-1">No Support Tickets Found</h3>
              <p className="text-xs text-gray-400">There are currently no messages matching your tab filter or search query.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = activeMsg && activeMsg.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`p-5 rounded-[26px] border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-white border-[#047262] shadow-[0_8px_30px_rgba(4,114,98,0.12)] scale-[1.01]'
                      : 'bg-white/80 hover:bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-gray-200'
                  }`}
                >
                  {/* Top Row: Sender Info & Role Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${msg.unread ? 'bg-[#047262] animate-pulse' : 'bg-gray-200'}`} title={msg.unread ? 'Unread Message' : 'Read'} />
                      <h4 className="font-black text-sm text-[#1a2b3c] truncate group-hover:text-[#047262] transition-colors">
                        {msg.senderName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {msg.senderRole === 'SELLER' && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#e0f5f0] text-[#047262] font-black text-[10px] uppercase tracking-wider">
                          SELLER
                        </span>
                      )}
                      {msg.senderRole === 'BUYER' && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-wider">
                          BUYER
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-gray-400">{msg.date}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <p className={`text-xs font-extrabold truncate mb-1.5 ${msg.unread ? 'text-[#1a2b3c]' : 'text-gray-600'}`}>
                    {msg.subject}
                  </p>

                  {/* Body Snippet */}
                  <p className="text-xs font-medium text-gray-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  {/* Bottom Ticket ID & Status tag */}
                  <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-gray-400">{msg.id}</span>
                    <div className="flex items-center gap-2">
                      {msg.resolved ? (
                        <span className="text-emerald-600 font-black inline-flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Resolved</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 font-black inline-flex items-center gap-1">
                          <Clock size={13} />
                          <span>Open Ticket</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteMessage(msg.id, e)}
                        className="p-1 text-gray-300 hover:text-rose-500 transition-colors ml-1"
                        title="Delete ticket"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* -------------------------------------------------------------------
            RIGHT PANE: ACTIVE TICKET READER & RESOLUTION (7 Columns)
           ------------------------------------------------------------------- */}
        <div className="lg:col-span-7">
          {!activeMsg ? (
            <div className="bg-white rounded-[36px] p-16 border border-gray-100 text-center shadow-sm">
              <MessageSquare size={36} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-black text-[#1a2b3c] text-lg mb-1">Select a Support Ticket</h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto">
                Choose any incoming communication card from the left pane to examine details, download attachments, and transmit an official response.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[36px] border border-gray-100 shadow-[0_8px_45px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
              
              {/* Reader Header */}
              <div className="p-6 sm:p-8 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1a2b3c] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                    {activeMsg.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg sm:text-xl font-black text-[#1a2b3c]">
                        {activeMsg.senderName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-md bg-gray-200/80 text-gray-700 font-extrabold text-xs">
                        {activeMsg.id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                      <span className="inline-flex items-center gap-1 text-[#047262]">
                        <Mail size={13} />
                        <span>{activeMsg.email}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone size={13} />
                        <span>{activeMsg.phone}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reader Action Toolbar */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => toggleResolved(activeMsg.id, activeMsg.resolved)}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-2xs ${
                      activeMsg.resolved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    }`}
                  >
                    <CheckCircle2 size={15} className={activeMsg.resolved ? 'text-emerald-600' : 'text-amber-700'} />
                    <span>{activeMsg.resolved ? 'Resolved ✔' : 'Mark Resolved'}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMessage(activeMsg.id, e)}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Subject & Main Body Content */}
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                <div className="pb-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Subject / Support Inquiry Title</span>
                    <h3 className="text-base sm:text-lg font-black text-[#1a2b3c] leading-snug">
                      {activeMsg.subject}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-400 shrink-0 bg-gray-50 px-3 py-1 rounded-lg">
                    Received {activeMsg.date}
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-3">Message Content</span>
                  <div className="p-6 rounded-[24px] bg-gray-50/80 border border-gray-100 font-medium text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {activeMsg.message}
                  </div>
                </div>

                {/* Live Official Admin Response Form */}
                <div className="pt-4 border-t border-gray-100">
                  <form onSubmit={handleSendReply} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-[#047262] flex items-center gap-1.5">
                        <Sparkles size={14} className="fill-[#047262]" />
                        <span>Transmit Official Resolution Reply to {activeMsg.senderName}</span>
                      </label>
                      {activeMsg.resolved && (
                        <span className="text-xs font-bold text-emerald-600">This ticket is already resolved.</span>
                      )}
                    </div>

                    <textarea
                      rows="3"
                      placeholder="e.g. Hello Suresh, our auditing team has completed your license verification and expanded your property showcase quota to 50 active towers..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-[20px] font-medium text-sm text-[#1a2b3c] focus:outline-none focus:border-[#047262] transition-all shadow-xs leading-relaxed"
                    />

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-gray-400 font-semibold">
                        Replying will transmit an automated email to <span className="font-bold text-gray-600">{activeMsg.email}</span> and set ticket status to Resolved.
                      </p>
                      <button
                        type="submit"
                        className="px-7 py-3 bg-[#047262] hover:bg-[#03594d] active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#047262]/25 transition-all flex items-center gap-2 shrink-0"
                      >
                        <Send size={16} />
                        <span>Send Reply & Close</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default MessageInbox;
