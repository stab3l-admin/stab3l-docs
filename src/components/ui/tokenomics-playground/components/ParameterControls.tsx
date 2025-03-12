"use client";

import React from 'react';
import styles from '../tokenomics-playground.module.css';
import { TokenomicsParameters } from '../index';

interface ParameterControlsProps {
  parameters: TokenomicsParameters;
  onParameterChange: (section: keyof TokenomicsParameters, param: string, value: number) => void;
}

export default function ParameterControls({ parameters, onParameterChange }: ParameterControlsProps) {
  return (
    <div className={styles.panel}>
      <h3>Parameter Controls</h3>
      
      <div className={styles.parameterGroup}>
        <h4>System Parameters</h4>
        
        <div className={styles.parameter}>
          <label htmlFor="initialCUGrowth">Initial CU Growth:</label>
          <input
            id="initialCUGrowth"
            type="number"
            min="0.01"
            max="0.5"
            step="0.01"
            value={parameters.systemParameters.initialCUGrowth}
            onChange={(e) => onParameterChange('systemParameters', 'initialCUGrowth', parseFloat(e.target.value))}
          />
        </div>
        
        <div className={styles.parameter}>
          <label htmlFor="monthlyGrowthRate">Monthly Growth Rate:</label>
          <input
            id="monthlyGrowthRate"
            type="number"
            min="0.01"
            max="0.3"
            step="0.01"
            value={parameters.systemParameters.monthlyGrowthRate}
            onChange={(e) => onParameterChange('systemParameters', 'monthlyGrowthRate', parseFloat(e.target.value))}
          />
        </div>
        
        <div className={styles.parameter}>
          <label htmlFor="milestone1Month">Milestone 1 Month:</label>
          <input
            id="milestone1Month"
            type="number"
            min="1"
            max="48"
            step="1"
            value={parameters.systemParameters.milestone1Month}
            onChange={(e) => onParameterChange('systemParameters', 'milestone1Month', parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className={styles.parameterGroup}>
        <h4>Market Dynamics</h4>
        
        <div className={styles.parameter}>
          <label htmlFor="priceSensitivity">Price Sensitivity:</label>
          <input
            id="priceSensitivity"
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={parameters.marketDynamics.priceSensitivity}
            onChange={(e) => onParameterChange('marketDynamics', 'priceSensitivity', parseFloat(e.target.value))}
          />
        </div>
        
        <div className={styles.parameter}>
          <label htmlFor="demandElasticity">Demand Elasticity:</label>
          <input
            id="demandElasticity"
            type="number"
            min="0.1"
            max="2"
            step="0.1"
            value={parameters.marketDynamics.demandElasticity}
            onChange={(e) => onParameterChange('marketDynamics', 'demandElasticity', parseFloat(e.target.value))}
          />
        </div>
      </div>
      
      <div className={styles.parameterGroup}>
        <h4>Fee Structure</h4>
        
        <div className={styles.parameter}>
          <label htmlFor="transactionFee">Transaction Fee (%):</label>
          <input
            id="transactionFee"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={parameters.feeStructure.transactionFee * 100}
            onChange={(e) => onParameterChange('feeStructure', 'transactionFee', parseFloat(e.target.value) / 100)}
          />
        </div>
        
        <div className={styles.parameter}>
          <label htmlFor="bridgeFee">Bridge Fee (%):</label>
          <input
            id="bridgeFee"
            type="number"
            min="0"
            max="2"
            step="0.05"
            value={parameters.feeStructure.bridgeFee * 100}
            onChange={(e) => onParameterChange('feeStructure', 'bridgeFee', parseFloat(e.target.value) / 100)}
          />
        </div>
      </div>
      
      <div className={styles.parameterGroup}>
        <h4>Provider Economics</h4>
        
        <div className={styles.parameter}>
          <label htmlFor="setupCost">Setup Cost ($):</label>
          <input
            id="setupCost"
            type="number"
            min="0"
            max="100000"
            step="1000"
            value={parameters.providerEconomics.setupCost}
            onChange={(e) => onParameterChange('providerEconomics', 'setupCost', parseFloat(e.target.value))}
          />
        </div>
        
        <div className={styles.parameter}>
          <label htmlFor="monthlyOpEx">Monthly OpEx ($):</label>
          <input
            id="monthlyOpEx"
            type="number"
            min="0"
            max="10000"
            step="100"
            value={parameters.providerEconomics.monthlyOpEx}
            onChange={(e) => onParameterChange('providerEconomics', 'monthlyOpEx', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
} 