import React from "react";
import { DocsLayoutClient } from "@/components/docs-layout-client";
import { getAllDocs, getAllCategories } from "@/lib/docs";

// Metadata for the page
export const metadata = {
  title: "Documentation - TerminalDocs",
  description: "Documentation for TerminalDocs",
};

/**
 * Server component for documentation pages layout
 * Fetches data and passes it to the client component
 */
export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = await getAllDocs();
  const categories = await getAllCategories();

  return (
    <DocsLayoutClient docs={docs} categories={categories}>
      {children}
    </DocsLayoutClient>
  );
} 