"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown renderer component with syntax highlighting and GitHub Flavored Markdown support
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="docs-content font-mono text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href && href.startsWith("/")) {
              return (
                <Link href={href} {...props} className="underline">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          code: ({ className, children, ...props }) => {
            return (
              <code className={`${className} font-mono text-xs bg-white dark:bg-black border border-theme px-1`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => {
            return (
              <pre className="font-mono text-xs bg-white dark:bg-black p-4 overflow-x-auto my-4 border border-theme" {...props}>
                {children}
              </pre>
            );
          },
          h1: ({ children, ...props }) => (
            <h1 className="text-xl font-bold my-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-lg font-bold my-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-base font-bold my-2" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="my-2" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc ml-5 my-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal ml-5 my-2" {...props}>
              {children}
            </ol>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-2 border-theme pl-4 my-2" {...props}>
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="border border-theme w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-theme p-2 font-bold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-theme p-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 