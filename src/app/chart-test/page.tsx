"use client";

import { useEffect } from "react";

export default function ChartTestPage() {
  useEffect(() => {
    // Check if Chart.js and renderChart are available
    console.log('Chart.js available:', typeof window !== 'undefined' && typeof (window as any).Chart !== 'undefined');
    console.log('renderChart available:', typeof window !== 'undefined' && typeof (window as any).renderChart === 'function');
    
    // Try to render a chart
    if (typeof window !== 'undefined' && typeof (window as any).renderChart === 'function') {
      (window as any).renderChart(
        'test-chart',
        'bar',
        {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: 'Test Dataset',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Test Chart',
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
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chart Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Direct Chart Rendering Test</h2>
        <div 
          id="test-chart" 
          style={{ 
            height: '400px', 
            width: '100%', 
            margin: '20px 0', 
            border: '1px dashed #ccc', 
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p style={{ fontStyle: 'italic', color: '#666' }}>Chart loading...</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Script Tag Test</h2>
        <div 
          id="script-test-chart" 
          style={{ 
            height: '400px', 
            width: '100%', 
            margin: '20px 0', 
            border: '1px dashed #ccc', 
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p style={{ fontStyle: 'italic', color: '#666' }}>Chart loading...</p>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof window !== 'undefined' && typeof window.renderChart === 'function') {
            window.renderChart(
              'script-test-chart',
              'pie',
              {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
                datasets: [
                  {
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(75, 192, 192, 0.7)',
                      'rgba(153, 102, 255, 0.7)'
                    ],
                    borderWidth: 1
                  }
                ]
              },
              {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Script Tag Test Chart',
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
            document.getElementById('script-test-chart').innerHTML = 
              '<div style="text-align:center;padding:20px;">Chart could not be loaded: renderChart function not available</div>';
          }
        `}} />
      </div>
    </div>
  );
} 