---
title: Understanding Compute Units
description: Learn about standardized compute units in STAB3L
category: Core Concepts
order: 1
---

# Understanding Compute Units

Compute Units (CUs) are the fundamental building blocks of the STAB3L ecosystem. They represent standardized and verified compute resources that are used to back the sSTB stablecoin.

{% hint style="warning" %}
**Important**: CU tokens are NOT tradable assets. They are temporary tokens that are burned immediately when exchanged for sSTB. This burning mechanism is crucial for maintaining the peg and ensuring that each sSTB is backed by real compute resources.
{% endhint %}

{% hint style="info" %}
For a more detailed technical explanation of Compute Units, see the [System Architecture & Mathematical Model](/docs/whitepaper/system-architecture) section of the whitepaper, specifically section 4.1 on Compute Unit Definition.
{% endhint %}

## What is a Compute Unit?

A Compute Unit (CU) is a standardized measure of computational power that includes:

- Processing power (CPU/GPU)
- Memory (RAM)
- Storage (SSD/HDD)
- Network bandwidth
- Duration of availability

Each CU token represents a specific amount of standardized compute resources from a particular provider. In the STAB3L ecosystem, 1 CU is defined as 10^15 FLOPs (floating-point operations per second) and is valued at $0.06 at launch.

{% hint style="info" %}
The definition and value of 1 CU will be reviewed and potentially adjusted quarterly by the DAO through governance voting to ensure the CU standard remains relevant as compute technology evolves. For more information on governance, see the [Governance](/docs/governance) documentation.
{% endhint %}

## Standardization Process

The standardization process ensures that CUs from different providers are comparable and consistently valued:

<div class="mermaid math-ignore">
flowchart TD
    A[Provider submits compute resources] --> B[Benchmarking]
    B --> C[Verification via ZKP or TEE]
    C --> D[Standardization algorithm]
    D --> E[CU value assignment]
    E --> F[Temporary CU token creation]
    F --> G[Immediate exchange for sSTB]
    G --> H[CU token burning]
    H --> I[Provider stakes collateral]
</div>

### Benchmarking

Providers run standardized benchmarks on their compute resources, which measure:

- CPU performance (single and multi-threaded)
- GPU performance (for applicable resources)
- Memory bandwidth and latency
- Storage read/write speeds
- Network throughput and latency

For detailed information on the benchmarking process, see the [Verification System](/docs/verification-system) documentation.

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

For more details on ZKP verification, see the [Verification System](/docs/verification-system#zero-knowledge-proofs) documentation.
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

For more details on TEE verification, see the [Verification System](/docs/verification-system#trusted-execution-environments) documentation.
{% endtab %}
{% endtabs %}

### Standardization Algorithm

The verified benchmark results are processed by the standardization algorithm, which:

1. Normalizes the results across different hardware configurations
2. Applies weights to different performance aspects based on their importance
3. Calculates a standardized CU value

For a detailed mathematical explanation of the standardization algorithm, see the [System Architecture](/docs/whitepaper/system-architecture#42-price-dynamics) section of the whitepaper.

## CU Token Structure

Each temporary CU token contains the following information:

| Field | Description |
|-------|-------------|
| Token ID | Unique identifier for the CU token |
| CU Hash | Hash of the CU data, including benchmark results |
| CU Value | Standardized value of the compute resources |
| Provider ID | Identifier of the provider who created the token |
| Verification Timestamp | Timestamp when the compute resources were verified |
| Expiration Timestamp | Optional timestamp when the CU token expires |

## Compute-Backed Stablecoin Mechanism

The core of STAB3L is the compute-backed stablecoin mechanism:

1. **Compute Provider Verification**: Providers verify their compute resources, which are standardized into CUs.
2. **Staking Period Selection**: Providers choose a staking period (minimum 7 days), with longer periods earning higher rewards.
3. **Temporary CU Token Creation**: Verified compute resources are represented as temporary CU tokens.
4. **Immediate Exchange for sSTB**: CU tokens are immediately exchanged 1:1 for sSTB.
5. **CU Token Burning**: CU tokens are burned upon exchange, ensuring they are not tradable and maintaining the peg.
6. **Automatic sSTB Staking**: The newly minted sSTB tokens are automatically staked for the chosen period.
7. **Provider Collateral Staking**: Providers stake collateral (minimum 120% of CU value) for the duration they commit their compute resources.
8. **rSTB Rewards**: Providers earn rSTB rewards throughout the staking period.
9. **sSTB Utilization**: Users can freely trade sSTB or redeem it for actual compute resources at the stable price of $0.06 per CU.

For more information on the tokenomics of sSTB and rSTB, see the [Tokenomics](/docs/tokenomics) documentation.

{% hint style="info" %}
While CU tokens themselves are not tradable and are burned immediately, the sSTB tokens that they back can be freely traded, transferred, and used across the STAB3L ecosystem.
{% endhint %}

## Provider Staking Period

When providers offer their compute resources:

1. They choose a staking period (minimum 7 days)
2. Their collateral is locked for this period (minimum 120% of CU value)
3. They commit to providing the compute resources for the entire period
4. Longer staking periods earn higher rewards in rSTB tokens
5. Early unstaking incurs penalties on the collateral

For a detailed guide on becoming a provider, see the [Provider Guide](/docs/provider-guide) documentation.

{% hint style="success" %}
The longer the staking period, the higher the rSTB rewards. This incentivizes long-term commitment from providers, enhancing the stability of the ecosystem.
{% endhint %}

## Redemption Process

Users can redeem sSTB tokens to access the underlying compute resources:

1. User selects the amount of sSTB to redeem
2. RedemptionAgent contract burns the sSTB tokens
3. Provider is notified of the redemption
4. Provider delivers the compute resources to the user
5. Once confirmed, a portion of the collateral is released to the provider

For a detailed explanation of the redemption process, see the [Redemption Process](/docs/redemption-process) documentation.

## Security Considerations

STAB3L implements several security measures to protect the CU verification and sSTB minting process:

- Multi-signature requirements for critical operations
- Circuit breakers to pause operations in case of emergencies
- Collateralization requirements to ensure token backing
- Verification validity periods to ensure up-to-date information

For more information on security measures, see the [Security](/docs/security) documentation.

{% hint style="success" %}
The standardization and verification of compute resources through the CU system enables a transparent, efficient, and secure marketplace for compute power, all while maintaining the stability of the sSTB token.
{% endhint %} 