"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { Hint } from "@/components/ui/hint";
import { Card } from "@/components/ui/card";
import { Expandable } from "@/components/ui/expandable";
import { ChevronDown, ChevronUp } from "lucide-react";

// Add mermaid if it's available in the browser
let mermaid: any;
if (typeof window !== 'undefined') {
  import('mermaid').then((m) => {
    mermaid = m.default;
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
    });
  });
}

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown renderer component
 * Renders markdown content with syntax highlighting, GitHub Flavored Markdown support,
 * and custom components like diagrams, charts, and accordions
 * 
 * Special Syntax:
 * - For currency in math: Use \$ to indicate a currency symbol that should not be processed as math
 *   Example: $P_{CU} = \$0.06$ will render the first $ as math, but the second $ as currency
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Process custom content blocks before rendering markdown
  const processedContent = processCustomBlocks(content);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize mermaid diagrams and tabs after render
  useEffect(() => {
    if (mermaid) {
      mermaid.contentLoaded();
    }

    // Trigger MathJax typesetting for new content
    if (typeof window !== 'undefined' && (window as any).MathJax && contentRef.current) {
      try {
        // Target only the current container for typesetting
        // This is more efficient than reprocessing the entire document
        (window as any).MathJax.typeset([contentRef.current]);
      } catch (e) {
        console.error('Error typesetting MathJax:', e);
      }
    }

    // Initialize tabs after render
    if (contentRef.current) {
      const tabsContainers = contentRef.current.querySelectorAll('.tabs');
      
      tabsContainers.forEach((container, containerIndex) => {
        // Remove any existing tab headers to prevent duplication
        const existingHeaders = container.querySelectorAll('.tabs-header');
        existingHeaders.forEach(header => header.remove());
        
        // Create new tab header
        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'tabs-header';
        
        // Get all tabs in this container
        const tabs = container.querySelectorAll('.tab');
        
        // Create tab buttons
        tabs.forEach((tab, index) => {
          const title = tab.getAttribute('data-title') || `Tab ${index + 1}`;
          const button = document.createElement('button');
          button.className = `tab-button ${index === 0 ? 'active' : ''}`;
          button.textContent = title;
          button.onclick = () => {
            // Deactivate all tabs and buttons in this container
            tabs.forEach(t => t.classList.remove('active'));
            tabsHeader.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            
            // Activate this tab and button
            tabs[index].classList.add('active');
            button.classList.add('active');
          };
          
          tabsHeader.appendChild(button);
        });
        
        // Insert tab header at the beginning of the container
        container.insertBefore(tabsHeader, container.firstChild);
        
        // Activate first tab
        if (tabs.length > 0) {
          tabs.forEach(t => t.classList.remove('active'));
          tabs[0].classList.add('active');
        }
      });
    }
  }, [processedContent, content]);

  return (
    <div className="docs-content font-mono" ref={contentRef}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href?.startsWith("/")) {
              return (
                <Link href={href} className="underline" {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="underline" {...props}>
                {children}
              </a>
            );
          },
          code: ({ className, children, ...props }) => {
            // If there's no className, it's an inline code block
            if (!className) {
              return (
                <code className="bg-white dark:bg-black border border-black dark:border-white px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              );
            }
            
            // Extract language from className (format: language-*)
            const language = className?.replace('language-', '');
            
            return (
              <code className={`${className} font-mono`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="overflow-auto p-4 rounded-md bg-white dark:bg-black border border-black dark:border-white my-4" {...props}>
              {children}
            </pre>
          ),
          h1: ({ children, ...props }) => (
            <h1 className="text-xl font-bold my-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-lg font-semibold my-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-base font-medium my-2" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => {
            // Check if this paragraph contains a Mermaid diagram
            const childrenString = String(children);
            if (childrenString.includes('mermaid')) {
              return (
                <div className="mermaid-wrapper my-4">
                  <div className="mermaid">{childrenString.replace('mermaid', '')}</div>
                </div>
              );
            }
            
            return (
              <p className="my-4" {...props}>
                {children}
              </p>
            );
          },
          ul: ({ children, ...props }) => (
            <ul className="list-disc ml-6 my-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal ml-6 my-4" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="my-1" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-black dark:border-white pl-4 italic my-4" {...props}>
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="p-2 font-medium" style={{ backgroundColor: 'rgba(var(--box-bg-light), 0.5)' }} {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="p-2" style={{ borderBottom: '1px solid rgba(var(--border-color), 0.2)' }} {...props}>
              {children}
            </td>
          ),
          details: ({ children, ...props }) => (
            <details className="border border-black dark:border-white rounded-md my-4 p-2" {...props}>
              {children}
            </details>
          ),
          summary: ({ children, ...props }) => (
            <summary className="font-medium cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800" {...props}>
              {children}
            </summary>
          ),
          // Add more custom components as needed
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Process custom content blocks in markdown
 * This function identifies and replaces special syntax with HTML that can be rendered by rehype-raw
 */
function processCustomBlocks(content: string): string {
  // IMPORTANT: No longer processing equations - letting MathJax handle them directly
  
  // Add explicit support for currency in math expressions using a special escape sequence
  // Replace \$ (escaped dollar sign) with a span to prevent MathJax processing
  content = content.replace(/\\\$/g, '<span class="dollar-sign math-ignore">$</span>');
  
  // Hard-coded special case for "$P_{CU} = $0.06"
  content = content.replace(/(\$P_\{CU\} = )\$(\d+\.\d+)/g, 
    '$1<span class="dollar-sign math-ignore">$</span>$2');
    
  // General pattern for currency in math expressions: "= $X.XX"
  content = content.replace(/(\$[^$\n]+?)(= *)\$(\d+[\d,\.]*)/g, (match, mathPart, equals, number) => {
    return `${mathPart}${equals}<span class="dollar-sign math-ignore">$</span>${number}`;
  });
  
  // Process standalone dollar signs that are clearly for currency
  content = content.replace(/(\s|^)\$(\d+[\d,\.]*)/g, '$1<span class="dollar-sign math-ignore">$</span>$2');
  content = content.replace(/(\s|^)\$([A-Z]{2,})/g, '$1<span class="dollar-sign math-ignore">$</span>$2');
  
  // Don't process $ signs in code blocks
  let inCodeBlock = false;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }
    
    if (inCodeBlock) {
      // Mark the entire code block to be ignored by MathJax
      lines[i] = lines[i].replace(/(.*)/, '<span class="math-ignore">$1</span>');
    }
  }
  content = lines.join('\n');
  
  // Replace template variables with actual values
  const templateValues = {
    requiredConfirmations: '5',
    maxRelayers: '9',
    // Add more template variables as needed
  };
  
  // Replace template variables
  Object.entries(templateValues).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
  });

  // Fix standalone table rows that should be part of a table
  // This pattern looks for lines that look like table rows but aren't connected to a table
  content = content.replace(
    /\n\|\s+([^|]+)\s+\|\s+([^|]+)\s+\|\s+([^|]+)\s+\|\s*\n(?!\|)/g,
    (match: string, col1: string, col2: string, col3: string) => {
      return `\n| ${col1} | ${col2} | ${col3} |\n`;
    }
  );

  // Special fix for the STBGOVToken row and similar cases
  content = content.replace(
    /\n\|\s+STBGOVToken\s+\|\s+([^|]+)\s+\|\s+([^|]+)\s+\|\s*\n/g,
    (match: string, address: string, description: string) => {
      // Make sure this row is included in the table above it
      return `\n| STBGOVToken | ${address} | ${description} |\n`;
    }
  );
  
  // Process hint blocks
  content = content.replace(
    /{% hint style="(info|warning|danger|success)" %}\s*([\s\S]*?)\s*{% endhint %}/g,
    (_, style, text) => {
      // Process links within hint blocks
      const processedText = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline">$1</a>'
      );
      return `<div class="hint hint-${style}">${processedText}</div>`;
    }
  );
  
  // Process tabs (simplified version)
  content = content.replace(
    /{% tabs %}\s*([\s\S]*?)\s*{% endtabs %}/g,
    (_, tabsContent) => {
      return `<div class="tabs">${tabsContent}</div>`;
    }
  );

  // Process tab items
  content = content.replace(
    /{% tab title="(.*?)" %}\s*([\s\S]*?)\s*{% endtab %}/g,
    (_, title, tabContent) => {
      return `<div class="tab" data-title="${title}">${tabContent}</div>`;
    }
  );
  
  return content;
} 