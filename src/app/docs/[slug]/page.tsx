import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getDocBySlug, getAllDocs } from "@/lib/docs";

interface DocPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all documentation pages (excluding whitepaper)
 */
export async function generateStaticParams() {
  const docs = await getAllDocs();
  // Filter out whitepaper documents
  return docs
    .filter(doc => !doc.slug.startsWith('whitepaper/'))
    .map((doc) => ({
      slug: doc.slug,
    }));
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: DocPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  
  // Skip if this is a whitepaper document
  if (resolvedParams.slug.startsWith('whitepaper/')) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }
  
  const doc = await getDocBySlug(resolvedParams.slug);
  
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
export default async function DocPage({ params }: DocPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  
  // Skip if this is a whitepaper document
  if (resolvedParams.slug.startsWith('whitepaper/')) {
    notFound();
  }
  
  const doc = await getDocBySlug(resolvedParams.slug);
  
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