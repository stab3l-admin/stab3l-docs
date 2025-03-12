"use client";

import React, { useRef, useEffect } from 'react';
import { 
  createChart, 
  ColorType, 
  Time,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  CandlestickSeries
} from 'lightweight-charts';

// Define chart data types
export type ChartData = {
  time: Time;
  value: number;
};

export type CandlestickChartData = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

// Constants for value validation
const MAX_CHART_VALUE = 90071992547409.91;
const MIN_CHART_VALUE = -90071992547409.91;

interface LightweightChartProps {
  type: 'line' | 'area' | 'histogram' | 'candlestick';
  data: ChartData[] | CandlestickChartData[];
  height?: number;
  width?: number;
  title?: string;
  theme?: 'light' | 'dark';
  autoSize?: boolean;
}

// Helper function to clamp values within safe range
const clampValue = (value: number): number => {
  if (value > MAX_CHART_VALUE) return MAX_CHART_VALUE;
  if (value < MIN_CHART_VALUE) return MIN_CHART_VALUE;
  if (!isFinite(value) || isNaN(value)) return 0;
  return value;
};

export default function LightweightChart({
  type = 'line',
  data,
  height = 300,
  width = 600,
  title,
  theme = 'light',
  autoSize = false
}: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const resizeListenerRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clean up previous chart
    if (chartRef.current) {
      try {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      } catch (e) {
        console.error('Error removing previous chart:', e);
      }
    }
    
    chartContainerRef.current.innerHTML = '';
    
    try {
      // Filter and validate data
      let validData;
      
      if (type === 'candlestick') {
        validData = (data as CandlestickChartData[]).filter(item => 
          item && 'open' in item && 'high' in item && 'low' in item && 'close' in item &&
          !isNaN(item.open) && !isNaN(item.high) && !isNaN(item.low) && !isNaN(item.close) &&
          isFinite(item.open) && isFinite(item.high) && isFinite(item.low) && isFinite(item.close)
        ).map(item => ({
          ...item,
          open: clampValue(item.open),
          high: clampValue(item.high),
          low: clampValue(item.low),
          close: clampValue(item.close)
        }));
      } else {
        validData = (data as ChartData[]).filter(item => 
          item && 'value' in item && !isNaN(item.value) && isFinite(item.value) && item.time
        ).map(item => ({
          ...item,
          value: clampValue(item.value)
        }));
      }
      
      if (validData.length === 0) {
        if (chartContainerRef.current) {
          chartContainerRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: ${height}px; color: #888; text-align: center; padding: 20px;">
              <div>No valid data available for chart</div>
            </div>
          `;
        }
        return;
      }
      
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: autoSize ? chartContainerRef.current.clientWidth : width,
        height: height,
        layout: {
          background: { type: ColorType.Solid, color: theme === 'dark' ? '#1E1E1E' : '#FFFFFF' },
          textColor: theme === 'dark' ? '#FFFFFF' : '#191919',
        },
        grid: {
          vertLines: { color: theme === 'dark' ? '#2B2B43' : '#E6E6E6' },
          horzLines: { color: theme === 'dark' ? '#2B2B43' : '#E6E6E6' },
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#2B2B43' : '#E6E6E6',
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#2B2B43' : '#E6E6E6',
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: (time: number) => {
            try {
              // Convert timestamp to date
              const date = new Date(time * 1000);
              // Format as MM/YY
              return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
            } catch (e) {
              console.error('Error formatting tick mark:', e);
              return '';
            }
          },
        },
      });
      
      // Store chart reference
      chartRef.current = chart;
      
      // Create series with appropriate options based on type
      let series;
      
      if (type === 'line') {
        series = chart.addSeries(LineSeries, {
          color: '#2196F3',
          lineWidth: 2,
        });
      } 
      else if (type === 'area') {
        series = chart.addSeries(AreaSeries, {
          lineColor: 'rgba(33, 150, 243, 1)',
          topColor: 'rgba(33, 150, 243, 0.56)',
          bottomColor: 'rgba(33, 150, 243, 0.04)',
          lineWidth: 2,
        });
      } 
      else if (type === 'histogram') {
        series = chart.addSeries(HistogramSeries, {
          color: '#26a69a',
        });
      } 
      else if (type === 'candlestick') {
        series = chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
      }
      
      // Store series reference
      seriesRef.current = series;
      
      // Set data
      if (series) {
        try {
          // Ensure all time values are properly formatted
          const formattedData = validData.map((item, index) => {
            // If time is a string in YYYY-MM-DD format, keep it as is
            if (typeof item.time === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.time)) {
              return item;
            }
            
            // If time is a number or other format, try to convert to YYYY-MM-DD
            try {
              // Handle different time formats
              let dateObj: Date;
              
              if (typeof item.time === 'string' || typeof item.time === 'number') {
                dateObj = new Date(item.time);
              } else if (typeof item.time === 'object' && 'day' in item.time && 'month' in item.time && 'year' in item.time) {
                // Handle BusinessDay format
                const bd = item.time as any;
                dateObj = new Date(bd.year, bd.month - 1, bd.day);
              } else {
                // Default to current date if format is unknown
                dateObj = new Date();
                dateObj.setDate(dateObj.getDate() + index); // Add index to ensure uniqueness
              }
              
              if (isNaN(dateObj.getTime())) {
                // If conversion fails, use current date plus index to ensure uniqueness
                const now = new Date();
                now.setDate(now.getDate() + index); // Add index to ensure uniqueness
                return {
                  ...item,
                  time: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}` as Time
                };
              }
              
              // Add index to ensure uniqueness
              dateObj.setMinutes(dateObj.getMinutes() + index);
              
              return {
                ...item,
                time: `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}` as Time
              };
            } catch (e) {
              // If any error occurs, use current date plus index to ensure uniqueness
              const now = new Date();
              now.setDate(now.getDate() + index); // Add index to ensure uniqueness
              return {
                ...item,
                time: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}` as Time
              };
            }
          });
          
          // Sort data by time to ensure ascending order
          const sortedData = formattedData.sort((a, b) => {
            const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : 0;
            const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : 0;
            return timeA - timeB;
          });
          
          // Ensure no duplicate time values
          const uniqueData: any[] = [];
          const timeSet = new Set();
          
          sortedData.forEach((item, index) => {
            const timeStr = String(item.time);
            if (!timeSet.has(timeStr)) {
              timeSet.add(timeStr);
              uniqueData.push(item);
            } else {
              // If duplicate, create a slightly different time (add minutes)
              const dateObj = new Date(timeStr);
              dateObj.setMinutes(dateObj.getMinutes() + index + 1);
              const newTime = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}` as Time;
              
              uniqueData.push({
                ...item,
                time: newTime
              });
              timeSet.add(newTime);
            }
          });
          
          // Log the data for debugging
          console.log(`Setting chart data for ${title || 'chart'}:`, uniqueData);
          
          // Set the data
          series.setData(uniqueData);
          
          // Force the chart to update
          chart.applyOptions({
            timeScale: {
              timeVisible: true,
              secondsVisible: false,
              borderColor: theme === 'dark' ? '#2B2B43' : '#E6E6E6',
              tickMarkFormatter: (time: number) => {
                try {
                  const date = new Date(time * 1000);
                  return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
                } catch (e) {
                  return '';
                }
              },
            },
          });
        } catch (e) {
          console.error('Error setting chart data:', e);
          // Fallback to empty data
          series.setData([]);
        }
      }
      
      // Fit content and ensure the entire date range is visible
      setTimeout(() => {
        try {
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
            console.log(`Fitted content for ${title || 'chart'}`);
          }
        } catch (e) {
          console.error('Error fitting content:', e);
        }
      }, 100);
      
      // Add title if provided
      if (title && chartContainerRef.current) {
        const titleElement = document.createElement('div');
        titleElement.style.position = 'absolute';
        titleElement.style.top = '10px';
        titleElement.style.left = '10px';
        titleElement.style.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        titleElement.style.fontSize = '14px';
        titleElement.style.fontWeight = 'bold';
        titleElement.innerText = title;
        chartContainerRef.current.appendChild(titleElement);
      }
      
      // Handle resize if autoSize is true
      const handleResize = () => {
        if (chartContainerRef.current && autoSize && chartRef.current) {
          try {
            chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            chartRef.current.timeScale().fitContent();
          } catch (e) {
            console.error('Error handling resize:', e);
          }
        }
      };
      
      // Store resize handler reference
      resizeListenerRef.current = handleResize;
      
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('Error setting up chart:', error);
      
      // Display error message in the chart container
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: ${height}px; color: #ff5252; text-align: center; padding: 20px;">
            <div>
              <p>Error rendering chart. Please check console for details.</p>
              <p style="font-size: 12px; color: #888;">${error instanceof Error ? error.message : String(error)}</p>
            </div>
          </div>
        `;
      }
    }
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeListenerRef.current);
      
      if (chartRef.current) {
        try {
          // First remove series to prevent disposal issues
          if (seriesRef.current) {
            try {
              chartRef.current.removeSeries(seriesRef.current);
              seriesRef.current = null;
            } catch (e) {
              console.error('Error removing series:', e);
            }
          }
          
          // Then remove the chart
          chartRef.current.remove();
          chartRef.current = null;
        } catch (e) {
          console.error('Error removing chart:', e);
        }
      }
    };
  }, [type, data, height, width, title, theme, autoSize]);
  
  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: `${height}px`, position: 'relative' }} />
  );
} 