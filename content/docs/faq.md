---
title: Frequently Asked Questions
description: Answers to common questions about the STAB3L platform
category: Support
order: 1
---

# Frequently Asked Questions

This document provides answers to common questions about the STAB3L platform, its features, and how to use it.

{% hint style="info" %}
If you don't find an answer to your question here, please visit our [Community Forum](https://forum.stab3l.io) or contact [support@stab3l.io](mailto:support@stab3l.io).
{% endhint %}

## General Questions

<details>
<summary>What is STAB3L?</summary>

STAB3L is a decentralized platform for standardizing, verifying, and trading compute resources through blockchain technology. It enables the tokenization of compute units (CUs) with cryptographic verification, creating a transparent, efficient, and secure marketplace for compute power across multiple blockchain ecosystems.
</details>

<details>
<summary>How does STAB3L work?</summary>

STAB3L works by:

1. **Standardizing** compute resources through benchmarking and a standardization algorithm
2. **Verifying** compute resources using Zero-Knowledge Proofs (ZKPs) or Trusted Execution Environments (TEEs)
3. **Tokenizing** verified compute resources as CU tokens (ERC-1155)
4. **Trading** CU tokens on the marketplace (spot, futures, options)
5. **Redeeming** CU tokens for actual compute resources

This creates a transparent and efficient marketplace for compute resources.
</details>

<details>
<summary>What blockchains does STAB3L support?</summary>

STAB3L primarily operates on Arbitrum for its main contracts and marketplace. Through the Cross-Chain Bridge, it also supports:

- Ethereum
- Polygon
- Optimism
- Solana

Additional blockchain integrations are planned for the future.
</details>

<details>
<summary>What are the tokens in the STAB3L ecosystem?</summary>

STAB3L has a dual-token system:

1. **sSTB Token (sSTB)**: The main utility token used for fee payments, staking, and liquidity provision.
2. **STB Governance Token (rSTB)**: The governance and rewards token used for voting on proposals and earning rewards.

Additionally, Compute Unit (CU) tokens represent standardized compute resources.
</details>

## Compute Units (CUs)

<details>
<summary>What is a Compute Unit (CU)?</summary>

A Compute Unit (CU) is a standardized measure of computational power that includes:

- Processing power (CPU/GPU)
- Memory (RAM)
- Storage (SSD/HDD)
- Network bandwidth
- Duration of availability

Each CU token represents a specific amount of standardized compute resources from a particular provider, with a defined value and, optionally, an expiration date.
</details>

<details>
<summary>How are CUs standardized?</summary>

CUs are standardized through a process that includes:

1. **Benchmarking**: Providers run standardized benchmarks on their compute resources
2. **Verification**: The benchmark results are verified using ZKPs or TEEs
3. **Standardization Algorithm**: The verified results are processed by an algorithm that normalizes them across different hardware configurations
4. **CU Value Assignment**: A standardized CU value is assigned based on the normalized results

This ensures that CUs from different providers are comparable and interchangeable.
</details>

<details>
<summary>How are CUs verified?</summary>

CUs are verified using one of two methods:

1. **Zero-Knowledge Proofs (ZKPs)**: Providers generate cryptographic proofs that they have run benchmarks correctly without revealing hardware details.

2. **Trusted Execution Environments (TEEs)**: Benchmarks are run within secure enclaves (like Intel SGX or AMD SEV) that provide hardware-level security and remote attestation.

Both methods ensure that the claimed compute resources are genuine and meet the specified standards.
</details>

<details>
<summary>Can CU tokens expire?</summary>

Yes, CU tokens can have an expiration date, after which they can no longer be redeemed. This is typically set by the provider when minting the tokens and reflects the duration for which they commit to providing the compute resources.

Providers may offer renewal options for expired tokens, allowing users to extend their access to the compute resources.
</details>

## For Users

<details>
<summary>How do I buy CU tokens?</summary>

To buy CU tokens:

