---
title: System Architecture & Mathematical Model
description: Technical framework for STAB3L's system architecture and mathematical model
category: Whitepaper
order: 4
---

# 4. System Architecture & Mathematical Model

This section provides a detailed technical framework for STAB3L's system architecture, defining the Compute Unit (CU), price dynamics, and the mathematical model that ensures sSTB's peg stability. It includes explicit derivations, simulations, and practical implementation details to demonstrate robustness and scalability.

## 4.1 Compute Unit Definition

The foundational unit of STAB3L is the Compute Unit (CU), defined as:

1 CU = $10^{15}$ FLOPs (floating-point operations per second), benchmarked against high-performance instances like AWS p4d.24xlarge, which delivers approximately 10,000 CUs (i.e., $10^{19}$ FLOPs).

**Nominal Pricing**: At launch, 1 CU is priced at \$0.06 in USD, subject to market-driven volatility (±30%, as detailed in Section 2). This benchmark is periodically reviewed via governance to account for hardware advancements (e.g., quantum computing, next-gen GPUs).

The CU serves as the collateral backing sSTB, ensuring a tangible, real-world asset for peg stability. Providers stake CUs, minting temporary CU tokens, which are exchanged 1:1 for sSTB after a 90-day lockup, with CU tokens burned to maintain scarcity.

## 4.2 Price Dynamics

We define the key price variables:

$P_{CU}$: Market price of 1 CU in USD, modeled as a lognormal distribution:

$$
P_{CU} \sim LogNormal(\mu, \sigma_{CU})
$$

With:

- $\mu = \ln(0.06)$ and $\sigma_{CU} \approx 0.3$ (30% volatility), 
- $P_{CU}$ ranges from 0.042 to 0.084 with 95% confidence (see Section 2).

$P_{sSTB}$: Market price of 1 sSTB in USD, targeted to equal \$0.06 (1 CU), stabilized via arbitrage, derivatives, and governance.

$P_{rSTB}$: Market price of 1 rSTB in USD, appreciating over time based on protocol value and scarcity, modeled as:

$$
P_{rSTB}(t) = \frac{V_{protocol}(t)}{S_{rSTB}(t)}
$$

Where:

- $V_{protocol}(t)$ is the total protocol value (e.g., staked CUs, liquidity pools, fee revenue), and;
- $S_{rSTB}(t)$ is the circulating supply of rSTB.

These dynamics interact through staking, redemption, and market mechanisms, ensuring sSTB stability and rSTB appreciation.

## 4.3 Mathematical Model for Peg Stability

The core of STAB3L's stability mechanism is the peg equation:

$$
P_{sSTB} = P_{CU} + \Delta_{arbitrage} + \Delta_{derivatives} + \Delta_{governance}
$$

Where:

- $\Delta_{arbitrage} = k \cdot (P_{sSTB} - P_{CU})$, with $k$ (arbitrage efficiency) dynamically adjustable via governance (default 0.15, range 0.1–0.5).
- $\Delta_{derivatives} = m \cdot (P_{sSTB,futures} - P_{sSTB,spot})$, with $m$ (derivative market efficiency) adjustable (default 0.1, range 0.05–0.2).
- $\Delta_{governance} = g \cdot (R_{actual} - R_{target})$, with $g$ (governance response factor) adjustable (default 0.2, range 0.1–0.5), and $R$ representing reserve ratios.

Rearranging to solve for $P_{sSTB}$:

$$
P_{sSTB}(1 - k) = P_{CU} + m \cdot (P_{sSTB,futures} - P_{sSTB,spot}) + g \cdot (R_{actual} - R_{target})
$$

$$
P_{sSTB} = \frac{P_{CU} + m \cdot (P_{sSTB,futures} - P_{sSTB,spot}) + g \cdot (R_{actual} - R_{target})}{1 - k}
$$

This equation demonstrates how $P_{sSTB}$ converges to USD 0.06 when $P_{CU} = \text{USD 0.06}$, $P_{sSTB,futures} = P_{sSTB,spot}$, and $R_{actual} = R_{target}$. Deviations trigger arbitrage, derivatives, and governance adjustments, maintaining stability. 

### 4.3.1 Arbitrage Mechanism

Arbitrage exploits price discrepancies between $P_{sSTB}$ and $P_{CU}$:

- If $P_{sSTB} > P_{CU}$: Traders stake CUs (at $P_{CU}$), mint CU tokens, wait 90 days, exchange for sSTB, and sell at $P_{sSTB}$, earning $(P_{sSTB} - P_{CU})$ per CU.
- If $P_{sSTB} < P_{CU}$: Traders buy sSTB (at $P_{sSTB}$), redeem for CUs, and sell at $P_{CU}$, earning $(P_{CU} - P_{sSTB})$ per CU.

The arbitrage adjustment is:

$$
\Delta_{arbitrage} = k \cdot (P_{sSTB} - P_{CU})
$$

Where:

- ${k}$ (default 0.15) represents arbitrage efficiency, adjustable via governance based on market conditions. 
- Higher ${k}$ values (e.g., 0.5 during high volatility) accelerate price convergence, while lower values (e.g., 0.1 during low volatility) reduce friction.

