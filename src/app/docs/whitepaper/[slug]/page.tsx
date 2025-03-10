import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getDocBySlug, getAllDocs } from "@/lib/docs";
import Script from "next/script";
import React from "react";

interface DocPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all whitepaper documentation pages
 */
export async function generateStaticParams() {
  const docs = await getAllDocs();
  // Filter only whitepaper documents and extract the actual slug (without 'whitepaper/' prefix)
  return docs
    .filter(doc => doc.category === 'Whitepaper')
    .map((doc) => ({
      slug: doc.slug.replace('whitepaper/', ''),
    }));
}

/**
 * Generate metadata for the whitepaper page
 */
export async function generateMetadata({ params }: DocPageProps) {
  // Prepend 'whitepaper/' to the slug to match our storage format
  const fullSlug = `whitepaper/${params.slug}`;
  const doc = await getDocBySlug(fullSlug);
  
  if (!doc) {
    return {
      title: "Not Found",
      description: "The whitepaper page you're looking for doesn't exist.",
    };
  }
  
  return {
    title: `${doc.title} | STAB3L Whitepaper`,
    description: doc.description || "STAB3L Whitepaper documentation",
  };
}

/**
 * Whitepaper documentation page component
 * Displays the content of a whitepaper markdown file
 */
export default async function WhitepaperDocPage({ params }: DocPageProps) {
  // Prepend 'whitepaper/' to the slug to match our storage format
  const fullSlug = `whitepaper/${params.slug}`;
  const doc = await getDocBySlug(fullSlug);
  
  if (!doc) {
    notFound();
  }
  
  return (
    <article>
      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>
      {doc.description && (
        <p className="text-lg mb-8">
          {doc.description}
        </p>
      )}
      <MarkdownRenderer content={doc.content} />
      
      {/* Script to ensure MathJax is initialized for this page */}
      <Script
        id="mathjax-typeset"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && window.MathJax) {
              window.MathJax.typeset();
            }
          `,
        }}
      />
    </article>
  );
} 