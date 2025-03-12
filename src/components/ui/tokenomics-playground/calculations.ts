import { TokenomicsParameters, TokenomicsMetrics } from './index';
import { defaultParameters, scenarios } from './constants';

// Token supply constants based on tokenomics.md
const SSTB_TOTAL_SUPPLY = 10000000000; // 10 billion sSTB
const RSTB_TOTAL_SUPPLY = 1000000000;  // 1 billion rSTB

// Token allocation percentages
const SSTB_ALLOCATIONS = {
  communityEcosystem: 0.40, // 40%
  treasury: 0.25,           // 25%
  teamAdvisors: 0.15,       // 15%
  investors: 0.15,          // 15%
  liquidityMining: 0.05     // 5%
};

const RSTB_ALLOCATIONS = {
  community: 0.40,          // 40%
  team: 0.20,               // 20%
  treasury: 0.20,           // 20%
  investors: 0.15,          // 15%
  advisors: 0.05            // 5%
};

// Emission schedules
const SSTB_EMISSION_SCHEDULE = [0.40, 0.30, 0.20, 0.10]; // Year 1-4 percentages of community allocation
const RSTB_EMISSION_SCHEDULE = [0.30, 0.25, 0.20, 0.15, 0.10]; // Year 1-5 percentages of community allocation

// Staking tiers for compute providers
const COMPUTE_PROVIDER_STAKING_TIERS = [
  { min: 1, max: 100, baseApy: 0.05, boostedApy: 0.075 },
  { min: 101, max: 1000, baseApy: 0.07, boostedApy: 0.105 },
  { min: 1001, max: 10000, baseApy: 0.10, boostedApy: 0.15 },
  { min: 10001, max: Infinity, baseApy: 0.12, boostedApy: 0.18 }
];