1. Connect your wallet to the STAB3L platform
2. Navigate to the "Marketplace" section
3. Browse available CU tokens from different providers
4. Select the CU tokens you want to purchase
5. Specify the amount and confirm the transaction
6. Once the transaction is confirmed, you'll own the CU tokens

You can also place limit orders or participate in futures and options markets.
</details>

<details>
<summary>How do I redeem CU tokens?</summary>

To redeem CU tokens:

1. Navigate to the "Redeem" section
2. Select the CU tokens you want to redeem
3. Specify the amount and confirm the transaction
4. Follow the instructions to access your compute resources
5. The provider will deliver the compute resources as specified

The redemption process burns your CU tokens and notifies the provider to fulfill your request.
</details>

<details>
<summary>What happens if a provider doesn't fulfill my redemption?</summary>

If a provider fails to fulfill your redemption request:

1. The platform's dispute resolution system is activated
2. The provider's collateral may be used to compensate you
3. The provider's reputation score is negatively affected
4. In severe cases, the provider may be suspended from the platform

STAB3L ensures that providers are properly incentivized to fulfill redemption requests through collateral requirements and the reputation system.
</details>

<details>
<summary>How do I bridge CU tokens to another chain?</summary>

To bridge CU tokens to another chain:

1. Navigate to the "Bridge" section
2. Select the source chain (current chain)
3. Select the destination chain
4. Select the CU tokens you want to bridge
5. Specify the amount
6. Review the fee and confirm the transaction
7. Wait for confirmations (typically 5-20 minutes depending on chains)
8. Receive your CU tokens on the destination chain

The bridge uses a lock-and-mint mechanism to transfer tokens between chains.
</details>

## For Providers

<details>
<summary>How do I become a provider?</summary>

To become a provider:

1. Connect your wallet to the STAB3L platform
2. Navigate to the "Provider" section
3. Click on "Register as Provider"
4. Fill in your provider details
5. Submit your registration
6. Wait for approval from the STAB3L governance

Once approved, you can start verifying your compute resources and minting CU tokens.
</details>

<details>
<summary>What are the requirements to be a provider?</summary>

To become a STAB3L provider, you must meet the following requirements:

- **Hardware**: Server-grade compute resources to offer
- **Uptime**: Guaranteed availability of 99.9%
- **Network**: Network connectivity of at least 1 Gbps
- **Security**: Industry-standard security measures
- **Collateral**: Ability to deposit collateral (120% of CU value)
- **Identity**: KYC verification (required for large providers)

These requirements are enforced through the governance process.
</details>

<details>
<summary>How do I mint CU tokens?</summary>

To mint CU tokens:

1. Verify your compute resources using ZKPs or TEEs
2. Navigate to the "Mint" section
3. Select the verified compute resources
4. Specify the amount of CU tokens to mint
5. Deposit the required collateral (typically 120% of CU value)
6. Confirm the minting transaction
7. Your CU tokens will be minted and available for sale

You can then list your CU tokens on the marketplace.
</details>

<details>
<summary>What happens if my collateralization ratio falls below the minimum?</summary>

If your collateralization ratio falls below the minimum (110%):

1. You'll receive a notification to add more collateral
2. You'll have a grace period (typically 24 hours) to restore the ratio
3. If you fail to restore the ratio, a portion of your CU tokens may be liquidated
4. The liquidation proceeds will be used to maintain the collateralization of your remaining tokens

To avoid liquidation, it's recommended to maintain a healthy collateralization ratio (150% or higher).
</details>

## Marketplace

<details>
<summary>What types of markets are available on STAB3L?</summary>

STAB3L offers three types of markets:

1. **Spot Market**: Immediate trading of CU tokens between buyers and sellers
2. **Futures Market**: Trading contracts for future delivery of compute resources
3. **Options Market**: Trading contracts that give the right, but not the obligation, to buy (call) or sell (put) CU tokens at a predetermined price

Each market serves different trading needs and strategies.
</details>

