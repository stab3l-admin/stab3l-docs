"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { DocMeta } from "@/lib/docs";

interface SidebarProps {
  docs: DocMeta[];
  categories: string[];
}

/**
 * Sidebar component for documentation navigation
 * Displays categories and documents in a collapsible tree structure
 */
export function Sidebar({ docs, categories }: SidebarProps) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    categories.reduce((acc, category) => {
      acc[category] = true; // All categories open by default
      return acc;
    }, {} as Record<string, boolean>)
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const renderCategories = () => {
    return categories.map((category) => (
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
              .map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    className={`block py-1 px-2 ${
                      pathname === `/docs/${doc.slug}`
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
    ));
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-20 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        aria-label="Toggle mobile menu"
      >
        <Menu size={18} />
      </button>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-white dark:bg-black text-black dark:text-white z-10 md:hidden transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out`}
      >
        <div className="sidebar h-full overflow-y-auto pt-16 pb-24 bg-white dark:bg-black">
          <nav className="px-4 py-2 text-black dark:text-white">
            {renderCategories()}
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop - now just the content without the container */}
      <nav className="p-4 h-full overflow-y-auto font-mono text-xs text-black dark:text-white">
        {renderCategories()}
      </nav>
    </>
  );
} 