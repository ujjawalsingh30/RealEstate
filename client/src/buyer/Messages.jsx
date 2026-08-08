import React from 'react';
import { MessageSquare, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Messages = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-10 px-6 md:px-12 transition-colors duration-300 font-sans antialiased text-left">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header & Theme Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-800 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e0f5f0] text-[#047262] font-black text-xs uppercase mb-2">
              <Sparkles size={13} />
              <span>Direct Property Consultations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1a2b3c] dark:text-white tracking-tight">
              My Messages & Inquiries
            </h1>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle Display Theme"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#162231] hover:bg-gray-100 dark:hover:bg-[#1e2f45] text-gray-700 dark:text-amber-400 border border-gray-200 dark:border-gray-700 font-bold text-sm flex items-center gap-2 transition-all shadow-xs"
          >
            {theme === 'dark' ? <Sun size={18} className="animate-spin-slow text-amber-400" /> : <Moon size={18} />}
            <span className="text-xs">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        {/* Empty State Banner */}
        <div className="bg-white dark:bg-[#162231] rounded-[32px] p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-[#e0f5f0]/80 dark:bg-[#0dc5a5]/15 text-[#047262] dark:text-[#0dc5a5] flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={30} />
          </div>
          <h2 className="text-2xl font-black text-[#1a2b3c] dark:text-white mb-2">No active conversations</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
            When you contact property sellers or agents regarding luxury apartments or villas, your inquiry messages and replies will appear right here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
