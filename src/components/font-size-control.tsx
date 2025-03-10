"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Type } from 'lucide-react';

/**
 * Font size control component
 * Allows users to adjust the font size of the main content
 */
export function FontSizeControl() {
  // Font size options (in pixels)
  const fontSizes = [12, 14, 16, 18, 20];
  const defaultSizeIndex = 0; // 12px as default
  
  // State to track current font size index
  const [sizeIndex, setSizeIndex] = useState(defaultSizeIndex);
  
  // Apply font size to docs-content
  useEffect(() => {
    const docsContent = document.documentElement;
    docsContent.style.setProperty('--docs-font-size', `${fontSizes[sizeIndex]}px`);
    
    // Save preference to localStorage
    localStorage.setItem('docs-font-size-index', sizeIndex.toString());
  }, [sizeIndex]);
  
  // Load saved preference on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('docs-font-size-index');
    if (savedIndex !== null) {
      setSizeIndex(parseInt(savedIndex));
    }
  }, []);
  
  // Decrease font size
  const decreaseSize = () => {
    setSizeIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  // Increase font size
  const increaseSize = () => {
    setSizeIndex((prev) => (prev < fontSizes.length - 1 ? prev + 1 : prev));
  };
  
  return (
    <div className="flex items-center space-x-2 text-black dark:text-white">
      <Type className="h-4 w-4" />
      <button
        onClick={decreaseSize}
        disabled={sizeIndex === 0}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
        aria-label="Decrease font size"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-xs">{fontSizes[sizeIndex]}px</span>
      <button
        onClick={increaseSize}
        disabled={sizeIndex === fontSizes.length - 1}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
        aria-label="Increase font size"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
} 