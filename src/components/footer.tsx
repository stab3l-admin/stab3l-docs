/**
 * Footer component for the documentation site
 * Supports both dark and light modes
 * Fixed at the bottom of the page
 */
export function Footer() {
  return (
    <footer className="bg-white dark:bg-black w-full z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center text-xs">
        <div>
          <p>&copy; {new Date().getFullYear()} TerminalDocs</p>
        </div>
        <div>
          <a 
            href="https://github.com/stab3l/terminaldocs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <span className="mx-2">•</span>
          <a 
            href="/docs" 
            className="hover:underline"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
} 