"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Immediately execute this code to ensure the function is available
// as soon as the file is loaded
(function() {
  // Define the renderChart function
  function renderChart(
    id: string,
    type: string,
    data: {
      labels: string[];
      datasets: any[];
    },
    options?: any,
    height: number = 400,
    width: string = '100%'
  ) {
    try {
      console.log(`Rendering chart with id: ${id}, type: ${type}`);
      
      // Get the chart container
      const container = document.getElementById(id);
      if (!container) {
        console.error(`Chart container with id '${id}' not found`);
        return;
      }

      // Clear the container
      container.innerHTML = '';
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);
      
      // Create the chart
      new Chart(canvas, {
        type: type as any,
        data: data,
        options: options || {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      
      console.log(`Chart ${id} rendered successfully`);
    } catch (error) {
      console.error('Error creating chart:', error);
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = `<div style="text-align:center;padding:20px;">Error creating chart: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
      }
    }
  }

  // Expose the renderChart function to the window object
  if (typeof window !== 'undefined') {
    (window as any).renderChart = renderChart;
    console.log('renderChart function attached to window object');
  }
})();

// Declare the global window interface to include our renderChart function
declare global {
  interface Window {
    renderChart: (
      id: string,
      type: string,
      data: {
        labels: string[];
        datasets: any[];
      },
      options?: any,
      height?: number,
      width?: string
    ) => void;
  }
}

interface ChartEmbedProps {
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

export function ChartEmbed({ id, type, data, options, height = 400, width = '100%' }: ChartEmbedProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!chartRef.current) return;

      // Clear previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Clear the container
      chartRef.current.innerHTML = '';
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      chartRef.current.appendChild(canvas);
      
      try {
        // Create the chart
        chartInstance.current = new Chart(canvas, {
          type,
          data,
          options: options || {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
        chartRef.current.innerHTML = `<div style="text-align:center;padding:20px;">Error creating chart: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
      }
    };

    renderChart();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [id, type, data, options]);

  return (
    <div 
      id={id} 
      ref={chartRef} 
      style={{ 
        height: `${height}px`, 
        width: width,
        margin: '20px 0',
        border: '1px solid #eee',
        borderRadius: '5px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ fontStyle: 'italic', color: '#666' }}>Chart loading...</p>
      </div>
    </div>
  );
} 