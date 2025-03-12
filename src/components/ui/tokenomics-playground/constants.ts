import { TokenomicsParameters } from './index';

// Default parameters for the tokenomics playground
export const defaultParameters: TokenomicsParameters = {
  systemParameters: {
    initialCUGrowth: 0.15,
    monthlyGrowthRate: 0.08,
    milestone1Month: 12
  },
  marketDynamics: {
    priceSensitivity: 1.2,
    demandElasticity: 0.8,
    collateralRatio: 1.5 // Target collateral ratio of 150%
  },
  feeStructure: {
    transactionFee: 0.01, // 1%
    bridgeFee: 0.005, // 0.5%
    stakingRewardRate: 0.03 // 3% monthly staking rewards
  },
  providerEconomics: {
    setupCost: 10000,
    monthlyOpEx: 1000,
    providerType: 'Medium'
  }
};

// Predefined scenarios
export interface Scenario {
  name: string;
  description: string;
  parameters: Partial<TokenomicsParameters>;
  outcomes: {
    cuTarget: number;
    stbPrice: number;
    tvl: number;
    timeline?: string;
  };
}

export const scenarios: Record<string, Scenario> = {
  computeRevolution: {
    name: "Compute Revolution",
    description: "Rapid growth in compute demand drives system expansion",
    parameters: {
      systemParameters: {
        initialCUGrowth: 0.25,
        monthlyGrowthRate: 0.12,
        milestone1Month: 12
      },
      marketDynamics: {
        priceSensitivity: 0.8,
        demandElasticity: 1.2,
        collateralRatio: 1.8
      },
      feeStructure: {
        transactionFee: 0.01,
        bridgeFee: 0.005,
        stakingRewardRate: 0.04
      }
    },
    outcomes: {
      cuTarget: 20,
      stbPrice: 2.5,
      tvl: 150
    }
  },
  balancedAscent: {
    name: "Balanced Ascent",
    description: "Steady growth and stable tokenomics",
    parameters: {
      systemParameters: {
        initialCUGrowth: 0.15,
        monthlyGrowthRate: 0.08,
        milestone1Month: 12
      },
      marketDynamics: {
        priceSensitivity: 1.0,
        demandElasticity: 1.0,
        collateralRatio: 1.5
      },
      feeStructure: {
        transactionFee: 0.01,
        bridgeFee: 0.005,
        stakingRewardRate: 0.03
      }
    },
    outcomes: {
      cuTarget: 12,
      stbPrice: 1.8,
      tvl: 100
    }
  },
  cryptoWinter: {
    name: "Crypto Winter",
    description: "Challenging market conditions with reduced growth",
    parameters: {
      systemParameters: {
        initialCUGrowth: 0.08,
        monthlyGrowthRate: 0.04,
        milestone1Month: 12
      },
      marketDynamics: {
        priceSensitivity: 1.8,
        demandElasticity: 0.6,
        collateralRatio: 2.0
      },
      feeStructure: {
        transactionFee: 0.01,
        bridgeFee: 0.005,
        stakingRewardRate: 0.02
      }
    },
    outcomes: {
      cuTarget: 5,
      stbPrice: 0.9,
      tvl: 40
    }
  },
  providerGoldRush: {
    name: "Provider Gold Rush",
    description: "High provider participation drives CU growth",
    parameters: {
      systemParameters: {
        initialCUGrowth: 0.2,
        monthlyGrowthRate: 0.1,
        milestone1Month: 12
      },
      marketDynamics: {
        priceSensitivity: 1.2,
        demandElasticity: 1.1,
        collateralRatio: 1.4
      },
      feeStructure: {
        transactionFee: 0.01,
        bridgeFee: 0.005,
        stakingRewardRate: 0.035
      },
      providerEconomics: {
        setupCost: 8000,
        monthlyOpEx: 800,
        providerType: 'Medium'
      }
    },
    outcomes: {
      cuTarget: 18,
      stbPrice: 2.0,
      tvl: 120
    }
  },
  regulatoryReckoning: {
    name: "Regulatory Reckoning",
    description: "Increased compliance costs affect fee structure",
    parameters: {
      feeStructure: {
        transactionFee: 0.015,
        bridgeFee: 0.01,
        stakingRewardRate: 0.025
      },
      systemParameters: {
        initialCUGrowth: 0.15,
        monthlyGrowthRate: 0.06,
        milestone1Month: 12
      },
      marketDynamics: {
        priceSensitivity: 1.3,
        demandElasticity: 0.7,
        collateralRatio: 1.7
      }
    },
    outcomes: {
      cuTarget: 10,
      stbPrice: 1.5,
      tvl: 80
    }
  }
}; 