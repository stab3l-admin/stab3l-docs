---
title: Tokenomics
description: Learn about the STAB3L token system and economics
category: Core Concepts
order: 2
---

# Tokenomics

The STAB3L ecosystem features a dual-token system designed to separate utility and governance functions, creating a balanced and sustainable economic model.

{% hint style="info" %}
The STAB3L token system was updated to include two distinct tokens: STAB3L (utility token) and STB-GOV (governance token).
{% endhint %}

## Token Overview

STAB3L uses two primary tokens:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">STAB3L Token (STAB3L)</h3>
    <p>The main utility token of the ecosystem</p>
    <p><strong>Total Supply:</strong> 10 billion tokens</p>
    <p><strong>Contract:</strong> <code>STAB3LToken.sol</code></p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">STB Governance Token (STB-GOV)</h3>
    <p>The governance and rewards token</p>
    <p><strong>Total Supply:</strong> 1 billion tokens</p>
    <p><strong>Contract:</strong> <code>STBGOVToken.sol</code></p>
  </div>
</div>

## STAB3L Token (STAB3L)

The STAB3L token is the main utility token of the ecosystem, used for:

- Paying fees on the platform
- Staking for reduced fees
- Providing liquidity
- Cross-chain bridge fees

### Token Distribution

The STAB3L token distribution is designed to ensure wide distribution and long-term sustainability:

<div class="pie-chart">
  <img src="https://quickchart.io/chart?c=%7Btype%3A%27pie%27%2Cdata%3A%7Blabels%3A%5B%27Community+%26+Ecosystem%27%2C%27Treasury%27%2C%27Team+%26+Advisors%27%2C%27Investors%27%2C%27Liquidity+Mining%27%5D%2Cdatasets%3A%5B%7Bdata%3A%5B40%2C25%2C15%2C15%2C5%5D%2CbackgroundColor%3A%5B%27%23FF6384%27%2C%27%2336A2EB%27%2C%27%23FFCE56%27%2C%27%234BC0C0%27%2C%27%239966FF%27%5D%7D%5D%7D%7D" alt="STAB3L Token Distribution" />
</div>

| Allocation | Percentage | Amount | Vesting |
|------------|------------|--------|---------|
| Community & Ecosystem | 40% | 4 billion | 4-year linear vesting |
| Treasury | 25% | 2.5 billion | Controlled by governance |
| Team & Advisors | 15% | 1.5 billion | 1-year cliff, 3-year linear vesting |
| Investors | 15% | 1.5 billion | 6-month cliff, 2-year linear vesting |
| Liquidity Mining | 5% | 0.5 billion | Released over 4 years |

### Token Utility

The STAB3L token has several utilities within the ecosystem:

#### Fee Payments

Users can pay fees with STAB3L tokens and receive a discount:

- **Marketplace Fees**: 10% discount when paying with STAB3L
- **Bridge Fees**: 10% discount when paying with STAB3L
- **Minting Fees**: 10% discount when paying with STAB3L

#### Staking

Users can stake STAB3L tokens to receive benefits:

- **Fee Reduction**: Up to 50% fee reduction based on staking amount
- **Boosted Rewards**: Increased STB-GOV rewards for other activities
- **Priority Access**: Early access to new features and markets

#### Liquidity Provision

Users can provide liquidity for STAB3L pairs and earn rewards:

- **Trading Fees**: Earn a share of trading fees
- **STB-GOV Rewards**: Earn STB-GOV tokens for providing liquidity
- **Boosted APY**: Higher APY for longer commitment periods

## STB Governance Token (STB-GOV)

The STB-GOV token is the governance and rewards token of the ecosystem, used for:

- Voting on governance proposals
- Staking for additional benefits
- Earning rewards for ecosystem participation

### Token Distribution

The STB-GOV token distribution is designed to ensure decentralized governance:

<div class="pie-chart">
  <img src="https://quickchart.io/chart?c=%7Btype%3A%27pie%27%2Cdata%3A%7Blabels%3A%5B%27Community%27%2C%27Team%27%2C%27Treasury%27%2C%27Investors%27%2C%27Advisors%27%5D%2Cdatasets%3A%5B%7Bdata%3A%5B40%2C20%2C20%2C15%2C5%5D%2CbackgroundColor%3A%5B%27%23FF6384%27%2C%27%2336A2EB%27%2C%27%23FFCE56%27%2C%27%234BC0C0%27%2C%27%239966FF%27%5D%7D%5D%7D%7D" alt="STB-GOV Token Distribution" />
</div>

| Allocation | Percentage | Amount | Vesting |
|------------|------------|--------|---------|
| Community | 40% | 400 million | Released through staking rewards |
| Team | 20% | 200 million | 1-year cliff, 4-year linear vesting |
| Treasury | 20% | 200 million | Controlled by governance |
| Investors | 15% | 150 million | 6-month cliff, 2-year linear vesting |
| Advisors | 5% | 50 million | 6-month cliff, 2-year linear vesting |

### Token Utility

The STB-GOV token has several utilities within the ecosystem:

#### Governance

STB-GOV token holders can participate in governance:

- **Proposal Creation**: Requires 1,000 STB-GOV tokens
- **Voting**: Vote on proposals with weight proportional to holdings
- **Delegation**: Delegate voting power to other addresses

#### Staking

Users can stake STB-GOV tokens for additional benefits:

