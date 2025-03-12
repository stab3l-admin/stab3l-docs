"use client";

import React from 'react';
import { TokenomicsButtonClient } from './tokenomics-button-client';

// Map of component names to their implementations
const components = {
  TokenomicsButtonClient,
};

// MDX components provider
export function MDXComponents({ content }: { content: string }) {
  // Process the content to replace component tags with actual components
  const processedContent = React.useMemo(() => {
    let processed = content;
    
    // Replace <TokenomicsButtonClient /> with a placeholder
    processed = processed.replace(
      /<TokenomicsButtonClient\s*\/>/g,
      '<div data-mdx-component="TokenomicsButtonClient"></div>'
    );
    
    return processed;
  }, [content]);
  
  // After rendering, replace placeholders with actual components
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Find all component placeholders
    const placeholders = document.querySelectorAll('[data-mdx-component]');
    
    placeholders.forEach((placeholder) => {
      const componentName = placeholder.getAttribute('data-mdx-component');
      if (!componentName || !components[componentName as keyof typeof components]) return;
      
      // Create a new element to render the component
      const container = document.createElement('div');
      placeholder.replaceWith(container);
      
      // Render the component
      const Component = components[componentName as keyof typeof components];
      const root = document.createElement('div');
      container.appendChild(root);
      
      // @ts-ignore - Using React DOM directly
      React.render(<Component />, root);
    });
  }, [processedContent]);
  
  return null;
} 