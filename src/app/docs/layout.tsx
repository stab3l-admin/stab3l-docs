import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { DocsToolbar } from "@/components/docs-toolbar";
import { getAllDocs, getAllCategories } from "@/lib/docs";

/**
 * Layout component for documentation pages
 * Includes header and sidebar navigation
 */
export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = await getAllDocs();
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header docs={docs} />
      <div className="w-full border-t border-black dark:border-white"></div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed position */}
        <div className="hidden md:block sidebar h-[calc(100vh-57px-40px)] overflow-y-auto bg-white dark:bg-black">
          <Sidebar docs={docs} categories={categories} />
        </div>
        
        {/* Vertical line that extends full height */}
        <div className="hidden md:block w-px bg-black dark:bg-white h-[calc(100vh-57px-40px)]"></div>
        
        {/* Mobile sidebar */}
        <div className="md:hidden">
          <Sidebar docs={docs} categories={categories} />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-black h-[calc(100vh-57px-40px)]">
          {/* Docs toolbar with font size control */}
          <DocsToolbar />
          
          {/* Main content - scrollable */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-4xl">{children}</div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 