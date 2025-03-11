"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocMeta } from "@/lib/docs";

interface SidebarProps {
  docs: DocMeta[];
  categories: string[];
  isMobileMenuOpen?: boolean;
  toggleMobileSidebar?: () => void;
}

/**
 * Sidebar component for documentation navigation
 * Displays categories and documents in a collapsible tree structure
 */
export function Sidebar({ docs, categories, isMobileMenuOpen = false, toggleMobileSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    categories.reduce((acc, category) => {
      acc[category] = true; // All categories open by default
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  // Ensure all categories are included, even if they're added later
  useEffect(() => {
    setOpenCategories(prev => {
      const newState = {...prev};
      categories.forEach(category => {
        if (newState[category] === undefined) {
          newState[category] = true;
        }
      });
      return newState;
    });
  }, [categories]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleLinkClick = () => {
    if (toggleMobileSidebar && window.innerWidth < 768) {
      toggleMobileSidebar();
    }
  };

  const renderCategoryContent = (category: string) => {
    return (
      <div key={category} className="mb-4">
        <button
          onClick={() => toggleCategory(category)}
          className="flex items-center justify-between w-full text-left font-bold py-1 px-2 border-b border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          <span>{category.toUpperCase()}</span>
          <span>{openCategories[category] ? "-" : "+"}</span>
        </button>

        {openCategories[category] && (
          <ul className="mt-2 ml-2 space-y-1">
            {docs
              .filter((doc) => doc.category === category)
              .sort((a, b) => (a.order || 999) - (b.order || 999))
              .map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={doc.path}
                    onClick={handleLinkClick}
                    className={`block py-1 px-2 ${
                      pathname === doc.path
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  };

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:block h-full overflow-y-auto">
      <nav className="p-4 font-mono text-xs text-black dark:text-white">
        {categories.map(category => renderCategoryContent(category))}
      </nav>
    </div>
  );

  // Mobile sidebar
  const MobileSidebar = () => {
    if (!isMobileMenuOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-white dark:bg-black text-black dark:text-white z-30 md:hidden">
        <div className="h-full overflow-y-auto pt-16 pb-24 bg-white dark:bg-black">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 border border-black dark:border-white"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="px-4 py-2 text-black dark:text-white">
            {categories.map(category => renderCategoryContent(category))}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
} 