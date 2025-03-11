"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { DocsToolbar } from "@/components/docs-toolbar";
import { DocMeta } from "@/lib/docs";
import { usePathname } from "next/navigation";

interface DocsLayoutClientProps {
  children: React.ReactNode;
  docs: DocMeta[];
  categories: string[];
}

/**
 * Client component for documentation pages layout
 * Handles interactive elements like mobile sidebar toggle
 */
export function DocsLayoutClient({ children, docs, categories }: DocsLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the sidebar and the menu button
      const target = event.target as HTMLElement;
      if (
        isMobileMenuOpen && 
        !target.closest('.mobile-sidebar') && 
        !target.closest('.mobile-menu-button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header docs={docs} toggleMobileSidebar={toggleMobileSidebar} />
      <div className="w-full border-t border-black dark:border-white"></div>
      <div className="flex flex-1 overflow-hidden pb-12">
        {/* Sidebar component - handles both mobile and desktop views */}
        <div className="hidden md:block w-64 h-[calc(100vh-57px-48px)] overflow-hidden">
          <Sidebar 
            docs={docs} 
            categories={categories} 
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </div>
        
        {/* Mobile sidebar is rendered by the Sidebar component */}
        <div className="md:hidden mobile-sidebar">
          <Sidebar 
            docs={docs} 
            categories={categories} 
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </div>
        
        {/* Vertical line that extends full height - desktop only */}
        <div className="hidden md:block w-px bg-black dark:bg-white h-[calc(100vh-57px-48px)]"></div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-black h-[calc(100vh-57px-48px)] overflow-hidden">
          {/* Docs toolbar with font size control */}
          <DocsToolbar />
          
          {/* Main content - scrollable */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-4xl">{children}</div>
          </main>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-black dark:border-white">
        <Footer />
      </div>
    </div>
  );
} 