"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ChartEmbed component with no SSR
const ChartEmbed = dynamic(
  () => import('@/components/ui/chart-embed').then((mod) => mod.ChartEmbed),
  { ssr: false }
);

interface ChartRendererProps {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'bubble' | 'scatter';
  data: {
    labels: string[];
    datasets: any[];
  };
  options?: any;
  height?: number;
  width?: string;
}

/**
 * ChartRenderer component
 * This component is used to render charts in the markdown content
 */
export function ChartRenderer({ id, type, data, options, height = 400, width = '100%' }: ChartRendererProps) {
  return (
    <div className="chart-container" style={{ margin: '20px 0' }}>
      <ChartEmbed
        id={id}
        type={type}
        data={data}
        options={options}
        height={height}
        width={width}
      />
    </div>
  );
}

// Export a global function to render charts
// This will be used in the markdown content
if (typeof window !== 'undefined') {
  (window as any).renderChart = (
    elementId: string,
    chartType: string,
    chartData: any,
    chartOptions?: any,
    height?: number,
    width?: string
  ) => {
    // Import React and ReactDOM dynamically
    import('react').then((React) => {
      import('react-dom/client').then((ReactDOM) => {
        const element = document.getElementById(elementId);
        if (!element) {
          console.error(`Element with id ${elementId} not found`);
          return;
        }

        try {
          // Create a root for the element
          const root = ReactDOM.createRoot(element);
          
          // Render the ChartRenderer component
          root.render(
            React.createElement(ChartRenderer, {
              id: `${elementId}-canvas`,
              type: chartType as any,
              data: chartData,
              options: chartOptions,
              height: height || 400,
              width: width || '100%'
            })
          );
        } catch (error) {
          console.error('Error rendering chart:', error);
          element.innerHTML = `<div style="text-align:center;padding:20px;border:1px dashed #ccc;border-radius:5px;">Error rendering chart: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
      });
    });
  };
} 