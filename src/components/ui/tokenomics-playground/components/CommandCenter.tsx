"use client";

import React, { useMemo } from 'react';
import styles from '../tokenomics-playground.module.css';
import { TokenomicsMetrics } from '../index';
import LightweightChart, { ChartData, CandlestickChartData } from './LightweightChart';
import { Time } from 'lightweight-charts';

interface CommandCenterProps {
  metrics: TokenomicsMetrics;
  timeframe: number;
}

export default function CommandCenter({ metrics, timeframe }: CommandCenterProps) {
  // Generate candlestick data for the trading view
  const candlestickData = useMemo(() => {
    const data: CandlestickChartData[] = [];
    const currentDate = new Date();
    const basePrice = metrics.rstbPrice; // Using rSTB price for growth token chart
    
    // Generate 30 days of candlestick data
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // Create some realistic price movements with volatility based on the metrics
      const volatility = 0.05 * (1 + metrics.providerROI); // Higher volatility for rSTB
      const dayVolatility = Math.random() * volatility;
      
      const open = i === 30 ? basePrice * 0.9 : data[data.length - 1].close;
      const close = open * (1 + (Math.random() * 0.1 - 0.03)); // Bias toward growth
      const high = Math.max(open, close) * (1 + dayVolatility);
      const low = Math.min(open, close) * (1 - dayVolatility);
      
      // Format date as YYYY-MM-DD for proper chart display
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}` as Time;
      
      data.push({
        time: formattedDate,
        open,
        high,
        low,
        close
      });
    }
    
    return data;
  }, [metrics.rstbPrice, metrics.providerROI]);
  
  // Generate sSTB price data to show stability
  const sstbPriceData = useMemo(() => {
    const data: ChartData[] = [];
    const currentDate = new Date();
    const basePrice = 1.0; // sSTB targets $1
    
    // Generate 30 days of price data
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // Create minimal volatility for sSTB to show stability
      // Use the stability score to determine how close to $1 it stays
      const stabilityFactor = metrics.sstbStability / 100;
      const maxDeviation = 0.1 * (1 - stabilityFactor);
      const deviation = (Math.random() * 2 - 1) * maxDeviation;
      
      // Price stays close to $1 based on stability score
      const price = basePrice * (1 + deviation);
      
      // Format date as YYYY-MM-DD for proper chart display
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}` as Time;
      
      data.push({
        time: formattedDate,
        value: price
      });
    }
    
    return data;
  }, [metrics.sstbStability]);
  
  // Calculate price change percentage for rSTB
  const rstbPriceChange = useMemo(() => {
    if (candlestickData.length < 2) return 0;
    const firstPrice = candlestickData[0].close;
    const lastPrice = candlestickData[candlestickData.length - 1].close;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  }, [candlestickData]);
  
  // Calculate stability percentage for sSTB
  const sstbStabilityPercentage = useMemo(() => {
    return metrics.sstbStability;
  }, [metrics.sstbStability]);
  
  // Generate line chart data from candlestick data
  const lineChartData = useMemo(() => {
    return candlestickData.map(item => ({
      time: item.time,
      value: item.close
    }));
  }, [candlestickData]);
  
  return (
    <div className={styles.panel}>
      <h3>Command Center</h3>
      
      <div className={styles.tradingView}>
        <div className={styles.tradingViewHeader}>
          <div className={styles.tradingViewTitle}>STAB3L Token Performance</div>
        </div>
        
        <div className={styles.tradingViewTabs}>
          <div className={`${styles.tradingViewTab} ${styles.tradingViewTabActive}`}>rSTB/USDC</div>
          <div className={styles.tradingViewTab}>sSTB/USDC</div>
          <div className={styles.tradingViewTab}>1d</div>
          <div className={styles.tradingViewTab}>1w</div>
          <div className={styles.tradingViewTab}>1m</div>
          <div className={styles.tradingViewTab}>All</div>
        </div>
        
        <div className={`${styles.tradingViewPrice} ${rstbPriceChange < 0 ? styles.tradingViewPriceDown : ''}`}>
          rSTB: ${metrics.rstbPrice.toFixed(3)} {rstbPriceChange >= 0 ? '+' : ''}{rstbPriceChange.toFixed(2)}%
        </div>
        
        <div className={styles.tradingViewVolume}>
          24h Volume: {(metrics.totalCU * 0.1).toFixed(2)}M USDC | Market Volatility: {(metrics.marketVolatility * 100).toFixed(1)}%
        </div>
        
        <div className={styles.tradingViewChartControls}>
          <div className={`${styles.tradingViewControl} ${styles.tradingViewControlActive}`}>CANDLE</div>
          <div className={styles.tradingViewControl}>LINE</div>
          <div className={styles.tradingViewControl}>AREA</div>
          <div className={styles.tradingViewControl}>LOG</div>
        </div>
        
        <div className={styles.commandChart}>
          <LightweightChart
            type="line"
            data={lineChartData}
            height={300}
            theme="light"
            autoSize={true}
            title="rSTB Growth Token"
          />
        </div>
        
        <div className={styles.tradingViewChartControls}>
          <div className={styles.tradingViewControl}>INDICATOR</div>
          <div className={styles.tradingViewControl}>VOL</div>
        </div>
      </div>
      
      <div className={styles.stabilityChart}>
        <h4>sSTB Stability Demonstration</h4>
        <div style={{ height: '150px', marginBottom: '10px' }}>
          <LightweightChart
            type="line"
            data={sstbPriceData}
            height={150}
            theme="light"
            autoSize={true}
            title="sSTB Stable Token ($1 Target)"
          />
        </div>
        <div className={styles.stabilityMeter}>
          <div className={styles.stabilityLabel}>Stability Score:</div>
          <div className={styles.stabilityBarContainer}>
            <div 
              className={styles.stabilityBar} 
              style={{ 
                width: `${sstbStabilityPercentage}%`,
                backgroundColor: sstbStabilityPercentage > 90 ? '#4CAF50' : 
                                sstbStabilityPercentage > 75 ? '#8BC34A' : 
                                sstbStabilityPercentage > 60 ? '#FFEB3B' : 
                                sstbStabilityPercentage > 40 ? '#FF9800' : '#F44336'
              }}
            ></div>
          </div>
          <div className={styles.stabilityValue}>{sstbStabilityPercentage.toFixed(1)}%</div>
        </div>
      </div>
      
      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <h4>sSTB Price</h4>
          <div className={styles.metricValue}>
            ${metrics.sstbPrice.toFixed(3)}
            <div className={styles.metricSubtext}>Target: $1.00</div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>rSTB Price</h4>
          <div className={styles.metricValue}>
            ${metrics.rstbPrice.toFixed(3)}
            <div className={styles.metricSubtext}>Growth Token</div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Total CU</h4>
          <div className={styles.metricValue}>
            {(metrics.totalCU / 1000000).toFixed(2)}M
            <div className={styles.metricSubtext}>
              {((metrics.stakedCU / metrics.totalCU) * 100).toFixed(1)}% Staked
            </div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>TVL</h4>
          <div className={styles.metricValue}>
            ${(metrics.tvl / 1000000).toFixed(2)}M
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Treasury</h4>
          <div className={styles.metricValue}>
            ${(metrics.treasuryAssets / 1000000).toFixed(2)}M
            <div className={styles.metricSubtext}>Backing sSTB</div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Collateral Ratio</h4>
          <div className={styles.metricValue}>
            {(metrics.treasuryAssets / (metrics.circulatingSstb * metrics.sstbPrice) * 100).toFixed(0)}%
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Monthly Revenue</h4>
          <div className={styles.metricValue}>
            ${(metrics.monthlyRevenue / 1000).toFixed(2)}K
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>Provider ROI</h4>
          <div className={styles.metricValue}>
            {(metrics.providerROI * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>rSTB Supply</h4>
          <div className={styles.metricValue}>
            {(metrics.circulatingRstb / 1000000).toFixed(2)}M
            <div className={styles.metricSubtext}>
              {((metrics.rstbUnlocked / 1000000000) * 100).toFixed(1)}% Unlocked
            </div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>sSTB Supply</h4>
          <div className={styles.metricValue}>
            {(metrics.circulatingSstb / 1000000).toFixed(2)}M
            <div className={styles.metricSubtext}>
              {((metrics.sstbUnlocked / 10000000000) * 100).toFixed(1)}% Unlocked
            </div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>rSTB Staked</h4>
          <div className={styles.metricValue}>
            {(metrics.stakedRstb / 1000000).toFixed(2)}M
            <div className={styles.metricSubtext}>
              {((metrics.stakedRstb / metrics.circulatingRstb) * 100).toFixed(1)}% of Supply
            </div>
          </div>
        </div>
        
        <div className={styles.metric}>
          <h4>sSTB Staked</h4>
          <div className={styles.metricValue}>
            {(metrics.stakedSstb / 1000000).toFixed(2)}M
            <div className={styles.metricSubtext}>
              {((metrics.stakedSstb / metrics.circulatingSstb) * 100).toFixed(1)}% of Supply
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 