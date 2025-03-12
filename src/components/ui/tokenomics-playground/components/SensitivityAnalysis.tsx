"use client";

import React, { useState, useMemo } from 'react';
import styles from '../tokenomics-playground.module.css';
import { TokenomicsMetrics, TokenomicsParameters } from '../index';
import { runSensitivityAnalysis, calculateMetrics } from '../calculations';
import LightweightChart, { ChartData } from './LightweightChart';
import { Time } from 'lightweight-charts';

// Define a local SensitivityResult type to use in the component
interface SensitivityResult {
  paramValue: number;
  metrics: TokenomicsMetrics;
}

interface SensitivityAnalysisProps {
  metrics: TokenomicsMetrics;
  parameters: TokenomicsParameters;
}

export default function SensitivityAnalysis({ metrics, parameters }: SensitivityAnalysisProps) {
  const [selectedParam, setSelectedParam] = useState<string>('monthlyGrowthRate');
  const [selectedCategory, setSelectedCategory] = useState<string>('systemParameters');
  const [analysisResults, setAnalysisResults] = useState<SensitivityResult[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('price');
  
  // Run sensitivity analysis when parameters change
  React.useEffect(() => {
    try {
      // Ensure we have valid parameters before running analysis
      if (!parameters) {
        console.error('Parameters object is undefined or null');
        return;
      }
      
      // Validate that the selected parameter exists and is a number
      let paramValue: number;
      
      switch (selectedCategory) {
        case 'systemParameters':
          paramValue = Number(parameters.systemParameters[selectedParam as keyof typeof parameters.systemParameters]);
          break;
        case 'marketDynamics':
          paramValue = Number(parameters.marketDynamics[selectedParam as keyof typeof parameters.marketDynamics]);
          break;
        case 'feeStructure':
          paramValue = Number(parameters.feeStructure[selectedParam as keyof typeof parameters.feeStructure]);
          break;
        case 'providerEconomics':
          paramValue = Number(parameters.providerEconomics[selectedParam as keyof typeof parameters.providerEconomics]);
          break;
        default:
          console.error('Invalid parameter category:', selectedCategory);
          return;
      }
      
      if (isNaN(paramValue)) {
        console.error(`Parameter ${selectedParam} is not a valid number:`, paramValue);
        return;
      }
      
      // Call runSensitivityAnalysis with the correct parameters
      const result = runSensitivityAnalysis(selectedCategory, selectedParam, 30);
      
      // Convert the result to our SensitivityResult format
      const convertedResults: SensitivityResult[] = result.variations.map(variation => {
        // Create a modified parameter set
        const modifiedParams = JSON.parse(JSON.stringify(parameters));
        
        // Update the specific parameter
        switch (selectedCategory) {
          case 'systemParameters':
            modifiedParams.systemParameters[selectedParam] = variation.paramValue;
            break;
          case 'marketDynamics':
            modifiedParams.marketDynamics[selectedParam] = variation.paramValue;
            break;
          case 'feeStructure':
            modifiedParams.feeStructure[selectedParam] = variation.paramValue;
            break;
          case 'providerEconomics':
            modifiedParams.providerEconomics[selectedParam] = variation.paramValue;
            break;
        }
        
        // Calculate metrics with the modified parameter
        const calculatedMetrics = calculateMetrics(modifiedParams, 12);
        
        return {
          paramValue: variation.paramValue,
          metrics: calculatedMetrics
        };
      });
      
      setAnalysisResults(convertedResults);
    } catch (error) {
      console.error('Error running sensitivity analysis:', error);
    }
  }, [parameters, selectedParam, selectedCategory]);
  
  // Generate chart data for each metric
  const generateChartData = (metricSelector: (result: SensitivityResult) => number) => {
    if (!analysisResults || analysisResults.length === 0) return [];
    
    // Create a map to track used parameter values and avoid duplicates
    const usedParamValues = new Map<string, number>();
    
    // Create a base date for consistent date generation
    const baseDate = new Date();
    
    const unsortedData = analysisResults.map((result, index) => {
      const value = metricSelector(result);
      if (isNaN(value) || !isFinite(value)) return null;
      
      // Format parameter value to ensure uniqueness
      let paramValue = parseFloat(result.paramValue.toFixed(4));
      
      // Check if this parameter value has been used before
      const paramValueStr = paramValue.toString();
      if (usedParamValues.has(paramValueStr)) {
        // If duplicate, add a small increment to make it unique
        const count = usedParamValues.get(paramValueStr)! + 1;
        usedParamValues.set(paramValueStr, count);
        
        // Add a tiny increment to make the value unique but visually similar
        paramValue = paramValue + (count * 0.0001);
      } else {
        usedParamValues.set(paramValueStr, 1);
      }
      
      // Create a date string for the x-axis
      // This ensures proper ordering and display in the chart
      // Use a consistent date pattern with increasing days to ensure uniqueness
      const dateObj = new Date(baseDate);
      dateObj.setDate(baseDate.getDate() + index);
      
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      
      return {
        time: dateStr as Time,
        value: value,
        // Store the original parameter value as a custom property for tooltips
        originalParam: paramValue
      };
    }).filter(Boolean) as ChartData[]; // Filter out null values
    
    // Sort by time to ensure ascending order
    return unsortedData.sort((a, b) => {
      if (!a || !b) return 0;
      const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : 0;
      const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : 0;
      return timeA - timeB;
    });
  };
  
  const sstbPriceChartData = useMemo(() => {
    return generateChartData(result => result.metrics.sstbPrice);
  }, [analysisResults]);
  
  const rstbPriceChartData = useMemo(() => {
    return generateChartData(result => result.metrics.rstbPrice);
  }, [analysisResults]);
  
  const stabilityChartData = useMemo(() => {
    return generateChartData(result => result.metrics.sstbStability);
  }, [analysisResults]);
  
  const tvlChartData = useMemo(() => {
    return generateChartData(result => result.metrics.tvl);
  }, [analysisResults]);
  
  const stakedCUChartData = useMemo(() => {
    return generateChartData(result => result.metrics.stakedCU);
  }, [analysisResults]);
  
  const sstbUnlockedChartData = useMemo(() => {
    return generateChartData(result => result.metrics.sstbUnlocked);
  }, [analysisResults]);
  
  const rstbUnlockedChartData = useMemo(() => {
    return generateChartData(result => result.metrics.rstbUnlocked);
  }, [analysisResults]);
  
  const stakedSstbChartData = useMemo(() => {
    return generateChartData(result => result.metrics.stakedSstb);
  }, [analysisResults]);
  
  const stakedRstbChartData = useMemo(() => {
    return generateChartData(result => result.metrics.stakedRstb);
  }, [analysisResults]);
  
  const roiChartData = useMemo(() => {
    return generateChartData(result => result.metrics.providerROI);
  }, [analysisResults]);
  
  const revenueChartData = useMemo(() => {
    return generateChartData(result => result.metrics.monthlyRevenue);
  }, [analysisResults]);

  // Parameter category options
  const categoryOptions = [
    { value: 'systemParameters', label: 'System Parameters' },
    { value: 'marketDynamics', label: 'Market Dynamics' },
    { value: 'feeStructure', label: 'Fee Structure' },
    { value: 'providerEconomics', label: 'Provider Economics' }
  ];
  
  // Parameter options based on selected category
  const getParameterOptions = () => {
    switch (selectedCategory) {
      case 'systemParameters':
        return [
          { value: 'monthlyGrowthRate', label: 'Monthly Growth Rate' },
          { value: 'milestone1Month', label: 'Milestone 1 Month' },
          { value: 'cuTarget', label: 'CU Target' }
        ];
      case 'marketDynamics':
        return [
          { value: 'demandElasticity', label: 'Demand Elasticity' },
          { value: 'collateralRatio', label: 'Collateral Ratio' },
          { value: 'priceSensitivity', label: 'Price Sensitivity' }
        ];
      case 'feeStructure':
        return [
          { value: 'transactionFee', label: 'Transaction Fee' },
          { value: 'stakingRewardRate', label: 'Staking Reward Rate' },
          { value: 'bridgeFee', label: 'Bridge Fee' }
        ];
      case 'providerEconomics':
        return [
          { value: 'providerRewardRate', label: 'Provider Reward Rate' },
          { value: 'providerCost', label: 'Provider Cost' },
          { value: 'setupCost', label: 'Setup Cost' }
        ];
      default:
        return [];
    }
  };

  // Metric options for the dropdown
  const metricOptions = [
    { value: 'price', label: 'Token Prices' },
    { value: 'stability', label: 'sSTB Stability' },
    { value: 'tvl', label: 'Total Value Locked' },
    { value: 'staking', label: 'Staking Metrics' },
    { value: 'unlocked', label: 'Token Unlocks' },
    { value: 'roi', label: 'Provider ROI' },
    { value: 'revenue', label: 'Monthly Revenue' }
  ];

  return (
    <div className={styles.panel}>
      <h3>Sensitivity Analysis</h3>
      <p className={styles.description}>
        Analyze how changes to a single parameter affect various metrics while keeping all other parameters constant.
      </p>
      
      <div className={styles.controlRow}>
        <div className={styles.controlGroup}>
          <label htmlFor="category-select">Parameter Category:</label>
          <select 
            id="category-select"
            className={styles.select}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              // Reset parameter selection when category changes
              setSelectedParam(getParameterOptions()[0]?.value || '');
            }}
            style={{ 
              width: '100%', 
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.controlGroup}>
          <label htmlFor="param-select">Parameter:</label>
          <select 
            id="param-select"
            className={styles.select}
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}
          >
            {getParameterOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.controlGroup}>
          <label htmlFor="metric-select">Metric to Display:</label>
          <select 
            id="metric-select"
            className={styles.select}
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}
          >
            {metricOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        {selectedMetric === 'price' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h4>sSTB Price</h4>
              <LightweightChart 
                type="line"
                data={sstbPriceChartData} 
                height={200}
                theme="light"
                autoSize={true}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h4>rSTB Price</h4>
              <LightweightChart 
                type="line"
                data={rstbPriceChartData} 
                height={200}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
        )}
        
        {selectedMetric === 'stability' && (
          <div className={styles.singleChart}>
            <h4>sSTB Stability Score</h4>
            <LightweightChart 
              type="line"
              data={stabilityChartData} 
              height={300}
              theme="light"
              autoSize={true}
            />
          </div>
        )}
        
        {selectedMetric === 'tvl' && (
          <div className={styles.singleChart}>
            <h4>Total Value Locked (TVL)</h4>
            <LightweightChart 
              type="line"
              data={tvlChartData} 
              height={300}
              theme="light"
              autoSize={true}
            />
          </div>
        )}
        
        {selectedMetric === 'staking' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h4>CU Staked</h4>
              <LightweightChart 
                type="line"
                data={stakedCUChartData} 
                height={200}
                theme="light"
                autoSize={true}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h4>Token Staking</h4>
              <div className={styles.multiChartContainer}>
                <LightweightChart 
                  type="line"
                  data={stakedSstbChartData} 
                  height={100}
                  theme="light"
                  autoSize={true}
                />
                <LightweightChart 
                  type="line"
                  data={stakedRstbChartData} 
                  height={100}
                  theme="light"
                  autoSize={true}
                />
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#4CAF50' }}></span>
                  <span>sSTB Staked</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#2196F3' }}></span>
                  <span>rSTB Staked</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedMetric === 'unlocked' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h4>sSTB Unlocked</h4>
              <LightweightChart 
                type="line"
                data={sstbUnlockedChartData} 
                height={200}
                theme="light"
                autoSize={true}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h4>rSTB Unlocked</h4>
              <LightweightChart 
                type="line"
                data={rstbUnlockedChartData} 
                height={200}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
        )}
        
        {selectedMetric === 'roi' && (
          <div className={styles.singleChart}>
            <h4>Provider ROI</h4>
            <LightweightChart 
              type="line"
              data={roiChartData} 
              height={300}
              theme="light"
              autoSize={true}
            />
          </div>
        )}
        
        {selectedMetric === 'revenue' && (
          <div className={styles.singleChart}>
            <h4>Monthly Revenue</h4>
            <LightweightChart 
              type="line"
              data={revenueChartData} 
              height={300}
              theme="light"
              autoSize={true}
            />
          </div>
        )}
      </div>
      
      <div className={styles.paramInfo}>
        <p>
          <strong>Parameter:</strong> {getParameterOptions().find(p => p.value === selectedParam)?.label || selectedParam}
        </p>
        <p>
          <strong>Current Value:</strong> {
            selectedCategory === 'systemParameters' ? String(parameters.systemParameters[selectedParam as keyof typeof parameters.systemParameters]) :
            selectedCategory === 'marketDynamics' ? String(parameters.marketDynamics[selectedParam as keyof typeof parameters.marketDynamics]) :
            selectedCategory === 'feeStructure' ? String(parameters.feeStructure[selectedParam as keyof typeof parameters.feeStructure]) :
            String(parameters.providerEconomics[selectedParam as keyof typeof parameters.providerEconomics])
          }
        </p>
      </div>

      {selectedMetric === 'unlocks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Impact on sSTB Unlocks</h4>
            <div className={styles.chart} style={{ height: '200px' }}>
              <LightweightChart
                type="area"
                data={sstbUnlockedChartData}
                height={200}
                title={`sSTB Unlocked vs ${selectedParam}`}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Impact on rSTB Unlocks</h4>
            <div className={styles.chart} style={{ height: '200px' }}>
              <LightweightChart
                type="area"
                data={rstbUnlockedChartData}
                height={200}
                title={`rSTB Unlocked vs ${selectedParam}`}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
        </div>
      )}
      
      {selectedMetric === 'tvl' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Impact on Stability Score</h4>
            <div className={styles.chart} style={{ height: '200px' }}>
              <LightweightChart
                type="line"
                data={stabilityChartData}
                height={200}
                title={`Stability vs ${selectedParam}`}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Impact on TVL</h4>
            <div className={styles.chart} style={{ height: '200px' }}>
              <LightweightChart
                type="area"
                data={tvlChartData}
                height={200}
                title={`TVL vs ${selectedParam}`}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className={styles.metric}>
          <h4>Optimal {selectedParam} Value</h4>
          <div className={styles.metricValue}>
            {analysisResults.length > 0 ? 
              analysisResults.reduce((prev, current) => 
                (prev.metrics.sstbStability > current.metrics.sstbStability) ? prev : current
              ).paramValue.toFixed(3) : 'N/A'}
            <div className={styles.metricSubtext}>For maximum stability</div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Max rSTB Growth</h4>
          <div className={styles.metricValue}>
            ${analysisResults.length > 0 ? 
              Math.max(...analysisResults.map(r => r.metrics.rstbPrice)).toFixed(3) : 'N/A'}
            <div className={styles.metricSubtext}>Growth token appreciation</div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Max Staked CU %</h4>
          <div className={styles.metricValue}>
            {analysisResults.length > 0 ? 
              Math.max(...analysisResults.map(r => r.metrics.stakedCU / r.metrics.totalCU * 100)).toFixed(1) : 'N/A'}%
            <div className={styles.metricSubtext}>Of total CU supply</div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Max Token Unlock %</h4>
          <div className={styles.metricValue}>
            {analysisResults.length > 0 ? 
              Math.max(...analysisResults.map(r => 
                (r.metrics.sstbUnlocked + r.metrics.rstbUnlocked) / 
                (r.metrics.circulatingSstb + r.metrics.circulatingRstb) * 100
              )).toFixed(1) : 'N/A'}%
            <div className={styles.metricSubtext}>Of total token supply</div>
          </div>
        </div>
      </div>
    </div>
  );
} 