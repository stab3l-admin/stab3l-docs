---
title: Introduction
description: Introduction to STAB3L's dual-token, compute-backed stablecoin protocol
category: Whitepaper
order: 1
---

# 1. Introduction

STAB3L introduces a dual-token, compute-backed stablecoin protocol designed to stabilize the volatile pricing of computational resources, a critical bottleneck for AI, blockchain, and scientific innovation. The protocol addresses the $500 billion global compute market by anchoring its stablecoin, sSTB, to 1 Compute Unit (CU), defined as 10^15 floating-point operations per second (FLOPs), benchmarked against high-performance instances like AWS p4d.24xlarge (10,000 CUs, nominally $0.06/CU at launch, subject to market-driven volatility of ±30%). The rSTB token serves as a reward and governance token, appreciating over time to incentivize participation, maintain peg stability, and enable dynamic system adjustments.

{% hint style="info" %}
STAB3L aims to reduce compute cost volatility from ±30% to <5%, creating a more predictable environment for AI development, blockchain operations, and scientific research.
{% endhint %}

## 1.1 Token System Overview

**sSTB**: A stablecoin pegged to 1 CU, ensuring users pay a predictable price (e.g., $0.06/CU) for compute resources, regardless of market fluctuations. Only sSTB holders access stabilized pricing, incentivizing adoption.

**rSTB**: A volatile reward and governance token that accrues value through protocol fees (20% allocated to rSTB appreciation), staking rewards (e.g., 5% APR), and governance voting rights. rSTB holders adjust key parameters (e.g., k, m) to adapt to market conditions.

**CU Tokens**: Temporary tokens representing staked compute capacity, minted by providers and exchanged 1:1 for sSTB after a 90-day locking period. CU tokens are burned upon exchange to enforce scarcity and maintain the sSTB peg.

## 1.2 Objectives and Scope

STAB3L aims to:

- Stabilize compute costs, reducing volatility from ±30% to <5% for sSTB holders.
- Incentivize compute providers to stake resources, ensuring a robust supply of CUs.
- Create a decentralized, multi-chain marketplace for compute, integrated with deep liquidity pools, arbitrage mechanisms, and governance.
- Ensure long-term sustainability through energy-efficient practices, hardware resilience, and adaptive economic models.

This whitepaper provides a rigorous, mathematically grounded framework, validated through simulations and real-world testing, positioning STAB3L as a best-in-class solution for compute stabilization.

## 1.3 Mathematical Foundations

The stability of sSTB relies on a peg stabilization equation:

$$
P_{sSTB} = P_{CU} + \Delta_{arbitrage} + \Delta_{derivatives} + \Delta_{governance}
$$

Where:
- $P_{CU}$: Market price of 1 CU in USD (nominally \$0.06, ±30% volatility).
- $P_{sSTB}$: Target price of sSTB, fixed at \$0.06 (1 CU).
- $\Delta_{arbitrage} = k \cdot (P_{sSTB} - P_{CU})$, with $k$ (arbitrage efficiency) dynamically adjustable via governance (default 0.15, range 0.1–0.5).
- $\Delta_{derivatives} = m \cdot (P_{sSTB,futures} - P_{sSTB,spot})$, with $m$ (derivative market efficiency) adjustable (default 0.1, range 0.05–0.2).
- $\Delta_{governance} = g \cdot (R_{actual} - R_{target})$, with $g$ (governance response factor) adjustable (default 0.2, range 0.1–0.5), and $R$ representing reserve ratios.

{% hint style="success" %}
This equation will be fully derived and validated in subsequent sections, supported by simulations and risk analysis.
{% endhint %}

## 1.4 Graph Description

**Figure 1.1: sSTB Peg Stability Over Time**

A line graph comparing $P_{CU}$ (volatile, \$0.04–\$0.08) and $P_{sSTB}$ (stable at \$0.06) over 2019–2025, with annotations for arbitrage events, derivative corrections, and governance interventions stabilizing $P_{sSTB}$. The graph highlights the protocol's ability to maintain the peg despite market fluctuations, with a 95% confidence interval showing <5% deviation.

## 1.5 Implementation Context

STAB3L operates cross-chain (e.g., Ethereum, Solana) via audited bridges (Wormhole, Axelar), with native issuance on each chain to minimize security risks. The protocol integrates with decentralized exchanges (DEXs) for liquidity pools, futures/options markets, and user-friendly wallets (e.g., MetaMask integrations) to lower onboarding friction. 