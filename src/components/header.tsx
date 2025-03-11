"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { DocMeta } from "@/lib/docs";
import { SearchResult, searchDocs } from "@/lib/client-search";

interface HeaderProps {
  docs: DocMeta[];
  toggleMobileSidebar?: () => void;
}

/**
 * Header component with search functionality and theme toggle
 */
export function Header({ docs, toggleMobileSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [docsContent, setDocsContent] = useState<Map<string, string>>(new Map());
  const [contentLoaded, setContentLoaded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load document content for search
  useEffect(() => {
    async function loadDocContent() {
      const contentMap = new Map<string, string>();
      
      // Only load content for the first 20 docs to avoid excessive requests
      const docsToLoad = docs.slice(0, 20);
      
      for (const doc of docsToLoad) {
        try {
          const response = await fetch(`/api/doc-content?slug=${doc.slug}`);
          if (response.ok) {
            const data = await response.json();
            if (data.content) {
              contentMap.set(doc.slug, data.content);
            }
          }
        } catch (error) {
          console.error(`Error loading content for ${doc.slug}:`, error);
        }
      }
      
      setDocsContent(contentMap);
      setContentLoaded(true);
    }
    
    loadDocContent();
  }, [docs]);

  // Handle clicks outside of search results to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search to avoid too many searches while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        // Use the client-side search function with content
        const results = searchDocs(searchQuery, docs, docsContent);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching docs:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, docs, docsContent]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the input when opening search
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      clearSearch();
    }
  };

  // Get badge color based on match type
  const getMatchTypeBadge = (matchType: string) => {
    switch (matchType) {
      case 'title':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'description':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'category':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'content':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      case 'partial':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center justify-between h-12 px-4">
        {/* Left: Mobile Menu Button + Logo */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          {toggleMobileSidebar && (
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden flex items-center justify-center mr-3 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              aria-label="Toggle mobile menu"
            >
              <Menu size={18} />
            </button>
          )}
          
          {/* Logo */}
          <Link href="/" className="text-sm font-bold text-black dark:text-white">
            TerminalDocs
          </Link>
        </div>
        
        {/* Center: Search */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-40 md:w-64 lg:w-80" ref={searchRef}>
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder={contentLoaded ? "Search docs..." : "Loading content..."}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-8 px-2 text-xs border border-black dark:border-white bg-white text-black dark:bg-black dark:text-white"
                disabled={!contentLoaded}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-2 text-black dark:text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {isSearching && (
              <div className="absolute left-0 right-0 mt-1 w-full p-4 bg-white dark:bg-black border border-black dark:border-white z-20 text-center">
                <span className="text-xs">Searching...</span>
              </div>
            )}
            {!isSearching && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 w-full max-h-96 overflow-y-auto bg-white dark:bg-black border border-black dark:border-white z-20">
                {searchResults.map((result) => (
                  <Link
                    key={result.slug}
                    href={`/docs/${result.slug}`}
                    onClick={clearSearch}
                    className="block px-4 py-2 text-xs text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-black dark:border-white last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold">{result.title}</div>
                      <div className={`text-[10px] px-1.5 py-0.5 rounded-full ${getMatchTypeBadge(result.matchType)}`}>
                        {result.matchType}
                      </div>
                    </div>
                    {result.category && (
                      <div className="mt-1 text-[10px] opacity-70">
                        Category: {result.category}
                      </div>
                    )}
                    {result.excerpt && (
                      <div 
                        className="mt-1 text-xs opacity-80 bg-gray-50 dark:bg-gray-900 p-1 rounded" 
                        dangerouslySetInnerHTML={{ 
                          __html: result.excerpt.replace(
                            /\*\*(.*?)\*\*/g, 
                            '<span class="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white px-0.5 rounded">$1</span>'
                          ) 
                        }} 
                      />
                    )}
                    {result.contentPreview && result.contentPreview !== result.excerpt && (
                      <div 
                        className="mt-1 text-xs opacity-80 bg-gray-50 dark:bg-gray-900 p-1 rounded border-l-2 border-blue-500" 
                        dangerouslySetInnerHTML={{ 
                          __html: result.contentPreview.replace(
                            /\*\*(.*?)\*\*/g, 
                            '<span class="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white px-0.5 rounded">$1</span>'
                          ) 
                        }} 
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}
            {!isSearching && searchQuery && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 mt-1 w-full p-4 bg-white dark:bg-black border border-black dark:border-white z-20 text-center">
                <span className="text-xs">No results found. Try different keywords or check spelling.</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Right: Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 