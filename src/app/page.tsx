import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Home page component
 * Landing page for the documentation site
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-mono">
      {/* Header */}
      <header className="border-b border-theme">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            TerminalDocs
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="my-12 md:my-16">
            <h1 className="text-2xl font-bold mb-4">
              TerminalDocs
            </h1>
            <p className="text-sm mb-6">
              A minimal, terminal-style documentation site.
            </p>
            <pre className="border border-theme p-4 mb-6 overflow-x-auto text-xs">
              <code>{`$ npm install terminaldocs
$ npx terminaldocs init
$ npx terminaldocs dev`}</code>
            </pre>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/docs"
                className="px-3 py-1 border border-theme hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs"
              >
                BROWSE DOCS
              </Link>
              <Link
                href="/docs/getting-started"
                className="px-3 py-1 border border-theme hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs"
              >
                GET STARTED
              </Link>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-lg font-bold mb-4">Features</h2>
            <ul className="list-disc ml-5 text-sm space-y-2">
              <li>Markdown support with code syntax highlighting</li>
              <li>Search functionality</li>
              <li>Dark mode</li>
              <li>Responsive design</li>
              <li>Simple and minimal interface</li>
              <li>Fast and lightweight</li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-lg font-bold mb-4">Commands</h2>
            <div className="text-xs font-mono">
              <pre className="border border-theme p-4 overflow-x-auto">
                <code>{`$ npx terminaldocs --help
Usage: terminaldocs [command] [options]

Commands:
  init      Initialize a new documentation site
  dev       Start the development server
  build     Build for production
  start     Start the production server
  export    Export as static HTML

Options:
  --help     Show help
  --version  Show version number`}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-theme">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} TerminalDocs
          </p>
        </div>
      </footer>
    </div>
  );
} 