<details>
<summary>How are fees structured on the marketplace?</summary>

The fee structure for the STAB3L marketplace is as follows:

| Market Type | Trading Fee | Maker Rebate | rSTB Rewards |
|-------------|-------------|--------------|-------------|
| Spot        | 0.25%       | 0.05%        | 0.10%       |
| Futures     | 0.05%       | 0.02%        | 0.05%       |
| Options     | 0.30%       | 0.10%        | 0.15%       |

Fees can be reduced by staking rSTB tokens. Stake 1,000 rSTB to reduce fees by 10%, up to a maximum of 50% reduction for 10,000 rSTB.
</details>

<details>
<summary>How do futures contracts work on STAB3L?</summary>

Futures contracts on STAB3L work as follows:

1. **Contract Creation**: A seller creates a futures contract specifying the CU token type, amount, delivery date, and price per token
2. **Contract Purchase**: A buyer purchases the futures contract, paying a margin (typically 10-20% of the contract value)
3. **Settlement**: On the delivery date, either:
   - **Physical Settlement**: The seller delivers the CU tokens and the buyer pays the remaining amount
   - **Cash Settlement**: The difference between the contract price and the market price is settled in cash

Futures trading involves significant risk and requires understanding of margin requirements and potential liquidation.
</details>

<details>
<summary>How do options contracts work on STAB3L?</summary>

Options contracts on STAB3L work as follows:

- **Call Options**: Give the holder the right to buy CU tokens at the strike price
  - **Buyer**: Pays premium, has right to buy CU tokens
  - **Seller**: Receives premium, has obligation to sell CU tokens if option is exercised

- **Put Options**: Give the holder the right to sell CU tokens at the strike price
  - **Buyer**: Pays premium, has right to sell CU tokens
  - **Seller**: Receives premium, has obligation to buy CU tokens if option is exercised

STAB3L options are European style, meaning they can only be exercised at expiration. Option sellers must fully collateralize their positions.
</details>

## Governance

<details>
<summary>How does governance work on STAB3L?</summary>

STAB3L is governed by its community through a decentralized governance system:

1. **Proposal Creation**: rSTB holders with at least 1,000 tokens can create proposals
2. **Discussion**: Community discusses proposals on the forum
3. **Voting**: rSTB holders vote on proposals (1 token = 1 vote)
4. **Execution**: Approved proposals are implemented after a timelock period

For a proposal to pass, it must meet the following requirements:
- **Quorum**: At least 4% of total rSTB supply must vote
- **Majority**: More than 50% of votes must be "For"
- **Duration**: Voting period lasts 5 days
</details>

<details>
<summary>What can be changed through governance?</summary>

The following parameters and aspects can be modified through governance:

- Protocol fees and fee distribution
- Collateralization requirements
- Verification methods and standards
- Bridge parameters and supported chains
- Treasury fund allocation
- Provider requirements and incentives
- Market parameters (circuit breakers, etc.)
- Token emission schedules

Critical protocol parameters and contracts are controlled by a 7/11 multi-signature wallet for additional security.
</details>

<details>
<summary>How do I participate in governance?</summary>

To participate in governance:

1. Acquire rSTB tokens through staking, trading, or participating in the ecosystem
2. Navigate to the "Governance" section of the platform
3. Browse active proposals or create your own (requires 1,000 rSTB)
4. Vote on proposals: "For," "Against," or "Abstain"
5. Participate in forum discussions to help refine proposals

You can also delegate your voting power to another address if you don't want to actively vote on every proposal.
</details>

<details>
<summary>What is the timelock period for governance actions?</summary>

Governance actions are subject to timelocks:

- **Standard Timelock**: 2 days for regular proposals
- **Emergency Timelock**: 6 hours for emergency actions (requires 9/11 multi-sig approval)

The timelock period allows the community to review and react to approved proposals before they are implemented, providing an additional layer of security.
</details>

## Tokens and Economics

