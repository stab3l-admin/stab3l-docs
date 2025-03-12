"use client";

import React, { useState, useEffect } from 'react';
import styles from './tokenomics-playground.module.css';
import CommandCenter from './components/CommandCenter';
import ParameterControls from './components/ParameterControls';
import ForecastingEngine from './components/ForecastingEngine';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import { calculateMetrics, applyScenario, runSensitivityAnalysis } from './calculations';
import { defaultParameters, scenarios } from './constants';

// Define interfaces for our types
export interface TokenomicsParameters {
  systemParameters: {
    initialCUGrowth: number;
    monthlyGrowthRate: number;
    milestone1Month: number;
  };
  marketDynamics: {
    priceSensitivity: number;
    demandElasticity: number;
    collateralRatio: number;
  };
  feeStructure: {
    transactionFee: number;
    bridgeFee: number;
    stakingRewardRate: number;
  };
  providerEconomics: {
    setupCost: number;
    monthlyOpEx: number;
    providerType: string;
  };
}

export interface TokenomicsMetrics {
  totalCU: number;
  circulatingRstb: number;
  circulatingSstb: number;
  sstbPrice: number;
  rstbPrice: number;
  treasuryAssets: number;
  tvl: number;
  cumulativeRevenue: number;
  monthlyRevenue: number;
  providerCount: number;
  providerROI: number;
  sstbStability: number;
  marketVolatility: number;
  timestamp: Date;
  stakedCU: number;
  stakedSstb: number;
  stakedRstb: number;
  sstbUnlocked: number;
  rstbUnlocked: number;
}

export default function TokenomicsPlayground() {
  const [parameters, setParameters] = useState<TokenomicsParameters>(defaultParameters);
  const [timeframe, setTimeframe] = useState<number>(12); // Default to 12 months
  const [metrics, setMetrics] = useState<TokenomicsMetrics>(calculateMetrics(parameters, timeframe));
  const [currentScenario, setCurrentScenario] = useState<string>("balancedAscent");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);

  // Update metrics when parameters or timeframe change
  useEffect(() => {
    setMetrics(calculateMetrics(parameters, timeframe));
  }, [parameters, timeframe]);

  // Handle parameter changes
  const handleParameterChange = (category: string, name: string, value: number | string) => {
    setParameters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof TokenomicsParameters],
        [name]: value
      }
    }));
  };

  // Handle scenario selection
  const handleScenarioSelect = (scenarioKey: string) => {
    const newParameters = applyScenario(scenarioKey);
    setParameters(newParameters);
    setCurrentScenario(scenarioKey);
  };

  // Handle sensitivity analysis
  const handleSensitivityAnalysis = (paramCategory: string, paramName: string, range: number) => {
    return runSensitivityAnalysis(paramCategory, paramName, range);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Increase font size
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  // Decrease font size
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  if (!metrics) {
    return <div className={styles.playground}>Loading playground...</div>;
  }

  return (
    <div className={`${styles.playground} ${isDarkMode ? 'dark' : ''}`} style={{ fontSize: `${fontSize}px` }}>
      <div className={styles.header}>
        <div>
          <h1>STAB3L Tokenomics Playground</h1>
          <p>Explore different scenarios and parameters to analyze their impact on the STAB3L ecosystem</p>
        </div>
        <div className={styles.headerControls}>
          <div className={styles.fontSizeControl}>
            <button 
              className={styles.fontSizeButton} 
              onClick={decreaseFontSize}
              aria-label="Decrease font size"
            >
              -
            </button>
            <span>{fontSize}px</span>
            <button 
              className={styles.fontSizeButton} 
              onClick={increaseFontSize}
              aria-label="Increase font size"
            >
              +
            </button>
          </div>
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
      
      <div className={styles.playgroundContainer}>
        <div className={styles.topSection}>
          <div className={styles.timeControl}>
            <h3>Time Control</h3>
            <div className="flex items-center gap-4 w-full">
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={timeframe}
                onChange={(e) => setTimeframe(parseInt(e.target.value))}
                className={styles.slider}
              />
              <span className="text-sm font-medium min-w-[80px]">{timeframe} months</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Scenario</h3>
            <div className={styles.scenarioOptions}>
              {Object.entries(scenarios).map(([key, scenario]) => (
                <div
                  key={key}
                  className={`${styles.scenarioOption} ${currentScenario === key ? styles.scenarioOptionActive : ''}`}
                  onClick={() => handleScenarioSelect(key)}
                  title={scenario.description}
                >
                  {scenario.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.contentLayout}>
          <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
            <button 
              className={styles.sidebarToggle} 
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
            
            {!sidebarCollapsed && (
              <>
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Parameter Controls</h3>
                <ParameterControls 
                  parameters={parameters} 
                  onParameterChange={handleParameterChange} 
                />
              </>
            )}
          </div>
          
          <div className={styles.mainContent}>
            <CommandCenter 
              metrics={metrics} 
              timeframe={timeframe} 
            />
            
            <div className={styles.contentPanels}>
              <ForecastingEngine 
                metrics={metrics} 
                timeframe={timeframe} 
              />
              <SensitivityAnalysis 
                parameters={parameters} 
                metrics={metrics}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <img src="/stab3l-logo.svg" alt="STAB3L" className={styles.logo} />
        <span>STAB3L Tokenomics Playground v1.0</span>
      </div>
    </div>
  );
} 