// Add a deterministic pseudo-random number generator
export function createSeededRandom(seed: number) {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

/**
 * Calculate tokenomics metrics based on parameters and timeframe
 * @param parameters The parameters to use for calculation
 * @param timeframe The timeframe in months
 * @returns The calculated metrics
 */
export function calculateMetrics(parameters: TokenomicsParameters, timeframe: number): TokenomicsMetrics {
  // Create a deterministic random generator based on parameter hash
  const paramHash = Object.values(parameters).reduce((acc, val) => {
    return acc + JSON.stringify(val).length;
  }, 0);
  const seededRandom = createSeededRandom(paramHash);
  
  // Initialize base values
  let totalCU = 1000000; // Starting with 1M CUs
  let circulatingRstb = 50000000; // Starting with 50M rSTB (5% of total supply)
  let circulatingSstb = 500000000; // Starting with 500M sSTB (5% of total supply)
  let sstbPrice = 1.0; // Starting price $1
  let rstbPrice = 0.1; // Starting rSTB price $0.1
  let treasuryAssets = 2000000; // $2M initial treasury
  let tvl = circulatingSstb; // Initially TVL equals sSTB circulation
  let cumulativeRevenue = 0;
  let providerCount = 10;
  let providerROI = 0;
  let monthlyRevenue = 0;
  let sstbStability = 100; // Stability score (100 = perfect stability)
  let sstbPriceHistory: number[] = [1.0]; // Track price history for volatility calculation
  let marketVolatility = 0; // External market volatility factor
  
  // Track token unlocks
  let sstbUnlocked = circulatingSstb;
  let rstbUnlocked = circulatingRstb;
  
  // Track staking metrics
  let stakedCU = totalCU * 0.7; // Initially 70% of CU is staked
  let stakedSstb = circulatingSstb * 0.3; // Initially 30% of sSTB is staked
  let stakedRstb = circulatingRstb * 0.5; // Initially 50% of rSTB is staked

  // No time has passed
  if (timeframe <= 0) {
    return {
      totalCU,
      circulatingRstb,
      circulatingSstb,
      sstbPrice,
      rstbPrice,
      treasuryAssets,
      tvl,
      cumulativeRevenue,
      providerCount,
      providerROI,
      monthlyRevenue,
      sstbStability,
      marketVolatility,
      timestamp: new Date(),
      stakedCU,
      stakedSstb,
      stakedRstb,
      sstbUnlocked,
      rstbUnlocked
    };
  }

  // Calculate growth over time
  for (let month = 1; month <= timeframe; month++) {
    // Simulate market volatility (increases over time with deterministic "random" shocks)
    marketVolatility = Math.min(0.5, 0.05 + (month / 120) + (seededRandom() * 0.1 * (month % 6 === 0 ? 3 : 1)));
    
    // CU growth with exponential function
    const growthRate = parameters.systemParameters.monthlyGrowthRate;
    const previousTotalCU = totalCU;
    totalCU = totalCU * (1 + growthRate);
    const newCU = totalCU - previousTotalCU;
    
    // Update staked CU - assume 70-90% of new CU is staked based on incentives
    const stakingRate = 0.7 + (parameters.feeStructure.stakingRewardRate * 5); // Higher rewards = higher staking
    stakedCU += newCU * Math.min(0.9, stakingRate);
    
    // Calculate which staking tier the average provider falls into
    const avgProviderCU = stakedCU / providerCount;
    let providerTier = COMPUTE_PROVIDER_STAKING_TIERS[0];
    for (const tier of COMPUTE_PROVIDER_STAKING_TIERS) {
      if (avgProviderCU >= tier.min && avgProviderCU <= tier.max) {
        providerTier = tier;
        break;
      }
    }
    
    // Calculate if providers get boosted APY (if they also stake rSTB)
    const percentProvidersWithBoost = stakedRstb / circulatingRstb;
    const effectiveApy = providerTier.baseApy + (providerTier.boostedApy - providerTier.baseApy) * percentProvidersWithBoost;
    
    // Calculate monthly rewards for compute providers
    const monthlyProviderRewards = stakedCU * (effectiveApy / 12);
    
    // Token unlocks based on CU growth milestones
    // More CU growth = faster token unlocks from community allocation
    const cuMilestoneProgress = Math.min(1, totalCU / 10000000); // Normalized to 10M CU target
    
    // Calculate which year we're in (for emission schedule)
    const yearIndex = Math.min(Math.floor(month / 12), SSTB_EMISSION_SCHEDULE.length - 1);
    
    // Calculate monthly token unlocks based on emission schedule and CU growth
    const monthlySstbEmissionRate = SSTB_EMISSION_SCHEDULE[yearIndex] / 12;
    const monthlyRstbEmissionRate = RSTB_EMISSION_SCHEDULE[yearIndex] / 12;
    
    // Calculate token unlocks with caps to prevent excessive unlocks
    const maxMonthlySstbUnlock = SSTB_TOTAL_SUPPLY * 0.01; // Max 1% of total supply per month
    const maxMonthlyRstbUnlock = RSTB_TOTAL_SUPPLY * 0.01; // Max 1% of total supply per month
    
    const newSstbUnlocks = Math.min(
      maxMonthlySstbUnlock,
      SSTB_TOTAL_SUPPLY * SSTB_ALLOCATIONS.communityEcosystem * monthlySstbEmissionRate * (0.7 + 0.3 * cuMilestoneProgress)
    );
    
    const newRstbUnlocks = Math.min(
      maxMonthlyRstbUnlock,
      RSTB_TOTAL_SUPPLY * RSTB_ALLOCATIONS.community * monthlyRstbEmissionRate * (0.7 + 0.3 * cuMilestoneProgress)
    );
    
    // Update circulating supply with caps to ensure we don't exceed total supply
    sstbUnlocked = Math.min(SSTB_TOTAL_SUPPLY, sstbUnlocked + newSstbUnlocks);
    rstbUnlocked = Math.min(RSTB_TOTAL_SUPPLY, rstbUnlocked + newRstbUnlocks);
    
    // Apply vesting schedules for team, advisors, and investors
    // Team & Advisors: 1-year cliff, 3-year linear vesting
    if (month >= 12) {
      const teamAdvisorVestingMonth = Math.min(month - 12, 36);
      const teamAdvisorMonthlyVesting = (SSTB_TOTAL_SUPPLY * SSTB_ALLOCATIONS.teamAdvisors) / 36;
      
      // Only add vesting amount if this is a new vesting month
      if (teamAdvisorVestingMonth === month - 12) {
        sstbUnlocked = Math.min(SSTB_TOTAL_SUPPLY, sstbUnlocked + teamAdvisorMonthlyVesting);
      }
      
      const rstbTeamVestingMonth = Math.min(month - 12, 48);
      const rstbTeamMonthlyVesting = (RSTB_TOTAL_SUPPLY * RSTB_ALLOCATIONS.team) / 48;
      
      // Only add vesting amount if this is a new vesting month
      if (rstbTeamVestingMonth === month - 12) {
        rstbUnlocked = Math.min(RSTB_TOTAL_SUPPLY, rstbUnlocked + rstbTeamMonthlyVesting);
      }
      
      const rstbAdvisorVestingMonth = Math.min(month - 12, 24);
      const rstbAdvisorMonthlyVesting = (RSTB_TOTAL_SUPPLY * RSTB_ALLOCATIONS.advisors) / 24;
      
      // Only add vesting amount if this is a new vesting month
      if (rstbAdvisorVestingMonth === month - 12) {
        rstbUnlocked = Math.min(RSTB_TOTAL_SUPPLY, rstbUnlocked + rstbAdvisorMonthlyVesting);
      }
    }
    
    // Investors: 6-month cliff, 2-year linear vesting
    if (month >= 6) {
      const investorVestingMonth = Math.min(month - 6, 24);
      const investorMonthlyVesting = (SSTB_TOTAL_SUPPLY * SSTB_ALLOCATIONS.investors) / 24;
      
      // Only add vesting amount if this is a new vesting month
      if (investorVestingMonth === month - 6) {
        sstbUnlocked = Math.min(SSTB_TOTAL_SUPPLY, sstbUnlocked + investorMonthlyVesting);
      }
      
      const rstbInvestorVestingMonth = Math.min(month - 6, 24);
      const rstbInvestorMonthlyVesting = (RSTB_TOTAL_SUPPLY * RSTB_ALLOCATIONS.investors) / 24;
      
      // Only add vesting amount if this is a new vesting month
      if (rstbInvestorVestingMonth === month - 6) {
        rstbUnlocked = Math.min(RSTB_TOTAL_SUPPLY, rstbUnlocked + rstbInvestorMonthlyVesting);
      }
    }
    
    // Liquidity Mining: Released over 4 years (48 months)
    const liquidityMiningMonthlyVesting = (SSTB_TOTAL_SUPPLY * SSTB_ALLOCATIONS.liquidityMining) / 48;
    
    // Only add liquidity mining tokens if we're within the 48-month period
    if (month <= 48) {
      sstbUnlocked = Math.min(SSTB_TOTAL_SUPPLY, sstbUnlocked + liquidityMiningMonthlyVesting);
    }
    
    // Update circulating supply (with burning mechanism)
    circulatingSstb = Math.min(sstbUnlocked, SSTB_TOTAL_SUPPLY);
    circulatingRstb = Math.min(rstbUnlocked, RSTB_TOTAL_SUPPLY);
    
    // sSTB token release at milestones
    if (month === parameters.systemParameters.milestone1Month) {
      circulatingSstb = Math.min(SSTB_TOTAL_SUPPLY, circulatingSstb + 2000000); // 2M additional sSTB at milestone 1
    }

    // Calculate revenue from transaction fees
    const monthlyTransactions = totalCU * 10; // Assume 10 transactions per CU
    const transactionRevenue = monthlyTransactions * parameters.feeStructure.transactionFee * 0.1; // Assume $0.10 per transaction
    
    // Calculate revenue from bridge fees
    const monthlyBridgeVolume = circulatingSstb * 0.05; // Assume 5% of sSTB is bridged monthly
    const bridgeRevenue = monthlyBridgeVolume * parameters.feeStructure.bridgeFee;
    
    // Calculate total monthly revenue
    monthlyRevenue = transactionRevenue + bridgeRevenue;
    
    // Accumulate revenue
    cumulativeRevenue += monthlyRevenue;
    
    // Apply token burning mechanism
    const sstbBurned = Math.min(circulatingSstb * 0.01, monthlyRevenue * 0.1); // 10% of fees collected in sSTB are burned, max 1% of supply
    const rstbBurned = Math.min(circulatingRstb * 0.01, monthlyProviderRewards * 0.05); // 5% of rewards distributed are burned, max 1% of supply
    
    circulatingSstb = Math.max(0, circulatingSstb - sstbBurned);
    circulatingRstb = Math.max(0, circulatingRstb - rstbBurned);
    
    // Increase treasury with a cap to prevent unrealistic growth
    const maxTreasuryGrowth = 10000000; // $10M max growth per month
    treasuryAssets += Math.min(maxTreasuryGrowth, monthlyRevenue * 0.6); // Assume 60% of revenue goes to treasury
    
    // Calculate collateral ratio (treasury assets to sSTB market cap)
    const collateralRatio = treasuryAssets / (circulatingSstb * sstbPrice);
    
    // Update sSTB price based on treasury growth, market dynamics, and stability mechanisms
    // The key here is that sSTB price should remain stable around $1 despite market volatility
    const marketFactor = parameters.marketDynamics.priceSensitivity;
    const rawPriceChange = ((treasuryAssets / 10000000) * (1 / (circulatingSstb / 10000000)) * marketFactor) - sstbPrice;
    
    // Apply stability mechanism - price changes are dampened based on collateral ratio
    const stabilityFactor = Math.min(1, parameters.marketDynamics.collateralRatio / collateralRatio);
    const marketShock = (seededRandom() * 2 - 1) * marketVolatility * 0.1;
    
    // Calculate new sSTB price with stability mechanisms
    const newSstbPrice = sstbPrice + (rawPriceChange * 0.1) + (marketShock * stabilityFactor);
    
    // Apply automatic rebalancing if price deviates too much from $1
    const priceDeviation = Math.abs(newSstbPrice - 1.0);
    if (priceDeviation > 0.1) {
      // Stronger correction the further we are from $1
      const correctionFactor = 0.2 + (priceDeviation * 0.5);
      sstbPrice = newSstbPrice > 1.0 
        ? newSstbPrice - (priceDeviation * correctionFactor)
        : newSstbPrice + (priceDeviation * correctionFactor);
    } else {
      sstbPrice = newSstbPrice;
    }
    
    // Keep track of price history for volatility calculation
    sstbPriceHistory.push(sstbPrice);
    if (sstbPriceHistory.length > 12) {
      sstbPriceHistory.shift(); // Keep only last 12 months
    }
    
    // Calculate stability score based on price volatility
    const priceVolatility = calculateVolatility(sstbPriceHistory);
    sstbStability = 100 - (priceVolatility * 100);
    
    // Update staking metrics based on incentives and price performance
    // Higher rewards and better price performance = more staking
    const sstbStakingIncentive = parameters.feeStructure.stakingRewardRate * (sstbStability / 100);
    const rstbStakingIncentive = parameters.feeStructure.stakingRewardRate * Math.min(10, rstbPrice / 0.1); // Cap at 10x initial price
    
    stakedSstb = Math.min(circulatingSstb, circulatingSstb * Math.min(0.8, 0.3 + sstbStakingIncentive));
    stakedRstb = Math.min(circulatingRstb, circulatingRstb * Math.min(0.9, 0.5 + rstbStakingIncentive));
    
    // Update rSTB price - this grows with system usage and revenue
    // rSTB is the growth token, so it should appreciate more aggressively
    const revenueGrowthFactor = Math.min(2.0, 1 + (monthlyRevenue / 1000000)); // Cap at 2x growth per month
    const cuSystemGrowth = Math.min(1.5, 1 + (totalCU / 100000000)); // Cap at 1.5x growth
    const stakingFactor = Math.min(1.2, 1 + (stakedRstb / circulatingRstb) * 0.1); // Cap at 1.2x
    
    // Apply a more controlled growth formula with caps
    const growthMultiplier = Math.min(1.2, (1 + (0.02 * revenueGrowthFactor * cuSystemGrowth * stakingFactor * (1 + seededRandom() * 0.05))));
    
    // Apply the growth with a maximum cap to prevent runaway values
    const maxRstbPrice = 1000; // Cap at $1000 per rSTB
    rstbPrice = Math.min(maxRstbPrice, rstbPrice * growthMultiplier);
    
    // If we're in a later month and price is growing too fast, apply additional dampening
    if (month > 24 && rstbPrice > 100) {
      // Apply logarithmic dampening for high values
      rstbPrice = 100 + (Math.log(rstbPrice - 99) * 20);
    }

    // Update rSTB supply based on staking rewards and provider incentives
    // Cap the new issuance to prevent excessive inflation
    const newRstbIssuance = Math.min(
      10000000, // Cap at 10M new tokens per month
      (totalCU / 1000000) * parameters.feeStructure.stakingRewardRate * 100000
    );
    circulatingRstb += newRstbIssuance;
    
    // Update TVL - includes both sSTB and staked rSTB
    // Apply caps to prevent unrealistic values
    const sstbTvl = Math.min(stakedSstb * sstbPrice, SSTB_TOTAL_SUPPLY * 2); // Cap at 2x total supply value
    const rstbTvl = Math.min(stakedRstb * rstbPrice, RSTB_TOTAL_SUPPLY * 1000); // Cap at 1000x total supply value
    const treasuryTvl = Math.min(treasuryAssets * 0.8, treasuryAssets * 2); // Cap at 2x treasury assets
    
    tvl = sstbTvl + rstbTvl + treasuryTvl;
    
    // Update provider count - grows with CU but at a slower rate
    providerCount = Math.floor(10 + (totalCU / 500000) * Math.sqrt(month));
    
    // Calculate provider ROI based on provider type
    const providerMonthlyRevenue = totalCU * 0.01; // $0.01 per CU per month
    const setupCost = parameters.providerEconomics.setupCost;
    const monthlyOpEx = parameters.providerEconomics.monthlyOpEx;
    
    // Simplified ROI calculation - monthly return divided by costs
    providerROI = (providerMonthlyRevenue - monthlyOpEx) / (setupCost / 24); // Assuming 24-month amortization
  }

  return {
    totalCU,
    circulatingRstb,
    circulatingSstb,
    sstbPrice,
    rstbPrice,
    treasuryAssets,
    tvl,
    cumulativeRevenue,
    providerCount,
    providerROI,
    monthlyRevenue,
    sstbStability,
    marketVolatility,
    timestamp: new Date(),
    stakedCU,
    stakedSstb,
    stakedRstb,
    sstbUnlocked,
    rstbUnlocked
  };
}

/**
 * Calculate price volatility from price history
 * @param prices Array of historical prices
 * @returns Volatility measure (0-1 scale)
 */
function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  // Filter out any invalid prices
  const validPrices = prices.filter(price => isFinite(price) && !isNaN(price) && price > 0);
  
  // If we don't have enough valid prices, return 0
  if (validPrices.length < 2) return 0;
  
  // Calculate average price
  const avgPrice = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
  
  // Safeguard against division by zero
  if (avgPrice === 0) return 0;
  
  // Calculate variance with a cap to prevent extreme values
  const squaredDiffs = validPrices.map(price => {
    const diff = price - avgPrice;
    // Cap the squared difference to prevent extreme values
    return Math.min(100, Math.pow(diff, 2));
  });
  
  const variance = squaredDiffs.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / validPrices.length;
  
  // Return standard deviation divided by average (coefficient of variation)
  // Capped at 1.0 for the 0-1 scale
  return Math.min(1.0, Math.sqrt(variance) / avgPrice);
}

