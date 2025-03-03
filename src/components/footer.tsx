/**
 * Footer component for the documentation site
 * Supports both dark and light modes
 */
export function Footer() {
  return (
    <footer className="py-4 border-t border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-xs">
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