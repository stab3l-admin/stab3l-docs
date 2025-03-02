"use client";

import React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

type HintType = "info" | "warning" | "danger" | "success";

interface HintProps {
  type: HintType;
  children: React.ReactNode;
}

/**
 * Hint component for GitBook-like hint/callout blocks
 * Displays information with different styling based on the type
 */
export function Hint({ type, children }: HintProps) {
  // Icon mapping based on hint type
  const iconMap = {
    info: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
    danger: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
    success: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
  };

  return (
    <div className={`hint hint-${type} flex gap-3`}>
      <div className="flex-shrink-0 mt-1">{iconMap[type]}</div>
      <div>{children}</div>
    </div>
  );
} 