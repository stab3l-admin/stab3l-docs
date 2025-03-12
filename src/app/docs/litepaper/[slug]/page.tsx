import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getDocBySlug, getAllDocs } from "@/lib/docs";
import Script from "next/script";
import React from "react";

interface DocPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all litepaper documentation pages
 */
export async function generateStaticParams() {
  const docs = await getAllDocs();
  // Filter only litepaper documents and extract the actual slug (without 'litepaper/' prefix)
  return docs
    .filter(doc => doc.category === 'Litepaper')
    .map((doc) => ({
      slug: doc.slug.replace('litepaper/', ''),
    }));
}

/**
 * Generate metadata for the litepaper page
 */
export async function generateMetadata({ params }: DocPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  
  // Prepend 'litepaper/' to the slug to match our storage format
  const fullSlug = `litepaper/${resolvedParams.slug}`;
  const doc = await getDocBySlug(fullSlug);
  
  if (!doc) {
    return {
      title: "Not Found",
      description: "The litepaper page you're looking for doesn't exist.",
    };
  }
  
  return {
    title: `${doc.title} | STAB3L Litepaper`,
    description: doc.description || "STAB3L Litepaper documentation",
  };
}

/**
 * Litepaper documentation page component
 * Displays the content of a litepaper markdown file
 */
export default async function LitepaperDocPage({ params }: DocPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  
  // Prepend 'litepaper/' to the slug to match our storage format
  const fullSlug = `litepaper/${resolvedParams.slug}`;
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