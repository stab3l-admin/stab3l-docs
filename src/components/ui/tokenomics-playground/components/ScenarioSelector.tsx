"use client";

import React from 'react';
import styles from '../tokenomics-playground.module.css';
import { scenarios } from '../constants';

interface ScenarioSelectorProps {
  currentScenario: string;
  onScenarioSelect: (scenarioKey: string) => void;
}

export default function ScenarioSelector({ currentScenario, onScenarioSelect }: ScenarioSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Scenario</h3>
      <div className={styles.scenarioOptions}>
        {Object.entries(scenarios).map(([key, scenario]) => (
          <div
            key={key}
            className={`${styles.scenarioOption} ${currentScenario === key ? styles.scenarioOptionActive : ''}`}
            onClick={() => onScenarioSelect(key)}
            title={scenario.description}
          >
            {scenario.name}
          </div>
        ))}
      </div>
    </div>
  );
} 