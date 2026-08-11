import React from 'react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-transparent">
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-[#047262] border-r-[#047262] rounded-full animate-spin"></div>
        
        {/* Inner reverse spinning ring */}
        <div className="absolute inset-2 border-4 border-transparent border-b-[#0dc5a5] border-l-[#0dc5a5] rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Center pulsing dot */}
        <div className="w-4 h-4 bg-[#047262] rounded-full animate-pulse shadow-[0_0_15px_rgba(4,114,98,0.6)]"></div>
      </div>
      
      {/* Loading text with animated ellipsis */}
      <h3 className="text-[#1a2b3c] dark:text-gray-200 font-extrabold tracking-widest text-sm sm:text-base uppercase">
        {text}
        <span className="inline-block w-6 text-left animate-pulse">...</span>
      </h3>
    </div>
  );
};

export default Loader;
