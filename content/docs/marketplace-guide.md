---
title: Marketplace Guide
description: Learn how to use the STAB3L marketplace for trading compute units
category: User Guides
order: 2
---

# Marketplace Guide

The STAB3L marketplace provides a decentralized platform for trading Compute Unit (CU) tokens. It offers three different market types: Spot, Futures, and Options, each serving different trading needs and strategies.

{% hint style="info" %}
All marketplace contracts are deployed on Arbitrum to ensure low gas fees and fast transaction confirmations.
{% endhint %}

## Marketplace Overview

The STAB3L marketplace enables:

- Buying and selling CU tokens in spot markets
- Trading futures contracts for future delivery of compute resources
- Trading options contracts for the right to buy or sell CU tokens at a predetermined price

<div class="mermaid-wrapper">
  <img src="https://quickchart.io/chart?c={type:'flowchart',data:{nodes:[{id:'A',text:'STAB3L Marketplace'},{id:'B',text:'Spot Market'},{id:'C',text:'Futures Market'},{id:'D',text:'Options Market'},{id:'E',text:'Immediate delivery of CU tokens'},{id:'F',text:'Future delivery of CU tokens'},{id:'G',text:'Right to buy/sell CU tokens'}],edges:[{from:'A',to:'B'},{from:'A',to:'C'},{from:'A',to:'D'},{from:'B',to:'E'},{from:'C',to:'F'},{from:'D',to:'G'}]}}" alt="Marketplace Structure" />
</div>

## Spot Market

The spot market allows for immediate trading of CU tokens between buyers and sellers.

### How to List CU Tokens for Sale

{% tabs %}
{% tab title="Web Interface" %}
1. Connect your wallet to the STAB3L platform
2. Navigate to the "Marketplace" section
3. Select "Spot Market"
4. Click on "Create Listing"
5. Select the CU tokens you want to sell
6. Specify the amount and price per token
7. Confirm the transaction
8. Your listing will appear in the marketplace
{% endtab %}

{% tab title="API" %}
```javascript
// Example API call to create a listing
const response = await fetch('https://api.stab3l.io/marketplace/spot/listings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    tokenId: 123,
    amount: 10,
    pricePerToken: 100 // in payment token units
  })
});
```
{% endtab %}
{% endtabs %}

### How to Buy CU Tokens

{% tabs %}
{% tab title="Web Interface" %}
1. Connect your wallet to the STAB3L platform
2. Navigate to the "Marketplace" section
3. Select "Spot Market"
4. Browse available listings
5. Click on "Buy" for the listing you want to purchase
6. Specify the amount you want to buy
7. Confirm the transaction
8. The CU tokens will be transferred to your wallet
{% endtab %}

{% tab title="API" %}
```javascript
// Example API call to purchase from a listing
const response = await fetch('https://api.stab3l.io/marketplace/spot/purchase', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    listingId: 456,
    amount: 5
  })
});
```
{% endtab %}
{% endtabs %}

### Spot Market Features

- **Trading Fee**: {{ tradingFee }}% of the transaction value
- **Minimum Listing Price**: {{ minListingPrice }} USDC
- **Partial Fills**: Buyers can purchase a portion of a listing
- **Listing Cancellation**: Sellers can cancel their listings at any time
- **Order Book**: View all active listings sorted by price

## Futures Market

The futures market allows for trading contracts that represent future delivery of CU tokens.

### How Futures Work in STAB3L

1. **Contract Creation**: A seller creates a futures contract specifying:
   - CU token type
   - Amount of CU tokens
   - Delivery date
   - Price per token

2. **Contract Purchase**: A buyer purchases the futures contract, paying a margin (typically 10-20% of the contract value)

3. **Settlement**:
   - **Physical Settlement**: On the delivery date, the seller delivers the CU tokens and the buyer pays the remaining amount
   - **Cash Settlement**: The difference between the contract price and the market price is settled in cash

{% hint style="warning" %}
Futures trading involves significant risk. Traders should be familiar with futures markets and margin requirements before participating.
{% endhint %}

