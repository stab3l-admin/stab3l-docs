"use client";

import React, { useState, useEffect, Children } from "react";

interface Tab {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs?: Tab[];
  defaultTab?: number;
  children?: React.ReactNode;
}

/**
 * Tabs component for GitBook-like tabs functionality
 * Allows switching between different content tabs
 * Can be used in two ways:
 * 1. With tabs prop: <Tabs tabs={[{title: "Tab 1", content: <div>Content 1</div>}]} />
 * 2. With children (for Markdown): <Tabs><div data-title="Tab 1">Content 1</div></Tabs>
 */
export function Tabs({ tabs, defaultTab = 0, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [processedTabs, setProcessedTabs] = useState<Tab[]>([]);

  // Process children if provided (for Markdown content)
  useEffect(() => {
    if (children) {
      const childrenArray = Children.toArray(children);
      const extractedTabs: Tab[] = [];

      childrenArray.forEach((child: any) => {
        if (child.props && child.props['data-title']) {
          extractedTabs.push({
            title: child.props['data-title'],
            content: child
          });
        }
      });

      setProcessedTabs(extractedTabs);
    } else if (tabs) {
      setProcessedTabs(tabs);
    }
  }, [children, tabs]);

  // Handle tab click
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // If no tabs, return null
  if (processedTabs.length === 0) {
    return null;
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        {processedTabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {processedTabs[activeTab]?.content}
      </div>
    </div>
  );
} 