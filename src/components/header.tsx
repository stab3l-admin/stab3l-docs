"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { DocMeta } from "@/lib/docs";

interface HeaderProps {
  docs: DocMeta[];
}

/**
 * Header component with search functionality and theme toggle
 */
export function Header({ docs }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DocMeta[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Simple search implementation
    const results = docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        (doc.description &&
          doc.description.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center">
          <Link href="/" className="text-sm font-bold mr-4 text-black dark:text-white">
            TerminalDocs
          </Link>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-40 md:w-64 h-8 px-2 text-xs border border-black dark:border-white bg-white text-black dark:bg-black dark:text-white"
          />
          {searchResults.length > 0 && (
            <div className="absolute right-0 mt-1 w-64 max-h-96 overflow-y-auto bg-white dark:bg-black border border-black dark:border-white z-20">
              {searchResults.map((result) => (
                <Link
                  key={result.slug}
                  href={`/docs/${result.slug}`}
                  onClick={clearSearch}
                  className="block px-4 py-2 text-xs text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black dark:border-white last:border-b-0"
                >
                  {result.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
} 