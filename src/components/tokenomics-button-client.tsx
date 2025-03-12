"use client";

import { useEffect } from 'react';

export function TokenomicsButtonClient() {
  const handleOpenPlayground = () => {
    // Dispatch a custom event to open the playground
    document.dispatchEvent(new CustomEvent('openTokenomicsPlayground'));
  };

  return (
    <div className="mt-8 mb-8 flex justify-center">
      <button 
        onClick={handleOpenPlayground}
        className="bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 text-white dark:text-black font-mono font-medium py-3 px-6 rounded-none border border-black dark:border-white transition-all duration-200"
      >
        Launch Tokenomics Playground
      </button>
    </div>
  );
} 