<details>
<summary>What is the total supply of sSTB and rSTB tokens?</summary>

- **sSTB Token**: Total supply of 10 billion tokens
- **rSTB Token**: Total supply of 1 billion tokens

Both tokens follow a deflationary emission schedule with burning mechanisms to create deflationary pressure over time.
</details>

<details>
<summary>How are tokens distributed?</summary>

**sSTB Token Distribution**:
- Community & Ecosystem: 40% (4 billion)
- Treasury: 25% (2.5 billion)
- Team & Advisors: 15% (1.5 billion)
- Investors: 15% (1.5 billion)
- Liquidity Mining: 5% (0.5 billion)

**rSTB Token Distribution**:
- Community: 40% (400 million)
- Team: 20% (200 million)
- Treasury: 20% (200 million)
- Investors: 15% (150 million)
- Advisors: 5% (50 million)
</details>

<details>
<summary>What are the staking benefits for sSTB and rSTB tokens?</summary>

**sSTB Staking Benefits**:
- Fee reduction (10-50% depending on tier)
- Boosted rewards (5-25% depending on tier)
- Priority access to new features

**rSTB Staking Benefits**:
- Fee reduction (10-50% depending on tier)
- Increased governance weight (1x-3x depending on tier)
- Governance rewards
- Boosted yields in liquidity mining and staking programs
</details>

<details>
<summary>How do token burning mechanisms work?</summary>

Both tokens include burning mechanisms:

- **sSTB**: 10% of all fees collected in sSTB are burned
- **rSTB**: 5% of all rewards distributed are burned

Additionally, the treasury may periodically buy back and burn tokens based on governance decisions. These mechanisms create deflationary pressure, potentially increasing the value of remaining tokens over time.
</details>

## Technical Questions

<details>
<summary>What smart contract standards does STAB3L use?</summary>

STAB3L uses the following smart contract standards:

- **CU Tokens**: ERC-1155 multi-token standard
- **sSTB Token**: ERC-20 standard
- **rSTB Token**: ERC-20 standard with voting capabilities
- **Marketplace**: Custom implementation with EIP-712 signatures for gasless listings
- **Bridge**: Custom implementation compatible with major cross-chain messaging protocols

All contracts are implemented in Solidity and follow best practices for security and gas efficiency.
</details>

<details>
<summary>How does the Cross-Chain Bridge work technically?</summary>

The STAB3L Cross-Chain Bridge works through a lock-and-mint mechanism:

1. **Lock**: User locks CU tokens in the bridge contract on the source chain
2. **Event Emission**: The bridge contract emits an event with the lock details
3. **Relayer Monitoring**: Multiple relayers monitor for these events
4. **Consensus**: Relayers reach consensus on the validity of the lock event
5. **Proof Submission**: Relayers submit proof to the destination chain
6. **Verification**: The bridge contract on the destination chain verifies the proof
7. **Minting**: If valid, equivalent CU tokens are minted on the destination chain

The bridge includes security measures like multi-relayer consensus, value limits, and circuit breakers.
</details>

<details>
<summary>How are Zero-Knowledge Proofs implemented?</summary>

STAB3L's Zero-Knowledge Proof implementation:

1. **Circuit Design**: Custom ZK circuits designed for compute resource verification
2. **Prover Software**: Providers run prover software that generates ZK proofs
3. **On-chain Verification**: Smart contracts verify the ZK proofs
4. **Technology Stack**: Uses industry-standard ZK frameworks (Circom, Groth16)
5. **Optimization**: Optimized for gas efficiency and proof generation speed

The ZK system allows providers to prove they have run benchmarks correctly without revealing hardware details.
</details>

<details>
<summary>How are Trusted Execution Environments integrated?</summary>

STAB3L's TEE integration:

