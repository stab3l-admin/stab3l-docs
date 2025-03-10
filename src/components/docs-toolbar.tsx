"use client";

import React from 'react';
import { FontSizeControl } from './font-size-control';

/**
 * Toolbar component for documentation pages
 * Contains controls for adjusting the reading experience
 */
export function DocsToolbar() {
  return (
    <div className="flex items-center justify-end py-2 px-4 border-b border-black dark:border-white bg-white dark:bg-black">
      <FontSizeControl />
    </div>
  );
} 