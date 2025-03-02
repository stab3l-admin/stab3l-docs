import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getDocBySlug, getAllDocs } from "@/lib/docs";

interface DocPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all documentation pages
 */
export function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

/**
 * Generate metadata for the page
 */
export function generateMetadata({ params }: DocPageProps) {
  const doc = getDocBySlug(params.slug);
  
  if (!doc) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }
  
  return {
    title: `${doc.title} | TerminalDocs`,
    description: doc.description || "Documentation page",
  };
}

/**
 * Documentation page component
 * Displays the content of a markdown file
 */
export default function DocPage({ params }: DocPageProps) {
  const doc = getDocBySlug(params.slug);
  
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
    </article>
  );
} 