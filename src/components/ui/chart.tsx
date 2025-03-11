"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register all Chart.js components
ChartJS.register(...registerables);

interface ChartComponentProps {
  type: string;
  data: any;
  options?: any;
  width?: number;
  height?: number;
}

/**
 * Chart component for rendering various chart types
 * Supports bar, line, pie, doughnut, radar, polarArea, bubble, and scatter charts
 */
export function ChartComponent({ type, data, options = {}, width = 600, height = 400 }: ChartComponentProps) {
  const chartRef = useRef<ChartJS>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  
  // Process and validate chart data
  useEffect(() => {
    console.log('ChartComponent received type:', type);
    console.log('ChartComponent received data:', data);
    console.log('ChartComponent received options:', options);
    
    try {
      // Basic validation of chart data
      if (!data) {
        setError('No chart data provided');
        return;
      }
      
      if (typeof data !== 'object') {
        setError('Invalid chart data format');
        return;
      }
      
      // For non-pie/doughnut charts, check for datasets
      if (['bar', 'line', 'radar', 'bubble', 'scatter'].includes(type)) {
        if (!data.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
          setError('Chart data missing datasets array');
          return;
        }
      }
      
      // Process the data to ensure it's in the correct format for Chart.js
      const processedData = {
        labels: data.labels || [],
        datasets: data.datasets.map((dataset: any) => {
          // Ensure backgroundColor is properly formatted
          let backgroundColor = dataset.backgroundColor;
          if (typeof backgroundColor === 'string' && !backgroundColor.startsWith('rgba(') && !backgroundColor.startsWith('rgb(') && !backgroundColor.startsWith('#')) {
            backgroundColor = `rgba(54, 162, 235, 0.5)`;
          }
          
          // Ensure borderColor is properly formatted
          let borderColor = dataset.borderColor;
          if (typeof borderColor === 'string' && !borderColor.startsWith('rgba(') && !borderColor.startsWith('rgb(') && !borderColor.startsWith('#')) {
            borderColor = `rgb(54, 162, 235)`;
          }
          
          return {
            ...dataset,
            backgroundColor,
            borderColor,
            borderWidth: dataset.borderWidth || 1
          };
        })
      };
      
      console.log('Processed chart data:', processedData);
      setChartData(processedData);
      setError(null);
    } catch (err) {
      console.error('Error processing chart data:', err);
      setError(`Error processing chart data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [data, type]);
  
  // Set default options based on chart type
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'IBM Plex Mono', monospace",
            size: 12
          }
        }
      },
      title: {
        display: !!data?.title,
        text: data?.title || '',
        font: {
          family: "'IBM Plex Mono', monospace",
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        titleFont: {
          family: "'IBM Plex Mono', monospace",
          size: 12
        },
        bodyFont: {
          family: "'IBM Plex Mono', monospace",
          size: 12
        }
      }
    },
    scales: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea' ? {
      x: {
        ticks: {
          font: {
            family: "'IBM Plex Mono', monospace",
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          font: {
            family: "'IBM Plex Mono', monospace",
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    } : {}
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  console.log('Merged chart options:', mergedOptions);

  if (error) {
    return (
      <div className="chart-error" style={{ width: `${width}px`, height: 'auto', minHeight: '100px' }}>
        {error}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-placeholder" style={{ width: `${width}px`, height: `${height}px`, margin: '0 auto' }}>
        Loading chart...
      </div>
    );
  }

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, margin: '0 auto' }}>
      <Chart
        ref={chartRef}
        type={type as any}
        data={chartData}
        options={mergedOptions}
      />
    </div>
  );
} 