---
title: Glossary
description: Definitions of key terms used throughout the STAB3L documentation
category: Support
order: 2
---

# Glossary

This glossary provides definitions for key terms used throughout the STAB3L documentation. Understanding these terms will help you navigate the platform more effectively.

## A

### Arbitrage
A trading strategy that exploits price differences of the same asset in different markets. In STAB3L, arbitrage helps maintain the peg of sSTB to the value of 1 CU.

### Arbitrage Efficiency (k)
A parameter in the peg stabilization equation that determines how quickly arbitrage opportunities are exploited. The default value is 0.15, with a governance-adjustable range of 0.1–0.5.

### Arbitrum
A Layer 2 scaling solution for Ethereum that uses optimistic rollups to increase transaction throughput and reduce gas costs. STAB3L primarily operates on Arbitrum for its main contracts and marketplace.

### Attestation
A cryptographic verification that proves the authenticity of a claim, such as the execution of a benchmark in a Trusted Execution Environment (TEE).

## B

### Benchmark
A standardized test used to evaluate the performance of compute resources. In STAB3L, benchmarks are used to standardize and verify compute units.

### Bridge
A cross-chain protocol that enables the transfer of tokens between different blockchain networks. STAB3L's Cross-Chain Bridge allows users to move CU tokens between supported blockchains.

## C

### Circuit Breaker
A security mechanism that automatically pauses certain operations when predefined thresholds are exceeded. STAB3L implements circuit breakers for unusual trading volume, large bridge transfers, and rapid price fluctuations.

### Collateral
Assets deposited by providers as security against the compute resources they offer. If a provider fails to fulfill redemption requests, their collateral may be used to compensate users.

### Compute Unit (CU)
A standardized measure of computational power that includes processing power, memory, storage, network bandwidth, and duration of availability. In STAB3L, 1 CU is defined as 10^15 FLOPs (floating-point operations per second) and is valued at $0.06 at launch.

### Cross-Chain
Referring to interactions or transfers between different blockchain networks. STAB3L's Cross-Chain Bridge enables the movement of CU tokens across multiple blockchains.

## D

### Decentralized Finance (DeFi)
A financial system built on blockchain technology that operates without centralized intermediaries. STAB3L integrates with various DeFi protocols to enhance liquidity and utility for CU tokens.

### Derivative Market Efficiency (m)
A parameter in the peg stabilization equation that determines how effectively futures and options markets influence the spot price of sSTB. The default value is 0.1, with a governance-adjustable range of 0.05–0.2.

### Dispute Resolution
A process for resolving conflicts between users and providers, such as when a provider fails to fulfill a redemption request. STAB3L's dispute resolution system includes collateral slashing and reputation impacts.

## E

### ERC-20
A token standard on Ethereum that defines a common list of rules for fungible tokens. The sSTB and rSTB tokens follow the ERC-20 standard.

### ERC-1155
A token standard on Ethereum that supports both fungible and non-fungible tokens in a single contract. CU tokens in STAB3L are implemented as ERC-1155 tokens.

### Ethereum
A decentralized, open-source blockchain platform that enables smart contract functionality. STAB3L operates primarily on Arbitrum, an Ethereum Layer 2 solution.

## F

### FLOPs (Floating-Point Operations Per Second)
A measure of computer performance. In STAB3L, 1 CU is defined as 10^15 FLOPs, benchmarked against high-performance instances like AWS p4d.24xlarge.

### Futures Contract
An agreement to buy or sell an asset at a predetermined price at a specified time in the future. STAB3L's Futures Market allows trading of contracts for future delivery of compute resources via sSTB.

## G

### Gas
The fee required to perform a transaction or execute a contract on the Ethereum network. Gas fees are paid in the native cryptocurrency of the network (e.g., ETH on Ethereum).

### Governance
The process by which decisions are made in a decentralized system. STAB3L's governance system allows rSTB token holders to vote on proposals that affect the platform.

### Governance Response Factor (g)
A parameter in the peg stabilization equation that determines how strongly governance actions influence the peg stability. The default value is 0.2, with a governance-adjustable range of 0.1–0.5.

## L

### Liquidity
The ease with which an asset can be converted to cash or traded without affecting its market price. STAB3L implements various mechanisms to ensure liquidity for CU tokens.