### Futures Market Features

- **Margin Requirements**: 10-20% of contract value
- **Liquidation**: Positions are liquidated if margin falls below maintenance level
- **Mark Price**: Updated every 5 minutes based on spot market prices
- **Funding Rate**: Applied every 8 hours to align futures and spot prices
- **Position Limits**: Maximum position size based on account tier

## Options Market

The options market allows for trading contracts that give the right, but not the obligation, to buy (call) or sell (put) CU tokens at a predetermined price.

### Types of Options

{% tabs %}
{% tab title="Call Options" %}
Call options give the holder the right to buy CU tokens at the strike price:

- **Buyer**: Pays premium, has right to buy CU tokens
- **Seller**: Receives premium, has obligation to sell CU tokens if option is exercised

**Example**: A call option with strike price 100 USDC allows the holder to buy CU tokens at 100 USDC, even if the market price is higher.
{% endtab %}

{% tab title="Put Options" %}
Put options give the holder the right to sell CU tokens at the strike price:

- **Buyer**: Pays premium, has right to sell CU tokens
- **Seller**: Receives premium, has obligation to buy CU tokens if option is exercised

**Example**: A put option with strike price 100 USDC allows the holder to sell CU tokens at 100 USDC, even if the market price is lower.
{% endtab %}
{% endtabs %}

### Options Market Features

- **European Style**: Options can only be exercised at expiration
- **Collateralization**: Option sellers must fully collateralize their positions
- **Premiums**: Determined by Black-Scholes model based on:
  - Current price
  - Strike price
  - Time to expiration
  - Implied volatility
  - Risk-free rate
- **Exercise**: Automatic exercise for in-the-money options at expiration

## Market Protections

STAB3L implements several protections to ensure a fair and secure marketplace:

<details>
<summary>Circuit Breakers</summary>

Circuit breakers temporarily halt trading if:
- Price moves more than 10% in 5 minutes
- Trading volume exceeds 3x the 24-hour average
- Smart contract detects potential manipulation

Trading resumes after a cooling-off period or governance intervention.
</details>

<details>
<summary>Price Oracle</summary>

The price oracle:
- Aggregates prices from multiple sources
- Filters out outliers
- Provides tamper-resistant price feeds
- Updates every 5 minutes
</details>

<details>
<summary>Slippage Protection</summary>

Transactions revert if:
- Price moves more than the user-specified slippage tolerance
- Transaction would cause more than 5% price impact
</details>

## Fees and Rewards

| Market Type | Trading Fee | Maker Rebate | STB-GOV Rewards |
|-------------|-------------|--------------|-----------------|
| Spot        | 0.25%       | 0.05%        | 0.10%           |
| Futures     | 0.05%       | 0.02%        | 0.05%           |
| Options     | 0.30%       | 0.10%        | 0.15%           |

{% hint style="success" %}
Trading fees can be reduced by staking STB-GOV tokens. Stake 1,000 STB-GOV to reduce fees by 10%, up to a maximum of 50% reduction for 10,000 STB-GOV.
{% endhint %}

## Advanced Trading Strategies

The STAB3L marketplace enables several advanced trading strategies:

### Basis Trading

Profit from the difference between spot and futures prices:
1. Buy CU tokens in the spot market
2. Sell futures contracts for the same CU tokens
3. Deliver the CU tokens at settlement

### Calendar Spreads

Trade the price difference between futures contracts with different delivery dates:
1. Buy a futures contract with a near-term delivery date
2. Sell a futures contract with a far-term delivery date

### Covered Calls

Generate income from CU tokens you own:
1. Own CU tokens
2. Sell call options against your CU tokens
3. Collect premium income

## Conclusion

The STAB3L marketplace provides a comprehensive suite of trading options for CU tokens, enabling efficient price discovery and liquidity for compute resources. Whether you're looking for immediate delivery, future delivery, or hedging strategies, the marketplace offers the tools you need. 