- **Governance Rewards**: Earn rewards for participating in governance
- **Fee Reduction**: Up to 50% fee reduction on all platform activities
- **Boosted Yields**: Higher yields in liquidity mining and staking programs

#### Rewards

Users earn STB-GOV tokens as rewards for various activities:

- **CU Staking**: Stake CU tokens to earn STB-GOV rewards
- **Liquidity Provision**: Provide liquidity to earn STB-GOV rewards
- **Trading**: Earn STB-GOV rewards based on trading volume
- **Provider Rewards**: Compute providers earn STB-GOV for reliable service

## Token Economics

### Emission Schedule

Both tokens follow a deflationary emission schedule:

{% tabs %}
{% tab title="STAB3L Emission" %}
The STAB3L token emission follows a 4-year schedule:

- **Year 1**: 40% of total community allocation
- **Year 2**: 30% of total community allocation
- **Year 3**: 20% of total community allocation
- **Year 4**: 10% of total community allocation

After Year 4, any additional emission requires governance approval.
{% endtab %}

{% tab title="STB-GOV Emission" %}
The STB-GOV token emission follows a 5-year schedule:

- **Year 1**: 30% of total community allocation
- **Year 2**: 25% of total community allocation
- **Year 3**: 20% of total community allocation
- **Year 4**: 15% of total community allocation
- **Year 5**: 10% of total community allocation

After Year 5, emission reduces to 2% annual inflation, subject to governance approval.
{% endtab %}
{% endtabs %}

### Token Burning

Both tokens include burning mechanisms to create deflationary pressure:

- **STAB3L**: 10% of all fees collected in STAB3L are burned
- **STB-GOV**: 5% of all rewards distributed are burned

### Value Accrual

The tokens accrue value through different mechanisms:

#### STAB3L Value Accrual

- **Fee Discounts**: Creates demand for holding STAB3L
- **Staking Benefits**: Encourages locking tokens, reducing circulating supply
- **Burning Mechanism**: Reduces total supply over time
- **Treasury Buybacks**: Treasury may periodically buy back and burn tokens

#### STB-GOV Value Accrual

- **Governance Rights**: Value from decision-making power
- **Fee Sharing**: Portion of platform fees distributed to stakers
- **Staking Rewards**: Additional rewards for staking
- **Protocol Revenue**: Share of protocol revenue directed to STB-GOV stakers

## Staking Programs

STAB3L offers several staking programs:

### STAB3L Staking

Stake STAB3L tokens to earn benefits:

| Staking Tier | Amount | Fee Reduction | Boosted Rewards | Lock Period |
|--------------|--------|---------------|-----------------|-------------|
| Bronze | 1,000 STAB3L | 10% | 5% | 1 month |
| Silver | 10,000 STAB3L | 20% | 10% | 3 months |
| Gold | 100,000 STAB3L | 30% | 15% | 6 months |
| Platinum | 1,000,000 STAB3L | 50% | 25% | 12 months |

### STB-GOV Staking

Stake STB-GOV tokens to earn benefits:

| Staking Tier | Amount | Fee Reduction | Governance Weight | Lock Period |
|--------------|--------|---------------|-------------------|-------------|
| Basic | 100 STB-GOV | 10% | 1x | 1 month |
| Standard | 1,000 STB-GOV | 20% | 1.5x | 3 months |
| Premium | 10,000 STB-GOV | 35% | 2x | 6 months |
| Elite | 100,000 STB-GOV | 50% | 3x | 12 months |

### CU Token Staking

Stake CU tokens to earn STB-GOV rewards:

| CU Value | Base APY | Boosted APY* | Lock Period |
|----------|----------|--------------|-------------|
| 1-100 | 5% | 7.5% | 1 month |
| 101-1,000 | 7% | 10.5% | 3 months |
| 1,001-10,000 | 10% | 15% | 6 months |
| 10,001+ | 12% | 18% | 12 months |

*Boosted APY available when also staking STB-GOV tokens

## Liquidity Mining

Provide liquidity to earn rewards:

| Liquidity Pair | Base APY | Boosted APY* | Duration |
|----------------|----------|--------------|----------|
| STAB3L/USDC | 20% | 30% | Ongoing |
| STB-GOV/USDC | 25% | 37.5% | Ongoing |
| STAB3L/ETH | 22% | 33% | Ongoing |
| STB-GOV/ETH | 27% | 40.5% | Ongoing |
| CU/USDC | 15% | 22.5% | Ongoing |

*Boosted APY available when also staking STB-GOV tokens

## Token Governance

The governance system uses the STB-GOV token for voting:

- **Proposal Creation**: Requires 1,000 STB-GOV tokens
- **Voting Power**: 1 STB-GOV = 1 vote
- **Quorum**: 4% of total STB-GOV supply required for a proposal to pass
- **Majority**: >50% of votes must be "For" for a proposal to pass
- **Timelock**: 2-day timelock for standard proposals, 6-hour timelock for emergency proposals

## Treasury Management

The STAB3L treasury manages funds for ecosystem development:

- **Revenue Sources**: Platform fees, token allocations
- **Expenditures**: Development, marketing, grants, liquidity provision
- **Investment Strategy**: Conservative approach with diversified assets
- **Transparency**: Quarterly reports on treasury activities
- **Governance**: Major expenditures require governance approval

## Conclusion

The STAB3L dual-token system creates a balanced economic model that separates utility and governance functions. By holding and staking these tokens, users can participate in the ecosystem, earn rewards, and help shape the future of the platform through governance decisions. 