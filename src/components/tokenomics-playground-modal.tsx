"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TokenomicsPlayground from '@/components/ui/tokenomics-playground';

export default function TokenomicsPlaygroundModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleOpenPlayground = () => {
      setIsOpen(true);
      // Prevent scrolling when modal is open
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    };

    document.addEventListener('openTokenomicsPlayground', handleOpenPlayground);
    
    return () => {
      document.removeEventListener('openTokenomicsPlayground', handleOpenPlayground);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Re-enable scrolling when modal is closed
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  if (!mounted) return null;

  return (
    <>
      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[95vw] h-[95vh] bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-mono font-bold">STAB3L Tokenomics Playground</h2>
              <button 
                onClick={handleClose}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close tokenomics playground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <TokenomicsPlayground />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 