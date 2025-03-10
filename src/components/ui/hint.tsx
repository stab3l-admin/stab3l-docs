"use client";

import React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

type HintType = "info" | "warning" | "danger" | "success";

interface HintProps {
  type?: HintType;
  className?: string;
  children: React.ReactNode;
}

/**
 * Hint component for GitBook-like hint/callout blocks
 * Displays information with different styling based on the type
 * Can be used in two ways:
 * 1. With type prop: <Hint type="info">Content</Hint>
 * 2. With className (for Markdown): <div className="hint hint-info">Content</div>
 */
export function Hint({ type, className, children }: HintProps) {
  // Determine the hint type from className if type is not provided
  let hintType = type;
  if (!hintType && className) {
    if (className.includes('hint-info')) hintType = 'info';
    else if (className.includes('hint-warning')) hintType = 'warning';
    else if (className.includes('hint-danger')) hintType = 'danger';
    else if (className.includes('hint-success')) hintType = 'success';
    else hintType = 'info'; // Default to info
  }

  // Icon mapping based on hint type
  const iconMap = {
    info: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
    danger: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
    success: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
  };

  return (
    <div className={`hint hint-${hintType || 'info'} flex gap-3`}>
      <div className="flex-shrink-0 mt-1">{iconMap[hintType || 'info']}</div>
      <div>{children}</div>
    </div>
  );
} 