/**
 * Run sensitivity analysis on a specific parameter
 * @param paramCategory The category of the parameter to analyze
 * @param paramName The name of the parameter to analyze
 * @param range The range of variation in percentage (e.g., 30 means ±30%)
 * @returns Analysis results including baseline, variations, and impacts
 */
export function runSensitivityAnalysis(
  paramCategory: string, 
  paramName: string, 
  range: number
): {
  baseline: number;
  variations: Array<{ paramValue: number; value: number }>;
  impacts: Record<string, number>;
} {
  // Get the current parameter value
  const currentParams = { ...defaultParameters };
  
  // Type-safe access to parameter value
  let currentValue: number;
  
  switch (paramCategory) {
    case 'systemParameters':
      currentValue = currentParams.systemParameters[paramName as keyof typeof currentParams.systemParameters] as number;
      break;
    case 'marketDynamics':
      currentValue = currentParams.marketDynamics[paramName as keyof typeof currentParams.marketDynamics] as number;
      break;
    case 'feeStructure':
      currentValue = currentParams.feeStructure[paramName as keyof typeof currentParams.feeStructure] as number;
      break;
    case 'providerEconomics':
      currentValue = currentParams.providerEconomics[paramName as keyof typeof currentParams.providerEconomics] as number;
      break;
    default:
      throw new Error(`Unknown parameter category: ${paramCategory}`);
  }
  
  if (typeof currentValue !== 'number') {
    throw new Error(`Parameter ${paramName} is not a numeric value`);
  }
  
  // Calculate baseline metrics
  const baselineMetrics = calculateMetrics(currentParams, 12); // Use 12 months as default timeframe
  
  // Determine the range of values to test
  const minValue = currentValue * (1 - range / 100);
  const maxValue = currentValue * (1 + range / 100);
  const step = (maxValue - minValue) / 10; // 10 data points
  
  // Run variations
  const variations: Array<{ paramValue: number; value: number }> = [];
  
  // Select which metric to track based on parameter
  let metricToTrack: keyof TokenomicsMetrics;
  
  switch (paramCategory) {
    case 'systemParameters':
      metricToTrack = 'totalCU';
      break;
    case 'marketDynamics':
      metricToTrack = 'sstbPrice';
      break;
    case 'feeStructure':
      metricToTrack = 'monthlyRevenue';
      break;
    case 'providerEconomics':
      metricToTrack = 'providerROI';
      break;
    default:
      metricToTrack = 'tvl';
  }
  
  // Calculate baseline value for the tracked metric
  const baselineValue = baselineMetrics[metricToTrack] as number;
  
  // Run simulations with different parameter values
  for (let paramValue = minValue; paramValue <= maxValue; paramValue += step) {
    // Create a modified parameter set
    const modifiedParams = deepMerge({}, currentParams);
    
    // Type-safe parameter modification
    switch (paramCategory) {
      case 'systemParameters':
        modifiedParams.systemParameters = {
          ...modifiedParams.systemParameters,
          [paramName]: paramValue
        };
        break;
      case 'marketDynamics':
        modifiedParams.marketDynamics = {
          ...modifiedParams.marketDynamics,
          [paramName]: paramValue
        };
        break;
      case 'feeStructure':
        modifiedParams.feeStructure = {
          ...modifiedParams.feeStructure,
          [paramName]: paramValue
        };
        break;
      case 'providerEconomics':
        modifiedParams.providerEconomics = {
          ...modifiedParams.providerEconomics,
          [paramName]: paramValue
        };
        break;
    }
    
    // Calculate metrics with the modified parameter
    const metrics = calculateMetrics(modifiedParams, 12);
    
    // Store the result
    variations.push({
      paramValue,
      value: metrics[metricToTrack] as number
    });
  }
  
  // Calculate impact on different metrics
  const impacts: Record<string, number> = {};
  
  // Test extreme values (min and max) and calculate percentage change for key metrics
  const minParams = deepMerge({}, currentParams);
  const maxParams = deepMerge({}, currentParams);
  
  // Type-safe parameter modification for min and max
  switch (paramCategory) {
    case 'systemParameters':
      minParams.systemParameters = {
        ...minParams.systemParameters,
        [paramName]: minValue
      };
      maxParams.systemParameters = {
        ...maxParams.systemParameters,
        [paramName]: maxValue
      };
      break;
    case 'marketDynamics':
      minParams.marketDynamics = {
        ...minParams.marketDynamics,
        [paramName]: minValue
      };
      maxParams.marketDynamics = {
        ...maxParams.marketDynamics,
        [paramName]: maxValue
      };
      break;
    case 'feeStructure':
      minParams.feeStructure = {
        ...minParams.feeStructure,
        [paramName]: minValue
      };
      maxParams.feeStructure = {
        ...maxParams.feeStructure,
        [paramName]: maxValue
      };
      break;
    case 'providerEconomics':
      minParams.providerEconomics = {
        ...minParams.providerEconomics,
        [paramName]: minValue
      };
      maxParams.providerEconomics = {
        ...maxParams.providerEconomics,
        [paramName]: maxValue
      };
      break;
  }
  
  // Calculate metrics for min and max values
  const minMetrics = calculateMetrics(minParams, 12);
  const maxMetrics = calculateMetrics(maxParams, 12);
  
  // Calculate percentage impact on key metrics
  const keyMetrics: Array<keyof TokenomicsMetrics> = ['totalCU', 'sstbPrice', 'tvl', 'providerROI', 'monthlyRevenue'];
  
  keyMetrics.forEach(metric => {
    const baseValue = baselineMetrics[metric] as number;
    const minValue = minMetrics[metric] as number;
    const maxValue = maxMetrics[metric] as number;
    
    // Calculate max percentage change (positive or negative)
    const minChange = Math.abs((minValue - baseValue) / baseValue);
    const maxChange = Math.abs((maxValue - baseValue) / baseValue);
    
    impacts[metric] = Math.max(minChange, maxChange) * 100; // Convert to percentage
  });
  
  return {
    baseline: baselineValue,
    variations,
    impacts
  };
}

/**
 * Apply a predefined scenario to parameters
 * @param scenarioKey The key of the scenario to apply
 * @returns The parameters with the scenario applied
 */
export function applyScenario(scenarioKey: string): TokenomicsParameters {
  const scenario = scenarios[scenarioKey];
  if (!scenario) {
    return defaultParameters;
  }
  
  // Create a deep copy of defaultParameters and merge with scenario parameters
  const result = deepMerge(JSON.parse(JSON.stringify(defaultParameters)), scenario.parameters);
  return result;
}

/**
 * Deep merge two objects
 * @param target The target object
 * @param source The source object
 * @returns The merged object
 */
function deepMerge(target: any, source: any): any {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  
  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];
    
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  
  return target;
}

/**
 * Check if a value is an object
 * @param item The value to check
 * @returns Whether the value is an object
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
} 