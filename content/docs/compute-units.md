---
title: Understanding Compute Units
description: Learn about standardized compute units in STAB3L
category: Core Concepts
order: 1
---

# Understanding Compute Units

Compute Units (CUs) are the fundamental building blocks of the STAB3L ecosystem. They represent standardized, verified, and tokenized compute resources that can be traded, transferred, and redeemed across different chains.

{% hint style="info" %}
Compute Units are implemented as ERC-1155 tokens, allowing for efficient batch transfers and multiple token types within a single contract.
{% endhint %}

## What is a Compute Unit?

A Compute Unit (CU) is a standardized measure of computational power that includes:

- Processing power (CPU/GPU)
- Memory (RAM)
- Storage (SSD/HDD)
- Network bandwidth
- Duration of availability

Each CU token represents a specific amount of standardized compute resources from a particular provider, with a defined value and, optionally, an expiration date.

## Standardization Process

The standardization process ensures that CUs from different providers are comparable and interchangeable:

<div class="mermaid math-ignore">
flowchart TD
    A[Provider submits compute resources] --> B[Benchmarking]
    B --> C[Verification via ZKP or TEE]
    C --> D[Standardization algorithm]
    D --> E[CU value assignment]
    E --> F[CU token minting]
</div>

### Benchmarking

Providers run standardized benchmarks on their compute resources, which measure:

- CPU performance (single and multi-threaded)
- GPU performance (for applicable resources)
- Memory bandwidth and latency
- Storage read/write speeds
- Network throughput and latency

### Verification

The benchmark results are verified using one of two methods:

{% tabs %}
{% tab title="Zero-Knowledge Proofs (ZKPs)" %}
ZKPs allow providers to prove they have run the benchmarks correctly without revealing the underlying hardware details:

1. Provider runs benchmarks and generates a proof
2. Proof is submitted to the STAB3L platform
3. Verifiers check the proof's validity
4. If valid, the benchmark results are accepted

**Benefits:**
- Privacy-preserving
- Cryptographically secure
- No trusted third party required
{% endtab %}

{% tab title="Trusted Execution Environments (TEEs)" %}
TEEs provide a secure environment for running benchmarks:

1. Provider runs benchmarks within a TEE (e.g., Intel SGX, AMD SEV)
2. TEE generates an attestation
3. Attestation is verified by the STAB3L platform
4. If valid, the benchmark results are accepted

**Benefits:**
- Hardware-level security
- Tamper-resistant execution
- Remote attestation capabilities
{% endtab %}
{% endtabs %}

### Standardization Algorithm

The verified benchmark results are processed by the standardization algorithm, which:

1. Normalizes the results across different hardware configurations
2. Applies weights to different performance aspects based on their importance
3. Calculates a standardized CU value

## CU Token Structure

Each CU token contains the following information:

| Field | Description |
|-------|-------------|
| Token ID | Unique identifier for the CU token |
| CU Hash | Hash of the CU data, including benchmark results |
| CU Value | Standardized value of the compute resources |
| Provider ID | Identifier of the provider who minted the token |
| Expiration Timestamp | Optional timestamp when the CU token expires |

## Minting Process

The minting process creates new CU tokens based on verified compute resources:

1. Provider submits compute resources for verification
2. Once verified, provider deposits collateral (typically 120% of CU value)
3. MintingAgent contract mints CU tokens
4. Provider receives CU tokens and can sell them on the marketplace

{% hint style="warning" %}
Providers must maintain sufficient collateral to back their minted CU tokens. If the collateral falls below the required ratio, the provider may face liquidation.
{% endhint %}

## Redemption Process

Users can redeem CU tokens to access the underlying compute resources:

1. User selects CU tokens to redeem
2. RedemptionAgent contract burns the CU tokens
3. Provider is notified of the redemption
4. Provider delivers the compute resources to the user
5. Once confirmed, a portion of the collateral is released to the provider

## Cross-Chain Compatibility

CU tokens can be transferred across different chains using the CrossChainBridge:

1. User locks CU tokens on the source chain
2. CrossChainBridge emits an event
3. Relayers confirm the event on the destination chain
4. Equivalent CU tokens are minted on the destination chain

This enables a truly interoperable compute resources marketplace across multiple blockchain ecosystems.

## Advanced Features

### Expiration and Renewal

CU tokens can have an expiration date, after which they can no longer be redeemed. Providers can offer renewal options for expired tokens.

### Fractional CUs

The ERC-1155 standard allows for fractional ownership of CU tokens, enabling users to purchase and redeem partial compute resources.

### Batch Operations

Users can perform batch operations on multiple CU tokens, such as:
- Minting multiple CU tokens in a single transaction
- Redeeming multiple CU tokens at once
- Transferring multiple CU tokens to different recipients

## Security Considerations

STAB3L implements several security measures to protect CU tokens:

- Multi-signature requirements for critical operations
- Circuit breakers to pause operations in case of emergencies
- Collateralization requirements to ensure token backing
- Verification validity periods to ensure up-to-date information

{% hint style="success" %}
The standardization and verification of compute resources through CU tokens enables a transparent, efficient, and secure marketplace for compute power.
{% endhint %} 