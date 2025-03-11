---
title: Getting Started
description: Learn how to use STAB3L platform
category: Introduction
order: 1
---

# Getting Started with STAB3L

Welcome to STAB3L, a decentralized compute unit (CU) standardization, verification, and marketplace platform. This guide will help you get started with using STAB3L to tokenize, trade, and utilize compute resources.

{% hint style="info" %}
STAB3L enables the tokenization of compute resources with standardized units, verified through zero-knowledge proofs (ZKPs) or trusted execution environments (TEEs).
{% endhint %}

{% hint style="warning" %}
**Important**: CU tokens are NOT tradable assets. They are temporary tokens that are burned immediately when exchanged for sSTB. This burning mechanism is crucial for maintaining the peg and ensuring that each sSTB is backed by real compute resources.
{% endhint %}

## What is STAB3L?

STAB3L is a platform that solves the problem of standardizing and verifying compute resources in a decentralized manner. It allows:

- **Providers** to tokenize their compute resources and receive sSTB tokens
- **Users** to purchase sSTB tokens and redeem them for standardized compute resources
- **Traders** to participate in spot, futures, and options markets for sSTB tokens

## System Architecture

STAB3L follows a modular, layered architecture:

### Data Layer
- On-chain storage (Arbitrum, Solana) for compute data, collateral, and token balances
- IPFS for large datasets like benchmarks

### Business Logic Layer
- Smart contracts (Solidity) for verification, minting, redemption, marketplace, and cross-chain logic
- Off-chain logic (Python/Rust) for ZKPs and pricing

### API Layer
- REST/gRPC APIs for provider compute delivery
- Hosted on Kubernetes clusters (AWS EKS) with load balancers

### Presentation Layer
- React frontend for users, with Web3 integration (Wagmi, MetaMask)

## Prerequisites

Before you start using STAB3L, make sure you have:

- A Web3-compatible wallet (MetaMask, Trust Wallet, etc.)
- Some ETH for gas fees on Arbitrum
- Collateral tokens (USDC) if you plan to provide compute resources

## Quick Start Guide

### For Users

{% tabs %}
{% tab title="Connect Wallet" %}
1. Visit the [STAB3L platform](https://app.stab3l.com)

2. Click on the "Connect Wallet" button in the top right corner

3. Select your wallet provider and follow the prompts to connect

4. Once connected, you'll see your wallet address and balance
{% endtab %}

{% tab title="Buy sSTB Tokens" %}
1. Navigate to the "Marketplace" section

2. Browse available sSTB tokens from different providers

3. Select the sSTB tokens you want to purchase

4. Specify the amount and confirm the transaction

5. Once the transaction is confirmed, you'll own the sSTB tokens
{% endtab %}

{% tab title="Redeem sSTB Tokens" %}
1. Navigate to the "Redeem" section

2. Select the amount of sSTB tokens you want to redeem

3. Choose a provider from the available list

4. Confirm the redemption transaction

5. Follow the instructions to access your compute resources

6. The provider will deliver the compute resources as specified
{% endtab %}
{% endtabs %}

### For Providers

{% tabs %}
{% tab title="Register" %}
1. Visit the [STAB3L platform](https://app.stab3l.com)

2. Connect your wallet

3. Navigate to the "Provider" section

4. Click on "Register as Provider"

5. Fill in your provider details and submit

6. Wait for approval from the STAB3L governance
{% endtab %}

{% tab title="Verify and Mint sSTB" %}
1. Navigate to the "Provide" section

2. Specify the compute resources you want to tokenize

3. Submit your compute resources for verification

4. Once verified, deposit the required collateral (minimum 120% of CU value)

5. Choose your staking period (minimum 7 days)

6. Confirm the transaction

7. Your compute resources will be verified, temporary CU tokens will be created and immediately burned, and sSTB tokens will be minted to your wallet
{% endtab %}
{% endtabs %}

## Token System

STAB3L uses a dual-token system:

1. **sSTB Token (sSTB)** - The main utility token of the ecosystem
2. **STB Governance Token (rSTB)** - The governance and rewards token

{% hint style="success" %}
Holding rSTB tokens allows you to participate in governance decisions and earn rewards for staking and other activities.
{% endhint %}

## Next Steps

Now that you have a basic understanding of STAB3L, you can explore the following guides to learn more:

- [Understanding Compute Units](/docs/compute-units)
- [Marketplace Guide](/docs/marketplace-guide)
- [Cross-Chain Bridge](/docs/cross-chain-bridge)
- [Governance Participation](/docs/governance)
- [Provider Guide](/docs/provider-guide) 