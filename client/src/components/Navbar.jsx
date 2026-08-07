import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import logo from '../assets/logo.png'
import { usePropertyContext } from '../context/PropertyContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = usePropertyContext();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 md:py-6 bg-white/60 dark:bg-[#0f1926]/80 backdrop-blur-md border-b border-gray-200/40 dark:border-gray-800 shadow-xs transition-all duration-300">
        <div className="flex items-center justify-between max-w-[1500px] mx-auto relative">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer z-10">
            <img src={logo} alt="RealEstate Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <span className="text-[#047262] dark:text-[#0dc5a5] font-black text-xl md:text-2xl tracking-tight">RealEstate</span>
          </Link>

          {/* Desktop Navigation Links (Centered Pill Container) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-gray-100/90 dark:bg-[#18273a] backdrop-blur-md px-8 py-2.5 rounded-full items-center gap-8 shadow-xs border border-gray-200/60 dark:border-[#28394e] z-10 transition-all">
            <Link 
              to="/" 
              className="text-[#1a2b3c] dark:text-gray-200 font-bold text-sm hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className="text-[#1a2b3c] dark:text-gray-200 font-bold text-sm hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              to="/login" 
              className="text-[#1a2b3c] dark:text-gray-200 font-bold text-sm hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-[#1a2b3c] dark:text-gray-200 font-bold text-sm hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Right Corner: Theme Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-3 z-10">
            {/* Theme Toggling Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-[#1b2b3f] text-[#1a2b3c] dark:text-amber-400 border border-gray-200/70 dark:border-gray-700/60 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all duration-200"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={19} className="animate-spin-slow" /> : <Moon size={19} />}
            </button>

            <button 
              onClick={() => setIsOpen(true)} 
              className="md:hidden text-[#1a2b3c] dark:text-gray-200 focus:outline-none p-1"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Side Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[290px] bg-white dark:bg-[#131f2f] z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
            <span className="text-[#047262] dark:text-[#0dc5a5] font-bold text-xl tracking-tight">RealEstate</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white focus:outline-none transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="flex flex-col p-6 gap-5">
          <Link 
            to="/properties" 
            onClick={() => setIsOpen(false)}
            className="text-[#1a2b3c] dark:text-gray-200 font-bold text-base hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
          >
            Browse Properties
          </Link>
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="text-[#1a2b3c] dark:text-gray-200 font-bold text-base hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            onClick={() => setIsOpen(false)}
            className="text-[#1a2b3c] dark:text-gray-200 font-bold text-base hover:text-[#047262] dark:hover:text-[#0dc5a5] transition-colors"
          >
            Register
          </Link>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Appearance</span>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#1a2b3f] text-[#1a2b3c] dark:text-amber-400 font-bold text-xs flex items-center gap-2 shadow-2xs border border-gray-200 dark:border-gray-700"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;
