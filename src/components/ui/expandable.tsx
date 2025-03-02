"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Expandable component for GitBook-like expandable/collapsible sections
 * Allows toggling visibility of content sections
 */
export function Expandable({ title, children, defaultExpanded = false }: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable">
      <div className="expandable-header" onClick={toggleExpand}>
        <div className="font-medium">{title}</div>
        <div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>
      {isExpanded && <div className="expandable-content">{children}</div>}
    </div>
  );
} 