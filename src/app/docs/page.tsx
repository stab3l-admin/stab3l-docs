import Link from "next/link";
import { getAllDocs, getAllCategories } from "@/lib/docs";
import { FileText } from "lucide-react";

/**
 * Documentation index page
 * Displays all available documentation organized by category
 */
export default async function DocsIndexPage() {
  const docs = await getAllDocs();
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      <p className="text-lg mb-8">
        Browse all available documentation for your project.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category}
            className="border border-black dark:border-white p-6"
          >
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <ul className="space-y-2">
              {docs
                .filter((doc) => doc.category === category)
                .map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      className="flex items-center py-2 px-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        {doc.description && (
                          <div className="text-sm">
                            {doc.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 