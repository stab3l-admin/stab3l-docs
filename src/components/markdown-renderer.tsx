"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { ChartComponent } from "@/components/ui/chart";
import { parseChartData } from "@/lib/chart-parser";
import dynamic from "next/dynamic";
import Script from "next/script";
import { TokenomicsButtonClient } from "./tokenomics-button-client";

// Import the chart-renderer component
const ChartRenderer = dynamic(() => import("@/components/chart-renderer").then(mod => mod.ChartRenderer), {
  ssr: false,
  loading: () => <div className="chart-placeholder">Loading chart...</div>
});

// Add mermaid if it's available in the browser
let mermaid: any;
if (typeof window !== 'undefined') {
  import('mermaid').then((m) => {
    mermaid = m.default;
    try {
      mermaid.initialize({
        startOnLoad: false, // We'll manually initialize it
        theme: 'neutral',
        securityLevel: 'loose',
      });
    } catch (error) {
      console.error('Error initializing mermaid:', error);
    }
  }).catch(error => {
    console.error('Error loading mermaid:', error);
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
  const [processedContent, setProcessedContent] = useState<string>(content);
  const [charts, setCharts] = useState<{ id: string; type: string; data: any }[]>([]);
  const [scriptContents, setScriptContents] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Process the content to handle custom blocks and extract scripts
  useEffect(() => {
    // Extract script contents before processing
    const extractedScripts: string[] = [];
    const contentWithoutScripts = content.replace(/<script>([\s\S]*?)<\/script>/g, (match, scriptContent) => {
      extractedScripts.push(scriptContent);
      return `<div class="script-placeholder" data-script-index="${extractedScripts.length - 1}"></div>`;
    });
    
    setScriptContents(extractedScripts);
    
    // Process MDX imports and components
    let processedWithComponents = processCustomBlocks(contentWithoutScripts);
    
    // Handle TokenomicsButtonClient component
    processedWithComponents = processedWithComponents.replace(
      /<TokenomicsButtonClient\s*\/>/g,
      '<div class="tokenomics-button-placeholder"></div>'
    );
    
    setProcessedContent(processedWithComponents);
  }, [content]);

  // Execute scripts and handle components after render
  useEffect(() => {
    if (!contentRef.current) return;
    
    const executeScripts = () => {
      // Process regular script placeholders
      const scriptPlaceholders = contentRef.current?.querySelectorAll('.script-placeholder:not([data-chart-id])');
      scriptPlaceholders?.forEach((placeholder) => {
        const scriptIndex = placeholder.getAttribute('data-script-index');
        if (scriptIndex !== null) {
          const index = parseInt(scriptIndex, 10);
          if (!isNaN(index) && index >= 0 && index < scriptContents.length) {
            try {
              // Create a new function from the script content and execute it
              const scriptFunction = new Function(scriptContents[index]);
              scriptFunction();
            } catch (error) {
              console.error('Error executing script:', error);
            }
          }
        }
      });
      
      // Process chart placeholders
      const chartPlaceholders = contentRef.current?.querySelectorAll('.script-placeholder[data-chart-id]');
      chartPlaceholders?.forEach((placeholder) => {
        const chartId = placeholder.getAttribute('data-chart-id');
        const chartType = placeholder.getAttribute('data-chart-type') || 'bar';
        const chartTitle = placeholder.getAttribute('data-chart-title') || '';
        const chartContentEncoded = placeholder.getAttribute('data-chart-content');
        
        if (chartId && chartContentEncoded) {
          try {
            const chartContent = decodeURIComponent(chartContentEncoded);
            
            // Execute chart rendering on the client side only
            if (typeof window !== 'undefined' && typeof window.renderChart === 'function') {
              window.renderChart(
                chartId,
                chartType,
                {
                  labels: JSON.parse(getLabelsFromContent(chartContent)),
                  datasets: JSON.parse(getDatasetsFromContent(chartContent, chartType))
                },
                {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: !!chartTitle,
                      text: chartTitle,
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    },
                    legend: {
                      position: 'top'
                    }
                  }
                }
              );
            } else {
              const chartElement = document.getElementById(chartId);
              if (chartElement) {
                chartElement.innerHTML = '<div style="text-align:center;padding:20px;">Chart could not be loaded: renderChart function not available</div>';
              }
            }
          } catch (error) {
            console.error('Error rendering chart:', error);
            const chartElement = document.getElementById(chartId);
            if (chartElement) {
              chartElement.innerHTML = `<div style="text-align:center;padding:20px;">Error rendering chart: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
            }
          }
        }
      });
      
      // Handle TokenomicsButtonClient placeholders
      const tokenomicsButtonPlaceholders = contentRef.current?.querySelectorAll('.tokenomics-button-placeholder');
      tokenomicsButtonPlaceholders?.forEach((placeholder) => {
        // Create a container for the button
        const container = document.createElement('div');
        placeholder.replaceWith(container);
        
        // Render the TokenomicsButtonClient component
        const root = document.createElement('div');
        container.appendChild(root);
        
        // Create a new instance of the component
        const button = document.createElement('div');
        button.className = "mt-8 mb-8 flex justify-center";
        
        const buttonElement = document.createElement('button');
        buttonElement.className = "bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 text-white dark:text-black font-mono font-medium py-3 px-6 rounded-none border border-black dark:border-white transition-all duration-200";
        buttonElement.textContent = "Launch Tokenomics Playground";
        buttonElement.onclick = () => {
          document.dispatchEvent(new CustomEvent('openTokenomicsPlayground'));
        };
        
        button.appendChild(buttonElement);
        root.appendChild(button);
      });
    };
    
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(executeScripts, 100);
    return () => clearTimeout(timeout);
  }, [scriptContents, processedContent]);

  // Initialize mermaid, tabs, and MathJax after render
  useEffect(() => {
    if (!contentRef.current) return;

    // Initialize mermaid if it's available
    const initMermaid = async () => {
      try {
        if (typeof window !== 'undefined' && contentRef.current) {
          const mermaidElements = contentRef.current.querySelectorAll('.mermaid');
          if (mermaidElements.length > 0) {
            console.log(`Found ${mermaidElements.length} mermaid diagrams`);
            const { default: mermaid } = await import('mermaid');
            mermaid.initialize({ startOnLoad: false });
            
            try {
              await mermaid.run({
                nodes: Array.from(mermaidElements) as HTMLElement[]
              });
            } catch (error: unknown) {
              console.error('Error rendering mermaid diagrams:', error);
            }
          }
        }
      } catch (error: unknown) {
        console.error('Error loading mermaid:', error);
      }
    };

    // Initialize MathJax if it's available
    const initMathJax = () => {
      if (typeof window !== 'undefined' && (window as any).MathJax && contentRef.current) {
        try {
          (window as any).MathJax.typeset([contentRef.current]);
        } catch (error) {
          console.error('Error typesetting MathJax:', error);
        }
      }
    };

    // Initialize tabs
    const initTabs = () => {
      if (!contentRef.current) return;
      
      // Find all tab containers
      const tabsContainers = contentRef.current.querySelectorAll('.tabs');
      
      tabsContainers.forEach((container) => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabContents = container.querySelectorAll('.tab');
        
        tabButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            if (tabContents[index]) {
              tabContents[index].classList.add('active');
            }
          });
        });
        
        // Activate first tab by default if not already done
        if (tabButtons.length > 0 && !tabButtons[0].classList.contains('active')) {
          tabButtons[0].classList.add('active');
          if (tabContents.length > 0) {
            tabContents[0].classList.add('active');
          }
        }
      });
    };

    // Initialize charts with data attributes
    const initCharts = () => {
      if (!contentRef.current) return;
      
      // Find all chart containers with data attributes
      const chartElements = contentRef.current.querySelectorAll('[data-chart-type]');
      
      chartElements.forEach((element) => {
        const chartId = element.id;
        const chartType = element.getAttribute('data-chart-type');
        const labelsAttr = element.getAttribute('data-chart-labels');
        const datasetsAttr = element.getAttribute('data-chart-datasets');
        const optionsAttr = element.getAttribute('data-chart-options');
        
        if (chartId && chartType && labelsAttr && datasetsAttr) {
          try {
            // Parse the JSON data from attributes
            const labels = JSON.parse(labelsAttr);
            const datasets = JSON.parse(datasetsAttr);
            const options = optionsAttr ? JSON.parse(optionsAttr) : {};
            
            // Render the chart using the global function
            if (typeof window !== 'undefined' && typeof window.renderChart === 'function') {
              window.renderChart(
                chartId,
                chartType,
                { labels, datasets },
                options
              );
            } else {
              console.error('renderChart function not available');
              element.innerHTML = '<div style="text-align:center;padding:20px;">Chart could not be loaded: renderChart function not available</div>';
            }
          } catch (error) {
            console.error('Error rendering chart:', error);
            element.innerHTML = `<div style="text-align:center;padding:20px;">Error rendering chart: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
          }
        }
      });
    };

    // Run all initializations
    const timeout = setTimeout(() => {
      initMermaid();
      initMathJax();
      initTabs();
      initCharts(); // Add chart initialization
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [processedContent]);

  useEffect(() => {
    if (content) {
      // Extract chart data from placeholders
      const chartPlaceholders: { id: string; type: string; data: string }[] = [];
      const placeholderRegex = /<div class="chart-placeholder" data-id="([^"]+)" data-type="([^"]+)" data-chart="([^"]+)">.*?<\/div>/g;
      
      let match;
      while ((match = placeholderRegex.exec(content)) !== null) {
        try {
          const id = match[1];
          const type = match[2];
          const chartDataStr = match[3].replace(/&quot;/g, '"');
          
          chartPlaceholders.push({
            id,
            type,
            data: chartDataStr
          });
        } catch (error) {
          console.error('Error extracting chart data:', error);
        }
      }
      
      // Parse chart data
      const parsedCharts = chartPlaceholders.map(placeholder => {
        try {
          let chartData;
          try {
            // Try to parse as JSON
            const decodedData = decodeURIComponent(placeholder.data);
            console.log('Decoded chart data:', decodedData);
            const parsedData = JSON.parse(decodedData);
            
            // If this is our new format with content field
            if (parsedData.content) {
              chartData = parseChartData(placeholder.type, parsedData.content);
              if (parsedData.title) {
                chartData.title = parsedData.title;
              }
            } else {
              // Fallback to direct parsing
              chartData = parsedData;
            }
            
            console.log('Parsed chart data:', chartData);
          } catch (e) {
            console.error('Error parsing chart JSON:', e);
            // If parsing fails, try to use parseChartData directly
            chartData = parseChartData(placeholder.type, placeholder.data);
          }
          
          return {
            id: placeholder.id,
            type: placeholder.type,
            data: chartData
          };
        } catch (error) {
          console.error(`Error parsing chart data for ${placeholder.id}:`, error);
          // Return a fallback error chart
          return {
            id: placeholder.id,
            type: 'bar',
            data: {
              title: 'Error Parsing Chart Data',
              labels: ['Error'],
              datasets: [{
                label: 'Error',
                data: [1],
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              }]
            }
          };
        }
      });
      
      console.log('Final charts array:', parsedCharts);
      setCharts(parsedCharts);
    }
  }, [content]);

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

      {/* Render charts */}
      {charts.map((chart) => (
        <div key={chart.id} id={chart.id} className="chart-container">
          <ChartComponent 
            type={chart.type} 
            data={chart.data} 
            width={800}
            height={400}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Process custom content blocks in markdown
 * This function identifies and replaces special syntax with HTML that can be rendered by rehype-raw
 */
function processCustomBlocks(content: string): string {
  if (!content) return '';
  
  // Process escaped dollar signs to prevent MathJax processing
  content = content.replace(/\\\$/g, '<span class="escaped-dollar">$</span>');
  
  // Handle specific cases for currency formatting in math expressions
  content = content.replace(/\$([0-9,.]+)\s*(?:million|billion|trillion)?(?:\s*\([A-Z]+\))?/g, (match, amount) => {
    // Don't replace if it's inside a code block
    const prevContent = content.substring(0, content.indexOf(match));
    const codeBlockCount = (prevContent.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) return match;
    
    return `<span class="dollar-sign math-ignore">$</span>${amount}`;
  });
  
  // Process template variables
  content = content.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, '<span class="template-var-$1">{{$1}}</span>');
  
  // Process bold text with double asterisks
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Process chart blocks - direct approach
  content = content.replace(/```chart\n([\s\S]*?)```/g, (match, chartContent) => {
    try {
      // Extract chart type and title
      const typeMatch = chartContent.match(/type:\s*([a-zA-Z]+)/);
      const titleMatch = chartContent.match(/title:\s*([^\n]+)/);
      
      const chartType = typeMatch ? typeMatch[1].trim() : 'bar';
      const chartTitle = titleMatch ? titleMatch[1].trim() : '';
      
      // Create a unique ID for this chart
      const chartId = `chart-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a div for the chart
      return `
        <div id="${chartId}" class="chart-container" style="height: 400px; width: 100%; margin: 20px 0; border: 1px dashed #ccc; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
          <p style="font-style: italic; color: #666;">Chart loading...</p>
        </div>
        <div class="script-placeholder" data-chart-id="${chartId}" data-chart-type="${chartType}" data-chart-title="${chartTitle}" data-chart-content="${encodeURIComponent(chartContent)}"></div>
      `;
    } catch (error: any) {
      console.error('Error processing chart:', error);
      return `<div class="chart-error">Error processing chart: ${error.message || 'Unknown error'}</div>`;
    }
  });
  
  // Process accordion blocks
  content = content.replace(/{%\s*accordion\s+title="([^"]+)"\s*%}([\s\S]*?){%\s*endaccordion\s*%}/g, (match, title, accordionContent) => {
    // Process links within accordion content
    const processedContent = accordionContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    return `<details class="accordion-item">
      <summary class="accordion-title">${title}</summary>
      <div class="accordion-content">${processedContent}</div>
    </details>`;
  });
  
  // Process tabs
  content = content.replace(/{%\s*tabs\s*%}([\s\S]*?){%\s*endtabs\s*%}/g, (match, tabsContent) => {
    const tabMatchesIterator = tabsContent.matchAll(/{%\s*tab\s+title="([^"]+)"\s*%}([\s\S]*?){%\s*endtab\s*%}/g);
    const tabMatches = Array.from(tabMatchesIterator);
    
    if (tabMatches.length === 0) return match; // Return original if no tabs found
    
    let tabsHtml = '<div class="tabs">';
    let tabsHeaderHtml = '<div class="tabs-header">';
    let tabsContentHtml = '<div class="tabs-content">';
    
    for (let index = 0; index < tabMatches.length; index++) {
      const tabMatch = tabMatches[index] as RegExpMatchArray;
      const tabTitle = String(tabMatch[1] || '');
      let tabContent = String(tabMatch[2] || '');
      
      // Process markdown content inside the tab
      // First, handle tables properly
      tabContent = processTablesInContent(tabContent);
      
      // Process links and other markdown within tab content
      const processedContent = tabContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      
      const isActive = index === 0 ? ' active' : '';
      tabsHeaderHtml += `<button class="tab-button${isActive}" data-index="${index}">${tabTitle}</button>`;
      tabsContentHtml += `<div class="tab${isActive}" data-index="${index}">${processedContent}</div>`;
    }
    
    tabsHeaderHtml += '</div>'; // Close tabs-header
    tabsContentHtml += '</div>'; // Close tabs-content
    tabsHtml += tabsHeaderHtml + tabsContentHtml + '</div>'; // Combine all and close tabs
    
    return tabsHtml;
  });
  
  // Process hint blocks
  content = content.replace(/{%\s*hint\s+style="(info|warning|danger|success)"\s*%}\s*([\s\S]*?)\s*{%\s*endhint\s*%}/g, (match, style, text) => {
    // Process links within hint content
    const processedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    return `<div class="hint hint-${style}">${processedText}</div>`;
  });
  
  return content;
}

function getLabelsFromContent(content: string): string {
  try {
    // Extract labels section
    const labelsMatch = content.match(/labels:\s*([\s\S]*?)(?:datasets:|options:|$)/);
    if (!labelsMatch) return '[]';
    
    const labelsContent = labelsMatch[1].trim();
    
    // Check if labels are in array format
    if (labelsContent.startsWith('[') && labelsContent.endsWith(']')) {
      return labelsContent; // Return as is if it's already in JSON array format
    }
    
    // Extract from list format (- item)
    const labels = labelsContent
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
    
    return JSON.stringify(labels);
  } catch (error) {
    console.error('Error extracting labels:', error);
    return '[]';
  }
}

function getDatasetsFromContent(content: string, chartType: string): string {
  try {
    // Default colors
    const defaultColors = [
      'rgba(255, 99, 132, 0.5)',   // Red
      'rgba(54, 162, 235, 0.5)',   // Blue
      'rgba(255, 206, 86, 0.5)',   // Yellow
      'rgba(75, 192, 192, 0.5)',   // Green
      'rgba(153, 102, 255, 0.5)',  // Purple
      'rgba(255, 159, 64, 0.5)',   // Orange
    ];
    
    const borderColors = defaultColors.map(color => color.replace('0.5', '1'));
    
    // Extract datasets section
    const datasetsMatch = content.match(/datasets:\s*([\s\S]*?)(?:options:|$)/);
    if (!datasetsMatch) return '[]';
    
    const datasetsContent = datasetsMatch[1];
    
    // Split datasets by the dash at the beginning of a line
    const datasetBlocks = datasetsContent.split(/(?:^|\n)\s*-\s*/).filter(block => block.trim());
    
    const datasets = datasetBlocks.map((block: string, index: number) => {
      // Extract label
      const labelMatch = block.match(/label:\s*([^\n]+)/);
      const label = labelMatch ? labelMatch[1].trim() : `Dataset ${index + 1}`;
      
      // Extract data
      let data: any[] = []; // Change to any[] to handle both number[] and object[]
      const dataMatch = block.match(/data:\s*(\[[^\]]+\])/);
      
      if (dataMatch) {
        try {
          data = JSON.parse(dataMatch[1]);
        } catch (e) {
          console.error('Error parsing data JSON:', e);
        }
      } else {
        // Try to extract data from list format
        const dataLines = block.match(/data:\s*([\s\S]*?)(?:\n\s*\w+:|$)/);
        if (dataLines) {
          data = dataLines[1]
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => {
              const value = line.trim().substring(1).trim();
              // Try to parse as number, otherwise keep as string
              const parsed = parseFloat(value);
              return isNaN(parsed) ? value : parsed;
            });
        }
      }
      
      // Extract backgroundColor
      const bgColorMatch = block.match(/backgroundColor:\s*([^\n]+)/);
      const backgroundColor = bgColorMatch 
        ? bgColorMatch[1].trim() 
        : defaultColors[index % defaultColors.length];
      
      // Extract borderColor
      const borderColorMatch = block.match(/borderColor:\s*([^\n]+)/);
      const borderColor = borderColorMatch 
        ? borderColorMatch[1].trim() 
        : borderColors[index % borderColors.length];
      
      return {
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1
      };
    });
    
    // For pie/doughnut charts, handle special case
    if ((chartType === 'pie' || chartType === 'doughnut') && datasets.length === 1) {
      const dataset = datasets[0];
      // Generate colors for each data point if not already specified
      if (!dataset.backgroundColor || !Array.isArray(dataset.backgroundColor)) {
        dataset.backgroundColor = dataset.data.map((_: any, i: number) => 
          defaultColors[i % defaultColors.length]
        ) as any; // Use type assertion to avoid the type error
      }
    }
    
    // For bubble charts, handle special case
    if (chartType === 'bubble') {
      datasets.forEach(dataset => {
        // Convert data to bubble format if needed
        if (Array.isArray(dataset.data) && typeof dataset.data[0] !== 'object') {
          dataset.data = dataset.data.map((value: number, i: number) => ({
            x: i + 1,
            y: value,
            r: 10
          }));
        }
      });
    }
    
    return JSON.stringify(datasets);
  } catch (error) {
    console.error('Error extracting datasets:', error);
    return '[]';
  }
}

// Add a new function to process tables in content
function processTablesInContent(content: string): string {
  // Process markdown tables
  // Look for table patterns: | header1 | header2 | ... followed by | --- | --- | ...
  const tableRegex = /(\|[^\n]+\|\n\|[\s-]+\|[^\n]*\n((\|[^\n]+\|\n)+))/g;
  
  return content.replace(tableRegex, (tableMatch) => {
    // Split the table into rows
    const rows = tableMatch.split('\n').filter(row => row.trim() !== '');
    
    if (rows.length < 2) return tableMatch; // Not a valid table
    
    // Start building the HTML table
    let tableHtml = '<table class="w-full border-collapse my-4">\n';
    
    // Process header row
    const headerCells = rows[0].split('|').filter(cell => cell.trim() !== '');
    tableHtml += '<thead>\n<tr>\n';
    headerCells.forEach(cell => {
      tableHtml += `<th class="p-2 font-medium border border-gray-300 dark:border-gray-700" style="background-color: rgba(var(--box-bg-light), 0.5)">${cell.trim()}</th>\n`;
    });
    tableHtml += '</tr>\n</thead>\n';
    
    // Process body rows (skip the header and separator rows)
    tableHtml += '<tbody>\n';
    for (let i = 2; i < rows.length; i++) {
      const cells = rows[i].split('|').filter(cell => cell.trim() !== '');
      tableHtml += '<tr>\n';
      cells.forEach(cell => {
        tableHtml += `<td class="p-2 border border-gray-300 dark:border-gray-700">${cell.trim()}</td>\n`;
      });
      tableHtml += '</tr>\n';
    }
    tableHtml += '</tbody>\n</table>';
    
    return tableHtml;
  });
} 