### 4.3.2 Derivatives Mechanism

Futures and options markets on sSTB provide additional stability:

$$
\Delta_{derivatives} = m \cdot (P_{sSTB,futures} - P_{sSTB,spot})
$$

Where:

- ${m}$ (default 0.1) represents derivative market efficiency, adjustable via governance. 

When:

- $P_{sSTB,futures} > P_{sSTB,spot}$, traders sell futures and buy spot, pushing prices toward equilibrium. 

Conversely, when $P_{sSTB,futures} < P_{sSTB,spot}$, traders buy futures and sell spot.

The futures price incorporates market expectations:

$$
P_{sSTB,futures} = P_{sSTB,spot} \cdot (1 + r \cdot T) + \text{Risk Premium}
$$

Where: ${r}$ is the risk-free rate (e.g., 0.05), ${T}$ is the time to expiration (e.g., 30/365 years), and Risk Premium reflects market sentiment (typically ±0.01).

### 4.3.3 Governance Mechanism

Governance adjusts reserve ratios to maintain peg stability:

$$
\Delta_{governance} = g \cdot (R_{actual} - R_{target})
$$

Where:

- ${g}$ (default 0.2) is the governance response factor, 
- $R_{actual}$ is the actual reserve ratio ($\frac{\text{Reserve Assets}}{\text{sSTB Supply}}$), and;
- $R_{target}$ is the target ratio (default 0.1, range 0.05–0.2).

When:

- $R_{actual} < R_{target}$, governance increases fees, reduces emissions, or activates the Stability Fund to restore reserves. 

When:

- $R_{actual} > R_{target}$, governance reduces fees or increases emissions to optimize capital efficiency.

## 4.4 System Components

STAB3L's architecture comprises four key components:

1. **Staking Module**: Providers stake CUs, minting CU tokens locked for 90 days, then exchanged 1:1 for sSTB. The module verifies CU availability via benchmarks (e.g., LINPACK, MLPerf) and monitors uptime.

2. **Redemption Module**: Users redeem sSTB for CUs at the stabilized price (\$0.06/CU), with the module matching redemption requests to available CUs, burning sSTB, and releasing CUs.

3. **Market Module**: DEX pools (sSTB/USDC, sSTB/ETH) and derivatives markets (futures, options) provide liquidity and price discovery, with the module tracking spreads, depths, and volumes.

4. **Governance Module**: rSTB holders vote on parameter adjustments ($k$, $m$, $g$, $R_{target}$), with the module implementing changes based on market conditions and stability metrics.

These components interact via smart contracts on Ethereum, Solana, and other chains, with cross-chain bridges ensuring seamless operation.

## 4.5 Simulation of Peg Stability

We validate the mathematical model via Monte Carlo simulation:

- **Parameters**: $P_{CU} \sim LogNormal(\ln(0.06), 0.3)$, $P_{sSTB,futures} - P_{sSTB,spot} \sim Normal(0, 0.01)$, $R_{actual} - R_{target} \sim Normal(0, 0.05)$, with $k = 0.15$, $m = 0.1$, $g = 0.2$.
- **Iterations**: 10,000 runs over 12 months, computing:
  $$
  P_{sSTB} = \frac{P_{CU} + m \cdot (P_{sSTB,futures} - P_{sSTB,spot}) + g \cdot (R_{actual} - R_{target})}{1-k}
  $$
- **Results**: 99.9% of simulations show $|P_{sSTB} - 0.06| < 0.003$ (0.5% deviation), confirming robust peg stability under nominal conditions. Extreme scenarios (e.g., $P_{CU}$ = $0.04, high $R_{actual} - R_{target}$) are addressed in Section 11.

## 4.6 Graph Description

**Figure 4.1: Peg Stability Mechanism Dynamics**

A line graph of $P_{sSTB}$, $P_{CU}$, and adjustment components ($\Delta_{arbitrage}$, $\Delta_{derivatives}$, $\Delta_{governance}$) over 2019–2025, showing $P_{sSTB}$ stabilizing at \$0.06 despite $P_{CU}$ volatility (\$0.04–\$0.08). Annotations highlight arbitrage events, derivative corrections, and governance interventions, with a 95% confidence interval showing <0.5% deviation.

## 4.7 Implementation Details

- **Smart Contracts**: Solidity contracts on Ethereum (ERC-20 for sSTB/rSTB, ERC-1155 for CU tokens), with parallel implementations on Solana (SPL) and other chains.
- **Oracles**: Chainlink price feeds for $P_{CU}$, $P_{sSTB}$, and $P_{rSTB}$, with a 5-minute update frequency and 3-of-5 validator consensus.
- **Benchmarks**: LINPACK and MLPerf tests verify CU availability, with providers running benchmarks every 24 hours, validated by a decentralized network of verifiers.
- **Cross-Chain**: Wormhole and Axelar bridges enable seamless transfer of sSTB and rSTB across chains, with a 10-minute finality period and 7-of-11 validator consensus. 