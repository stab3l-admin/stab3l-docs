"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { Hint } from "@/components/ui/hint";
import { Card } from "@/components/ui/card";
import { Expandable } from "@/components/ui/expandable";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown renderer component
 * Renders markdown content with syntax highlighting and GitHub Flavored Markdown support
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Process custom content blocks before rendering markdown
  const processedContent = processCustomBlocks(content);

  return (
    <div className="docs-content font-mono text-sm">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href?.startsWith("/")) {
              return (
                <a href={href} className="underline" {...props}>
                  {children}
                </a>
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
                <code className="bg-white dark:bg-black border border-black dark:border-white px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} font-mono text-xs`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="overflow-auto p-4 rounded-md bg-white dark:bg-black border border-black dark:border-white" {...props}>
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
          p: ({ children, ...props }) => (
            <p className="my-4" {...props}>
              {children}
            </p>
          ),
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
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-black dark:border-white p-2 bg-white dark:bg-black" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-black dark:border-white p-2" {...props}>
              {children}
            </td>
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
  // Process hint blocks
  content = content.replace(
    /{% hint style="(info|warning|danger|success)" %}\s*([\s\S]*?)\s*{% endhint %}/g,
    (_, style, text) => {
      return `<div class="hint hint-${style}">${text}</div>`;
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