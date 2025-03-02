import Link from "next/link";

/**
 * Not found page for documentation
 * Displayed when a document is not found
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Document Not Found</h1>
      <p className="text-lg mb-8">
        The document you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/docs"
        className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white transition-colors"
      >
        Back to Documentation
      </Link>
    </div>
  );
} 