### Liquidity Mining
A process where users provide liquidity to a protocol and receive rewards in return. STAB3L offers liquidity mining programs to incentivize liquidity provision for CU tokens.

### LogNormal Distribution
A probability distribution of a random variable whose logarithm follows a normal distribution. In STAB3L, the market price of 1 CU (P_CU) is modeled as a lognormal distribution with parameters μ = ln(0.06) and σ_CU ≈ 0.3.

## M

### Marketplace
A platform where buyers and sellers can trade assets. STAB3L's marketplace allows users to buy and sell CU tokens through spot, futures, and options markets.

### Minting
The process of creating new tokens. In STAB3L, providers mint CU tokens after verifying their compute resources through ZKPs or TEEs.

### Multi-Signature (Multi-Sig)
A security feature that requires multiple private keys to authorize a transaction. STAB3L uses a 7/11 multi-signature wallet for critical protocol parameters and contracts.

## O

### Options Contract
A financial derivative that gives the buyer the right, but not the obligation, to buy or sell an asset at a predetermined price. STAB3L's Options Market allows trading of call and put options for CU tokens.

## P

### Peg Stabilization Equation
The mathematical formula that ensures the stability of sSTB's value:
P_sSTB = P_CU + Δ_arbitrage + Δ_derivatives + Δ_governance
Where P_sSTB is the target price of sSTB, fixed at $0.06 (1 CU).

### Provider
An entity that offers compute resources on the STAB3L platform. Providers verify their resources, mint CU tokens, and fulfill redemption requests.

### Proof of Stake (PoS)
A consensus mechanism where validators are selected to create new blocks based on the number of tokens they hold and are willing to "stake" as collateral.

## R

### Redemption
The process of exchanging CU tokens for actual compute resources. When a user redeems CU tokens, the tokens are burned, and the provider is notified to fulfill the request.

### Relayer
An entity that monitors events on one blockchain and submits proofs to another blockchain. In STAB3L's Cross-Chain Bridge, relayers facilitate the transfer of tokens between chains.

### Reserve Ratio
The ratio of collateral value to the value of tokens in circulation. STAB3L maintains a minimum reserve ratio to ensure the stability of the system.

## S

### Smart Contract
Self-executing code deployed on a blockchain that automatically enforces the terms of an agreement. STAB3L uses smart contracts for tokenization, marketplace functionality, governance, and more.

### sSTB Token (sSTB)
The main utility token of the STAB3L platform, pegged to 1 CU (valued at $0.06 at launch). sSTB is used for fee payments, staking, and liquidity provision.

### Staking
The process of locking up tokens to support network operations and earn rewards. STAB3L offers staking programs for both sSTB and rSTB tokens.

### STB Governance Token (rSTB)
The governance and rewards token of the STAB3L platform, used for voting on proposals and earning rewards. rSTB appreciates in value as the protocol grows.

### Standardization Algorithm
An algorithm that normalizes benchmark results across different hardware configurations to ensure that CUs from different providers are comparable and interchangeable.

## T

### Timelock
A security feature that delays the execution of certain actions, giving users time to react. STAB3L implements timelocks for governance actions and bridge operations.

### Token
A digital asset that represents a certain value or utility within a blockchain ecosystem. STAB3L has a dual-token system (sSTB and rSTB) plus CU tokens.

### Trusted Execution Environment (TEE)
A secure area within a processor that ensures the confidentiality and integrity of code and data. STAB3L uses TEEs as one method for verifying compute resources.

## V

### Verification
The process of confirming the authenticity and performance of compute resources. STAB3L uses Zero-Knowledge Proofs (ZKPs) or Trusted Execution Environments (TEEs) for verification.

### Volatility
The degree of variation in a trading price over time. STAB3L aims to reduce compute cost volatility from ±30% to <5%, creating a more predictable environment for AI development, blockchain operations, and scientific research.

## Z

### Zero-Knowledge Proof (ZKP)
A cryptographic method that allows one party to prove to another that a statement is true without revealing any additional information. STAB3L uses ZKPs as one method for verifying compute resources.

---

{% hint style="info" %}
This glossary is regularly updated as new terms are introduced to the STAB3L ecosystem. If you encounter a term that is not defined here, please contact us at [support@stab3l.com](mailto:support@stab3l.com).
{% endhint %} 