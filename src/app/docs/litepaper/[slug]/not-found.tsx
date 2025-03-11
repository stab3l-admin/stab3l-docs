import Link from "next/link";

/**
 * Not found page for litepaper documentation
 * Displayed when a litepaper document is not found
 */
export default function LitepaperNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-6">Litepaper Not Found</h1>
      <p className="text-lg mb-8">
        The litepaper document you're looking for doesn't exist.
      </p>
      <Link
        href="/docs"
        className="px-4 py-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      >
        Back to Documentation
      </Link>
    </div>
  );
} 