1. **Enclave Setup**: Providers set up TEE enclaves (Intel SGX, AMD SEV, etc.)
2. **Benchmark Execution**: Benchmarks run within the secure enclave
3. **Attestation Generation**: The enclave generates a cryptographic attestation
4. **Attestation Verification**: Smart contracts verify the attestation
5. **Supported TEEs**: Intel SGX, AMD SEV, AWS Nitro Enclaves, Azure Confidential Computing

The TEE system provides hardware-level security and remote attestation capabilities.
</details>

## Security

<details>
<summary>How secure are the smart contracts?</summary>

STAB3L smart contracts undergo rigorous security measures:

- **Formal Verification**: Critical contracts are formally verified
- **Multiple Audits**: Contracts are audited by leading security firms
- **Bug Bounty Program**: Up to $250,000 for critical vulnerabilities
- **Open Source**: All contracts are open source and can be reviewed by the community
- **Timelock Mechanisms**: Changes to contracts are subject to timelock periods
- **Multi-Signature Control**: Critical parameters controlled by 7/11 multi-sig

Audit reports are available in the [Security section](https://stab3l.io/security) of our website.
</details>

<details>
<summary>What happens in case of a security incident?</summary>

In case of a security incident:

1. **Detection**: Monitoring systems detect the incident or it's reported by users/researchers
2. **Assessment**: The security team assesses the severity and impact
3. **Containment**: Circuit breakers may be triggered to pause affected components
4. **Communication**: Users are notified through official channels
5. **Resolution**: The issue is fixed and thoroughly tested
6. **Recovery**: Systems are restored to normal operation
7. **Post-Incident Analysis**: A comprehensive review is conducted
8. **Disclosure**: A detailed incident report is published

STAB3L maintains an insurance fund that may be used to compensate affected users in case of significant incidents.
</details>

<details>
<summary>How is the bridge secured against attacks?</summary>

The STAB3L Cross-Chain Bridge implements multiple security measures:

- **Multi-Relayer Consensus**: Requires confirmations from multiple independent relayers
- **Minimum Confirmations**: Transactions require a minimum number of block confirmations
- **Value Limits**: Maximum transfer limits to mitigate potential exploits
- **Circuit Breaker**: Automatically pauses bridge operations if suspicious activity is detected
- **Timelock**: 48-hour timelock for resuming operations after a circuit breaker event
- **Monitoring**: Real-time monitoring of bridge activity with automated alerts
- **Regular Audits**: Specialized audits of bridge components

These measures create multiple layers of security to protect against various attack vectors.
</details>

<details>
<summary>How are private keys and sensitive data protected?</summary>

STAB3L protects private keys and sensitive data through:

- **Key Management**: Secure key management using hardware security modules (HSMs)
- **Encryption**: End-to-end encryption for sensitive data
- **Access Control**: Strict access controls based on the principle of least privilege
- **Secure Enclaves**: Sensitive operations performed in secure enclaves
- **Regular Rotation**: Regular rotation of API keys and credentials
- **Monitoring**: Continuous monitoring for unauthorized access attempts
- **Compliance**: Adherence to industry security standards and best practices

Users are also encouraged to use hardware wallets and follow security best practices.
</details>

## Troubleshooting

<details>
<summary>My transaction is pending for a long time. What should I do?</summary>

If your transaction has been pending for a long time:

1. Check the network status on [status.stab3l.io](https://status.stab3l.io)
2. Verify that you have sufficient gas for the transaction
3. If using MetaMask, you can try to speed up the transaction or cancel it
4. For bridge transactions, check the transaction status in the "Bridge" section
5. If the issue persists, contact support with your transaction hash

Note that during periods of high network congestion, transactions may take longer to confirm.
</details>

<details>
<summary>I can't connect my wallet. What should I do?</summary>

If you're having trouble connecting your wallet:

1. Refresh the page and try again
2. Ensure you're using a supported wallet (MetaMask, WalletConnect, etc.)
3. Check that you're on the correct network (Arbitrum, Ethereum, etc.)
4. Clear your browser cache and cookies
5. Try using a different browser or device
6. Disable any browser extensions that might interfere with wallet connections
7. If using a hardware wallet, ensure it's properly connected and unlocked

If the issue persists, contact support with details of your wallet and browser.
</details>

<details>
<summary>My CU tokens are not showing up after bridging. What should I do?</summary>

If your CU tokens are not showing up after bridging:

1. Check the bridge transaction status in the "Bridge" section
2. Verify that you're connected to the correct destination network
3. Allow sufficient time for confirmations (typically 5-20 minutes depending on chains)
4. Check that you have sufficient gas on the destination chain for token receipt
5. Try refreshing your wallet or reconnecting it
6. Check the bridge explorer for your transaction status

If the transaction shows as completed but tokens are not visible, contact support with your transaction hash.
</details>

<details>
<summary>I'm a provider and can't fulfill a redemption request. What should I do?</summary>

If you're a provider and can't fulfill a redemption request:

1. Contact the user to explain the situation and provide an estimated resolution time
2. If it's a temporary issue, request an extension through the platform
3. If it's a permanent issue, you may need to compensate the user through the dispute resolution system
4. Contact support to explain the situation and get assistance
5. Be transparent and communicative to maintain your reputation

Failure to fulfill redemption requests may result in penalties, including collateral slashing and reputation damage, so it's important to address issues promptly.
</details>

## Platform Updates and Roadmap

<details>
<summary>What's the current version of the platform?</summary>

The current version of the STAB3L platform is v1.2.0, released on July 15, 2023. This version includes:

- Enhanced marketplace features
- Improved verification system
- Additional chain support for the bridge
- Performance optimizations
- Security enhancements

You can view the full changelog on our [GitHub repository](https://github.com/stab3l/stab3l-platform).
</details>

<details>
<summary>What features are coming next?</summary>

Upcoming features planned for the next releases include:

- **Q3 2023**:
  - Futures market launch
  - Additional chain integrations (Base, Avalanche)
  - Enhanced provider dashboard
  - Mobile app beta

- **Q4 2023**:
  - Options market launch
  - Advanced analytics tools
  - Institutional features
  - API enhancements

- **Q1 2024**:
  - Developer SDK
  - Integration with major DeFi protocols
  - Enterprise partnerships
  - Advanced governance features

The roadmap is subject to change based on community feedback and governance decisions.
</details>

<details>
<summary>How often are updates released?</summary>

STAB3L follows a regular update schedule:

- **Minor Updates**: Released every 2-4 weeks, including bug fixes and small improvements
- **Major Updates**: Released every 3-4 months, including new features and significant improvements
- **Security Updates**: Released as needed, prioritized based on severity

All updates are announced in advance on our [blog](https://blog.stab3l.io) and [Twitter](https://twitter.com/stab3l_io).
</details>

<details>
<summary>How can I suggest new features?</summary>

You can suggest new features through several channels:

1. **Governance Proposals**: Create a formal proposal if you hold sufficient rSTB tokens
2. **Community Forum**: Post your suggestion on the [STAB3L Forum](https://forum.stab3l.io)
3. **Discord**: Share your idea in the #feature-requests channel on our [Discord server](https://discord.gg/stab3l)
4. **GitHub**: Create an issue or pull request on our [GitHub repository](https://github.com/stab3l/stab3l-platform)

The STAB3L team and community regularly review and discuss feature suggestions.
</details>

## Getting Help

If you need additional help:

- **Documentation**: Browse our comprehensive [documentation](https://docs.stab3l.io)
- **Community Forum**: Ask questions on the [STAB3L Forum](https://forum.stab3l.io)
- **Discord**: Join our [Discord server](https://discord.gg/stab3l) for real-time support
- **Email Support**: Contact [support@stab3l.io](mailto:support@stab3l.io) for personalized assistance
- **Office Hours**: Join our weekly office hours (Thursdays at 2 PM UTC) for live Q&A

{% hint style="success" %}
We're committed to providing excellent support to all STAB3L users and community members.
{% endhint %} 