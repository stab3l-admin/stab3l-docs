"use client";

import React, { useMemo, useState } from 'react';
import styles from '../tokenomics-playground.module.css';
import { TokenomicsMetrics } from '../index';
import LightweightChart, { ChartData } from './LightweightChart';
import { Time } from 'lightweight-charts';
import { createSeededRandom } from '../calculations';

interface ForecastingEngineProps {
  metrics: TokenomicsMetrics;
  timeframe: number;
}

export default function ForecastingEngine({ metrics, timeframe }: ForecastingEngineProps) {
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'price' | 'supply' | 'unlocked' | 'staking' | 'tvl'>('price');

  // Generate dual token price projection data
  const tokenPriceProjectionData = useMemo(() => {
    // Create deterministic random generator based on metrics
    const seed = Object.values(metrics).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
    const seededRandom = createSeededRandom(seed);
    
    // sSTB price data - should show stability around $1
    const sstbData: ChartData[] = [];
    // rSTB price data - should show growth
    const rstbData: ChartData[] = [];
    
    // Always start from today's date
    const today = new Date();
    
    // Generate data points for each month in the timeframe
    for (let i = 0; i <= timeframe; i++) {
      // Create a date for this month
      const projectedDate = new Date(today);
      projectedDate.setMonth(today.getMonth() + i);
      
      // Format date as YYYY-MM-DD for proper chart display
      const year = projectedDate.getFullYear();
      const month = String(projectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(projectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}` as Time;
      
      // sSTB price projection - stable with small fluctuations around $1
      // Higher stability as time progresses (system matures)
      const stabilityFactor = Math.min(0.98, 0.8 + (i / timeframe * 0.18));
      
      // Calculate market volatility - increases slightly over time but remains controlled
      const marketVolatility = i === 0 ? metrics.marketVolatility : 
        Math.min(0.15, 0.05 + (i / timeframe * 0.1) * (seededRandom() * 0.5 + 0.5));
      
      // Apply smaller deviation with stronger reversion to $1 peg
      const sstbDeviation = (seededRandom() * 2 - 1) * 0.05 * (1 - stabilityFactor);
      
      // Start with the current price from metrics
      let projectedSstbPrice = i === 0 ? metrics.sstbPrice : sstbData[i-1].value;
      
      // Apply deviation with strong reversion to peg
      projectedSstbPrice = projectedSstbPrice + sstbDeviation;
      
      // Apply peg stabilization mechanism - stronger reversion to $1 as deviation increases
      const pegDeviation = Math.abs(projectedSstbPrice - 1.0);
      if (pegDeviation > 0.02) {
        // Stronger correction the further we are from $1
        const correctionFactor = 0.3 + (pegDeviation * 0.7);
        projectedSstbPrice = projectedSstbPrice > 1.0 
          ? projectedSstbPrice - (pegDeviation * correctionFactor * (1 - marketVolatility))
          : projectedSstbPrice + (pegDeviation * correctionFactor * (1 - marketVolatility));
      }
      
      // Ensure price stays within reasonable bounds
      projectedSstbPrice = Math.max(0.95, Math.min(1.05, projectedSstbPrice));
      
      // rSTB price projection - growth with some volatility
      // Growth accelerates as system adoption increases
      const growthFactor = 1 + (0.08 * i) + (seededRandom() * 0.04 - 0.01);
      const projectedRstbPrice = i === 0 ? metrics.rstbPrice : 
        rstbData[i-1].value * (1 + (0.02 * growthFactor * (1 + marketVolatility * 0.5)));
      
      // Ensure we don't have NaN or invalid values
      if (!isNaN(projectedSstbPrice) && isFinite(projectedSstbPrice)) {
        sstbData.push({
          time: formattedDate,
          value: projectedSstbPrice
        });
      }
      
      if (!isNaN(projectedRstbPrice) && isFinite(projectedRstbPrice)) {
        rstbData.push({
          time: formattedDate,
          value: projectedRstbPrice
        });
      }
    }
    
    console.log('Generated price data:', { sstbData, rstbData });
    
    return { sstbData, rstbData };
  }, [metrics, timeframe]);
  
  // Generate token supply data
  const tokenSupplyData = useMemo(() => {
    // Create deterministic random generator based on metrics
    const seed = Object.values(metrics).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0) + 1;
    const seededRandom = createSeededRandom(seed);
    
    // sSTB supply data
    const sstbSupplyData: ChartData[] = [];
    // rSTB supply data
    const rstbSupplyData: ChartData[] = [];
    // sSTB unlocked data
    const sstbUnlockedData: ChartData[] = [];
    // rSTB unlocked data
    const rstbUnlockedData: ChartData[] = [];
    
    // Always start from today's date
    const today = new Date();
    const initialSstbSupply = metrics.circulatingSstb;
    const initialRstbSupply = metrics.circulatingRstb;
    const initialSstbUnlocked = metrics.sstbUnlocked;
    const initialRstbUnlocked = metrics.rstbUnlocked;
    
    // Project token supplies over time
    for (let i = 0; i <= timeframe; i++) {
      // Create a date for this month
      const projectedDate = new Date(today);
      projectedDate.setMonth(today.getMonth() + i);
      
      // Format date as YYYY-MM-DD for proper chart display
      const year = projectedDate.getFullYear();
      const month = String(projectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(projectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}` as Time;
      
      // sSTB supply grows at controlled rate (governance decisions)
      // Slower growth to maintain stability
      const sstbEmissionFactor = 1 + (0.02 * Math.log(i + 1));
      const projectedSstbSupply = initialSstbSupply * sstbEmissionFactor;
      
      // rSTB supply grows with staking rewards and ecosystem growth
      // Faster growth in early months, then stabilizes
      const rstbEmissionFactor = 1 + (0.04 * Math.log(i + 1));
      const projectedRstbSupply = initialRstbSupply * rstbEmissionFactor;
      
      // Token unlocks follow vesting schedules
      // More tokens unlock in early months, then taper off
      const sstbUnlockRate = 0.05 * Math.exp(-0.02 * i) + 0.01;
      const rstbUnlockRate = 0.08 * Math.exp(-0.03 * i) + 0.01;
      
      const projectedSstbUnlocked = initialSstbUnlocked + (projectedSstbSupply * sstbUnlockRate * i);
      const projectedRstbUnlocked = initialRstbUnlocked + (projectedRstbSupply * rstbUnlockRate * i);
      
      // Ensure we don't have NaN or invalid values
      if (!isNaN(projectedSstbSupply) && isFinite(projectedSstbSupply)) {
        sstbSupplyData.push({
          time: formattedDate,
          value: projectedSstbSupply
        });
      }
      
      if (!isNaN(projectedRstbSupply) && isFinite(projectedRstbSupply)) {
        rstbSupplyData.push({
          time: formattedDate,
          value: projectedRstbSupply
        });
      }
      
      if (!isNaN(projectedSstbUnlocked) && isFinite(projectedSstbUnlocked)) {
        sstbUnlockedData.push({
          time: formattedDate,
          value: projectedSstbUnlocked
        });
      }
      
      if (!isNaN(projectedRstbUnlocked) && isFinite(projectedRstbUnlocked)) {
        rstbUnlockedData.push({
          time: formattedDate,
          value: projectedRstbUnlocked
        });
      }
    }
    
    return { sstbSupplyData, rstbSupplyData, sstbUnlockedData, rstbUnlockedData };
  }, [metrics, timeframe]);
  
  // Generate staking data
  const stakingData = useMemo(() => {
    // Create deterministic random generator based on metrics
    const seed = Object.values(metrics).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0) + 2;
    const seededRandom = createSeededRandom(seed);
    
    // CU staking data
    const cuStakingData: ChartData[] = [];
    // sSTB staking data
    const sstbStakingData: ChartData[] = [];
    // rSTB staking data
    const rstbStakingData: ChartData[] = [];
    
    // Always start from today's date
    const today = new Date();
    const initialStakedCU = metrics.stakedCU;
    const initialStakedSstb = metrics.stakedSstb;
    const initialStakedRstb = metrics.stakedRstb;
    
    // Project staking metrics over time
    for (let i = 0; i <= timeframe; i++) {
      // Create a date for this month
      const projectedDate = new Date(today);
      projectedDate.setMonth(today.getMonth() + i);
      
      // Format date as YYYY-MM-DD for proper chart display
      const year = projectedDate.getFullYear();
      const month = String(projectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(projectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}` as Time;
      
      // CU staking grows as system matures
      // Higher growth in early months, then stabilizes
      const cuGrowthFactor = 1 + (0.05 * Math.log(i + 2));
      const projectedStakedCU = initialStakedCU * cuGrowthFactor;
      
      // sSTB staking grows with stability and incentives
      const sstbStakingFactor = 1 + (0.02 * Math.log(i + 2));
      const projectedStakedSstb = initialStakedSstb * sstbStakingFactor;
      
      // rSTB staking grows with price appreciation
      const rstbStakingFactor = 1 + (0.03 * Math.log(i + 2));
      const projectedStakedRstb = initialStakedRstb * rstbStakingFactor;
      
      // Ensure we don't have NaN or invalid values
      if (!isNaN(projectedStakedCU) && isFinite(projectedStakedCU)) {
        cuStakingData.push({
          time: formattedDate,
          value: projectedStakedCU
        });
      }
      
      if (!isNaN(projectedStakedSstb) && isFinite(projectedStakedSstb)) {
        sstbStakingData.push({
          time: formattedDate,
          value: projectedStakedSstb
        });
      }
      
      if (!isNaN(projectedStakedRstb) && isFinite(projectedStakedRstb)) {
        rstbStakingData.push({
          time: formattedDate,
          value: projectedStakedRstb
        });
      }
    }
    
    return { cuStakingData, sstbStakingData, rstbStakingData };
  }, [metrics, timeframe]);
  
  // Generate TVL projection data
  const tvlData = useMemo(() => {
    // Create deterministic random generator based on metrics
    const seed = Object.values(metrics).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0) + 3;
    const seededRandom = createSeededRandom(seed);
    
    const tvlChartData: ChartData[] = [];
    
    // Always start from today's date
    const today = new Date();
    const initialTvl = metrics.tvl;
    
    // Project TVL over time
    for (let i = 0; i <= timeframe; i++) {
      // Create a date for this month
      const projectedDate = new Date(today);
      projectedDate.setMonth(today.getMonth() + i);
      
      // Format date as YYYY-MM-DD for proper chart display
      const year = projectedDate.getFullYear();
      const month = String(projectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(projectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}` as Time;
      
      // TVL grows faster in early months, then growth rate stabilizes
      // This models S-curve adoption
      const growthRate = 0.15 * Math.exp(-i / (timeframe * 0.3)) + 0.02;
      const randomFactor = 1 + (seededRandom() * 0.04 - 0.02); // Small random variation
      const projectedTvl = i === 0 ? initialTvl : tvlChartData[i-1].value * (1 + growthRate) * randomFactor;
      
      // Ensure we don't have NaN or invalid values
      if (!isNaN(projectedTvl) && isFinite(projectedTvl)) {
        tvlChartData.push({
          time: formattedDate,
          value: projectedTvl
        });
      }
    }
    
    return tvlChartData;
  }, [metrics, timeframe]);
  
  // Calculate market cap projections
  const marketCapProjection = useMemo(() => {
    if (tokenPriceProjectionData.sstbData.length === 0 || tokenSupplyData.sstbSupplyData.length === 0) {
      return { sstbMarketCap: 0, rstbMarketCap: 0, totalMarketCap: 0 };
    }
    
    // Get projected prices and supplies at the end of the timeframe
    const projectedSstbPrice = tokenPriceProjectionData.sstbData[tokenPriceProjectionData.sstbData.length - 1].value;
    const projectedRstbPrice = tokenPriceProjectionData.rstbData[tokenPriceProjectionData.rstbData.length - 1].value;
    const projectedSstbSupply = tokenSupplyData.sstbSupplyData[tokenSupplyData.sstbSupplyData.length - 1].value;
    const projectedRstbSupply = tokenSupplyData.rstbSupplyData[tokenSupplyData.rstbSupplyData.length - 1].value;
    
    // Calculate market caps
    const sstbMarketCap = projectedSstbPrice * projectedSstbSupply;
    const rstbMarketCap = projectedRstbPrice * projectedRstbSupply;
    const totalMarketCap = sstbMarketCap + rstbMarketCap;
    
    return { sstbMarketCap, rstbMarketCap, totalMarketCap };
  }, [tokenPriceProjectionData, tokenSupplyData]);

  return (
    <div className={styles.forecastingEngine}>
      <div className={styles.forecastingTabs}>
        <button 
          className={`${styles.forecastingTab} ${activeTab === 'price' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('price')}
        >
          Token Price
        </button>
        <button 
          className={`${styles.forecastingTab} ${activeTab === 'supply' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('supply')}
        >
          Token Supply
        </button>
        <button 
          className={`${styles.forecastingTab} ${activeTab === 'unlocked' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('unlocked')}
        >
          Token Unlocks
        </button>
        <button 
          className={`${styles.forecastingTab} ${activeTab === 'staking' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('staking')}
        >
          Staking
        </button>
        <button 
          className={`${styles.forecastingTab} ${activeTab === 'tvl' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tvl')}
        >
          TVL
        </button>
      </div>
      
      <div className={styles.chartContainer}>
        {activeTab === 'price' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h3>sSTB Price</h3>
              {tokenPriceProjectionData.sstbData.length > 0 ? (
                <LightweightChart 
                  key={`sstb-price-${timeframe}`}
                  type="line"
                  data={tokenPriceProjectionData.sstbData} 
                  height={300}
                  title="sSTB Price"
                  theme="light"
                  autoSize={true}
                />
              ) : (
                <div className={styles.noDataMessage}>No price data available</div>
              )}
            </div>
            <div className={styles.chartWrapper}>
              <h3>rSTB Price</h3>
              {tokenPriceProjectionData.rstbData.length > 0 ? (
                <LightweightChart 
                  key={`rstb-price-${timeframe}`}
                  type="line"
                  data={tokenPriceProjectionData.rstbData} 
                  height={300}
                  title="rSTB Price"
                  theme="light"
                  autoSize={true}
                />
              ) : (
                <div className={styles.noDataMessage}>No price data available</div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'supply' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h3>sSTB Supply</h3>
              <LightweightChart 
                key={`sstb-supply-${timeframe}`}
                type="area"
                data={tokenSupplyData.sstbSupplyData} 
                height={300}
                theme="light"
                autoSize={true}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h3>rSTB Supply</h3>
              <LightweightChart 
                key={`rstb-supply-${timeframe}`}
                type="area"
                data={tokenSupplyData.rstbSupplyData} 
                height={300}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'unlocked' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h3>sSTB Unlocked</h3>
              <LightweightChart 
                key={`sstb-unlocked-${timeframe}`}
                type="area"
                data={tokenSupplyData.sstbUnlockedData} 
                height={300}
                theme="light"
                autoSize={true}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h3>rSTB Unlocked</h3>
              <LightweightChart 
                key={`rstb-unlocked-${timeframe}`}
                type="area"
                data={tokenSupplyData.rstbUnlockedData} 
                height={300}
                theme="light"
                autoSize={true}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'staking' && (
          <div className={styles.dualChart}>
            <div className={styles.chartWrapper}>
              <h3>CU Staked</h3>
              <LightweightChart 
                key={`cu-staked-${timeframe}`}
                type="area"
                data={stakingData.cuStakingData} 
                height={300}
                theme="light"
                autoSize={true}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h3>Token Staking</h3>
              <div className={styles.multiChartContainer}>
                <LightweightChart 
                  key={`sstb-staked-${timeframe}`}
                  type="area"
                  data={stakingData.sstbStakingData} 
                  height={150}
                  theme="light"
                  autoSize={true}
                />
                <LightweightChart 
                  key={`rstb-staked-${timeframe}`}
                  type="area"
                  data={stakingData.rstbStakingData} 
                  height={150}
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
        
        {activeTab === 'tvl' && (
          <div className={styles.singleChart}>
            <h3>Total Value Locked</h3>
            <LightweightChart 
              key={`tvl-${timeframe}`}
              type="area"
              data={tvlData} 
              height={400}
              theme="light"
              autoSize={true}
            />
          </div>
        )}
      </div>
    </div>
  );
} 