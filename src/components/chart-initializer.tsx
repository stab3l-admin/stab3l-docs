"use client";

import { useEffect } from "react";
import Script from "next/script";

// This component initializes Chart.js and exposes the renderChart function globally
export function ChartInitializer() {
  useEffect(() => {
    // Define the renderChart function
    const defineRenderChart = () => {
      if (typeof window === 'undefined' || typeof window.Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
      }

      if (typeof window.renderChart === 'function') {
        console.log('renderChart function already defined');
        return;
      }

      window.renderChart = (
        id: string,
        type: string,
        data: {
          labels: string[];
          datasets: any[];
        },
        options?: any,
        height: number = 400,
        width: string = '100%'
      ) => {
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
          new window.Chart(canvas, {
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
      };

      console.log('renderChart function defined globally');
    };

    // Check if Chart.js is already loaded
    if (typeof window !== 'undefined' && typeof window.Chart !== 'undefined') {
      defineRenderChart();
    }
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Chart.js loaded');
          if (typeof window !== 'undefined') {
            // Define renderChart function after Chart.js is loaded
            if (typeof window.renderChart !== 'function') {
              console.log('Defining renderChart function after Chart.js load');
              if (typeof window.Chart !== 'undefined') {
                window.renderChart = (
                  id: string,
                  type: string,
                  data: {
                    labels: string[];
                    datasets: any[];
                  },
                  options?: any
                ) => {
                  try {
                    const container = document.getElementById(id);
                    if (!container) {
                      console.error(`Chart container with id '${id}' not found`);
                      return;
                    }
                    
                    container.innerHTML = '';
                    const canvas = document.createElement('canvas');
                    container.appendChild(canvas);
                    
                    new window.Chart(canvas, {
                      type: type as any,
                      data: data,
                      options: options || {
                        responsive: true,
                        maintainAspectRatio: false
                      }
                    });
                  } catch (error) {
                    console.error('Error creating chart:', error);
                    const container = document.getElementById(id);
                    if (container) {
                      container.innerHTML = `<div style="text-align:center;padding:20px;">Error creating chart: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
                    }
                  }
                };
                console.log('renderChart function defined');
              } else {
                console.error('Chart.js not available after load event');
              }
            }
          }
        }}
      />
    </>
  );
}

// Declare the global window interface to include our renderChart function
declare global {
  interface Window {
    Chart: any;
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