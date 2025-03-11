---
title: Developer Integration Guide
description: Comprehensive guide for developers to integrate with the STAB3L platform
category: Developer Resources
order: 5
---

# Developer Integration Guide

This guide provides comprehensive information for developers who want to integrate with the STAB3L platform. Whether you're building applications that utilize compute resources, creating tools for providers, or developing extensions to the STAB3L ecosystem, this guide will help you get started.

## Overview

STAB3L offers multiple integration points for developers:

1. **Smart Contract Integrations**: Interact directly with STAB3L smart contracts
2. **REST API**: Use our REST API for off-chain interactions
3. **GraphQL API**: Query indexed data using our GraphQL endpoint
4. **SDKs**: Utilize our official SDKs for various programming languages
5. **Webhooks**: Receive real-time notifications about events

{% hint style="info" %}
Choose the integration method that best suits your application's requirements and your development stack.
{% endhint %}

## Smart Contract Integrations

### Contract Addresses

STAB3L smart contracts are deployed on multiple chains. Here are the main contract addresses:

{% tabs %}
{% tab title="Arbitrum (Primary)" %}
| Contract | Address | Description |
|----------|---------|-------------|
| CUToken | 0x... (PLACEHOLDER) | ERC-1155 token for temporary Compute Units (burned upon exchange for sSTB) |
| MintingAgent | 0x... (PLACEHOLDER) | Handles verification and minting process |
| RedemptionManager | 0x... (PLACEHOLDER) | Manages redemption of sSTB tokens for compute resources |
| SpotMarket | 0x... (PLACEHOLDER) | Spot market for sSTB tokens |
| FuturesMarket | 0x... (PLACEHOLDER) | Futures market for sSTB tokens |
| OptionsMarket | 0x... (PLACEHOLDER) | Options market for sSTB tokens |
| CrossChainBridge | 0x... (PLACEHOLDER) | Bridge for cross-chain transfers of sSTB |
| Governance | 0x... (PLACEHOLDER) | Governance contract for STAB3L |
| sSTBToken | 0x... (PLACEHOLDER) | ERC-20 utility token (sSTB) |
| rSTBToken | 0x... (PLACEHOLDER) | ERC-20 governance token (rSTB) |
{% endtab %}

{% tab title="Ethereum" %}
| Contract | Address | Description |
|----------|---------|-------------|
| CUToken | 0x... (PLACEHOLDER) | ERC-1155 token for Compute Units |
| CrossChainBridge | 0x... (PLACEHOLDER) | Bridge for cross-chain transfers |
| sSTBToken | 0x... (PLACEHOLDER) | ERC-20 utility token |
| rSTBToken | 0x... (PLACEHOLDER) | ERC-20 governance token |
{% endtab %}

{% tab title="Polygon" %}
| Contract | Address | Description |
|----------|---------|-------------|
| CUToken | 0x... (PLACEHOLDER) | ERC-1155 token for Compute Units |
| CrossChainBridge | 0x... (PLACEHOLDER) | Bridge for cross-chain transfers |
| sSTBToken | 0x... (PLACEHOLDER) | ERC-20 utility token |
| rSTBToken | 0x... (PLACEHOLDER) | ERC-20 governance token |
{% endtab %}
{% endtabs %}

### Contract ABIs

You can find the ABIs for all STAB3L contracts in our GitHub repository:

```
https://github.com/stab3l/stab3l-contracts/tree/main/abis
```

Alternatively, you can use our NPM package:

```bash
npm install @stab3l/contracts
```

### Example: Interacting with CU Tokens

Here's an example of how to interact with CU tokens using ethers.js:

```javascript
const { ethers } = require('ethers');
const CUTokenABI = require('@stab3l/contracts/abis/CUToken.json');

async function getCUTokenBalance(provider, tokenId, address) {
  const cuTokenAddress = '0x... (PLACEHOLDER)'; // Arbitrum
  const cuToken = new ethers.Contract(cuTokenAddress, CUTokenABI, provider);
  
  const balance = await cuToken.balanceOf(address, tokenId);
  return balance;
}

async function transferCUTokens(signer, tokenId, to, amount) {
  const cuTokenAddress = '0x... (PLACEHOLDER)'; // Arbitrum
  const cuToken = new ethers.Contract(cuTokenAddress, CUTokenABI, signer);
  
  const tx = await cuToken.safeTransferFrom(
    signer.address,
    to,
    tokenId,
    amount,
    '0x'
  );
  
  return await tx.wait();
}
```

{% hint style="warning" %}
**Important**: CU tokens are NOT tradable assets. They are temporary tokens that are burned immediately when exchanged for sSTB. This burning mechanism is crucial for maintaining the peg and ensuring that each sSTB is backed by real compute resources. Users trade and redeem sSTB tokens, not CU tokens.
{% endhint %}

### Example: Provider Verification and sSTB Minting Process

Here's an example of how the verification and minting process works for providers:

```javascript
const { ethers } = require('ethers');
const MintingAgentABI = require('@stab3l/contracts/abis/MintingAgent.json');

async function verifyAndMintSSTB(signer, computeProof, collateralAmount, stakingPeriod) {
  const mintingAgentAddress = '0x... (PLACEHOLDER)'; // Arbitrum
  const mintingAgent = new ethers.Contract(mintingAgentAddress, MintingAgentABI, signer);
  
  // First, approve collateral token transfer
  const collateralTokenAddress = '0x... (PLACEHOLDER)'; // USDC
  const collateralToken = new ethers.Contract(collateralTokenAddress, ERC20ABI, signer);
  await collateralToken.approve(mintingAgentAddress, collateralAmount);
  
  // Submit verification and mint sSTB in one transaction
  // This process internally creates temporary CU tokens that are immediately burned
  const tx = await mintingAgent.verifyAndMintSSTB(computeProof, collateralAmount, stakingPeriod);
  const receipt = await tx.wait();
  
  // The temporary CU tokens are burned and sSTB tokens are minted to your address
  return receipt;
}
```

### Example: Redeeming sSTB for Compute Resources

Here's an example of how to redeem sSTB tokens for compute resources:

```javascript
const { ethers } = require('ethers');
const RedemptionManagerABI = require('@stab3l/contracts/abis/RedemptionManager.json');

async function redeemSSTBForCompute(signer, amount, providerId) {
  const redemptionManagerAddress = '0x... (PLACEHOLDER)'; // Arbitrum
  const redemptionManager = new ethers.Contract(redemptionManagerAddress, RedemptionManagerABI, signer);
  
  // First, approve the redemption manager to spend your sSTB tokens
  const sstbTokenAddress = '0x... (PLACEHOLDER)';
  const sstbToken = new ethers.Contract(sstbTokenAddress, ERC20ABI, signer);
  await sstbToken.approve(redemptionManagerAddress, amount);
  
  // Then initiate the redemption
  const tx = await redemptionManager.initiateRedemption(amount, providerId);
  const receipt = await tx.wait();
  
  // Extract the redemption ID from the event
  const event = receipt.events.find(e => e.event === 'RedemptionInitiated');
  const redemptionId = event.args.redemptionId;
  
  return redemptionId;
}
```

## REST API

STAB3L provides a comprehensive REST API for interacting with the platform without directly using smart contracts.

### Base URL

```
https://api.stab3l.com/v1
```

### Authentication

To use the API, you need to obtain an API key:

1. Register on the STAB3L platform
2. Navigate to the Developer section
3. Generate an API key
4. Include the API key in your requests using the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

### Rate Limits

| Plan | Rate Limit |
|------|------------|
| Standard | 60 requests per minute |
| Premium | 300 requests per minute |
| Enterprise | 1000 requests per minute |

### Endpoints

Here are some of the key endpoints:

#### Compute Resources

```
GET /compute-resources
GET /compute-resources/{resourceId}
GET /compute-resources/provider/{providerId}
```

#### Providers

```
GET /providers
GET /providers/{providerId}
GET /providers/{providerId}/compute-resources
```

#### sSTB Tokens

```
GET /sstb/balance
POST /sstb/transfer
```

#### Redemptions

```
POST /redemptions
GET /redemptions/{redemptionId}
POST /redemptions/{redemptionId}/confirm
```

### Example: Listing Available Compute Resources

```javascript
async function listAvailableComputeResources() {
  const response = await fetch('https://api.stab3l.com/v1/compute-resources', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  
  return await response.json();
}
```

### Example: Initiating a Redemption

```javascript
async function initiateRedemption(amount, providerId) {
  const response = await fetch('https://api.stab3l.com/v1/redemptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      sstb_amount: amount,
      provider_id: providerId
    })
  });
  
  return await response.json();
}
```

## GraphQL API

For more complex queries and data retrieval, STAB3L offers a GraphQL API.

### Endpoint

```
https://api.stab3l.com/graphql
```

### Authentication

Use the same API key as for the REST API:

```
Authorization: Bearer YOUR_API_KEY
```

### Example Queries

#### Get Provider Details with Compute Resources

```graphql
query GetProviderWithComputeResources($providerId: ID!) {
  provider(id: $providerId) {
    id
    name
    reputation
    totalComputeValue
    computeResources {
      id
      resourceId
      specifications {
        cpuCores
        memoryGB
        storageGB
        bandwidthMbps
      }
      verificationMethod
      stakingPeriod
      collateralization
      price
      expirationDate
    }
  }
}
```

#### Get Marketplace Activity

```graphql
query GetMarketplaceActivity($limit: Int!) {
  marketplaceActivity(limit: $limit) {
    id
    timestamp
    activityType
    tokenType
    amount
    price
    buyer {
      id
      address
    }
    seller {
      id
      address
    }
  }
}
```

### Example: Using the GraphQL API

```javascript
async function getProviderDetails(providerId) {
  const query = `
    query GetProviderDetails($providerId: ID!) {
      provider(id: $providerId) {
        id
        name
        reputation
        totalComputeValue
        verificationMethod
        joinedAt
      }
    }
  `;
  
  const response = await fetch('https://api.stab3l.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      variables: {
        providerId
      }
    })
  });
  
  const data = await response.json();
  return data.data.provider;
}
```

## SDKs

STAB3L provides official SDKs for various programming languages to simplify integration.

### JavaScript/TypeScript SDK

```bash
npm install @stab3l/sdk
```

```javascript
const { STAB3L } = require('@stab3l/sdk');

// Initialize the SDK
const stab3l = new STAB3L({
  apiKey: 'YOUR_API_KEY',
  network: 'arbitrum', // or 'ethereum', 'polygon', etc.
  provider: window.ethereum // or any ethers.js compatible provider
});

// Get sSTB token balance
const balance = await stab3l.sstbTokens.getBalance(tokenId, address);

// List marketplace listings
const listings = await stab3l.marketplace.getListings();

// Create a buy order
const order = await stab3l.marketplace.createBuyOrder(tokenId, amount, price);

// Redeem sSTB tokens
const redemptionId = await stab3l.redemptions.initiateRedemption(tokenId, amount);
```

### Python SDK

```bash
pip install stab3l-sdk
```

```python
from stab3l import STAB3L

# Initialize the SDK
stab3l = STAB3L(
    api_key='YOUR_API_KEY',
    network='arbitrum',  # or 'ethereum', 'polygon', etc.
    provider_url='https://arb1.arbitrum.io/rpc'  # or any Web3 provider URL
)

# Get sSTB token balance
balance = stab3l.sstb_tokens.get_balance(token_id, address)

# List marketplace listings
listings = stab3l.marketplace.get_listings()

# Create a buy order
order = stab3l.marketplace.create_buy_order(token_id, amount, price)

# Redeem sSTB tokens
redemption_id = stab3l.redemptions.initiate_redemption(token_id, amount)
```

### Rust SDK

```toml
# Cargo.toml
[dependencies]
stab3l-sdk = "0.1.0"
```

```rust
use stab3l_sdk::STAB3L;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the SDK
    let stab3l = STAB3L::new(
        "YOUR_API_KEY",
        "arbitrum",  // or "ethereum", "polygon", etc.
        "https://arb1.arbitrum.io/rpc"  // or any Web3 provider URL
    )?;
    
    // Get sSTB token balance
    let balance = stab3l.sstb_tokens().get_balance(token_id, &address).await?;
    
    // List marketplace listings
    let listings = stab3l.marketplace().get_listings().await?;
    
    // Create a buy order
    let order = stab3l.marketplace().create_buy_order(token_id, amount, price).await?;
    
    // Redeem sSTB tokens
    let redemption_id = stab3l.redemptions().initiate_redemption(token_id, amount).await?;
    
    Ok(())
}
```

## Webhooks

STAB3L provides webhooks for real-time notifications about events on the platform.

### Setting Up Webhooks

1. Navigate to the Developer section of the STAB3L platform
2. Go to the Webhooks tab
3. Click "Add Webhook"
4. Enter your webhook URL
5. Select the events you want to receive notifications for
6. Save the webhook configuration

### Webhook Events

| Event | Description |
|-------|-------------|
| `sstb.minted` | New sSTB tokens are minted |
| `sstb.transferred` | sSTB tokens are transferred |
| `sstb.redeemed` | sSTB tokens are redeemed for compute resources |
| `marketplace.listing_created` | New marketplace listing is created |
| `marketplace.order_created` | New marketplace order is created |
| `marketplace.trade_executed` | Trade is executed on the marketplace |
| `redemption.initiated` | Redemption is initiated |
| `redemption.fulfilled` | Redemption is fulfilled by provider |
| `redemption.confirmed` | Redemption is confirmed by user |

### Webhook Payload

```json
{
  "event": "sstb.minted",
  "timestamp": "2023-07-15T12:34:56Z",
  "data": {
    "provider_id": "0x1234567890abcdef1234567890abcdef12345678",
    "sstb_amount": 100,
    "owner": "0x1234567890abcdef1234567890abcdef12345678",
    "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  }
}
```

### Webhook Security

To verify that webhook requests are coming from STAB3L, we include a signature in the `X-STAB3L-Signature` header. You should verify this signature before processing the webhook:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
}

// In your webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-stab3l-signature'];
  const payload = req.body;
  
  if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  console.log(`Received event: ${payload.event}`);
  
  res.status(200).send('OK');
});
```

## Use Cases

### Building a Compute Resource Marketplace

You can build your own marketplace for compute resources using STAB3L:

1. Use the SDK or API to list available sSTB tokens
2. Implement a user interface for browsing and filtering sSTB tokens
3. Integrate with the marketplace contracts for buying and selling
4. Use webhooks to receive real-time updates about marketplace activity

### Creating a Provider Dashboard

Build a dashboard for compute providers:

1. Use the SDK or API to manage provider resources
2. Implement monitoring for redemption requests
3. Automate the fulfillment of redemption requests
4. Track provider reputation and earnings

### Developing a Compute Resource Orchestrator

Create a system that automatically acquires and manages compute resources:

1. Monitor resource needs and available sSTB tokens
2. Automatically purchase sSTB tokens when needed
3. Redeem sSTB tokens and manage the provisioned resources
4. Scale resources up or down based on demand

## Best Practices

### Security

- **Store API Keys Securely**: Never expose API keys in client-side code
- **Verify Webhook Signatures**: Always verify webhook signatures to prevent spoofing
- **Use HTTPS**: Always use HTTPS for API requests
- **Implement Rate Limiting**: Add rate limiting to your webhook endpoints

### Performance

- **Use GraphQL for Complex Queries**: GraphQL is more efficient for retrieving complex data structures
- **Cache Responses**: Cache API responses to reduce the number of requests
- **Use Pagination**: Implement pagination for large result sets
- **Batch Requests**: Combine multiple operations into a single request when possible

### Error Handling

- **Implement Retry Logic**: Add retry logic with exponential backoff for failed requests
- **Handle Rate Limits**: Respect rate limits and implement backoff when limits are reached
- **Log Errors**: Log all errors for debugging and monitoring
- **Provide User Feedback**: Give users clear feedback when errors occur

## Troubleshooting

### Common Issues

#### API Key Issues

- **Invalid API Key**: Ensure your API key is valid and has not expired
- **Insufficient Permissions**: Check that your API key has the necessary permissions
- **Rate Limit Exceeded**: Respect rate limits and implement backoff

#### Smart Contract Interactions

- **Insufficient Gas**: Ensure you're providing sufficient gas for transactions
- **Network Congestion**: During periods of high network congestion, transactions may take longer to confirm
- **Contract Upgrades**: Be aware of contract upgrades that may change functionality

#### Webhook Issues

- **Invalid Signature**: Ensure you're correctly verifying webhook signatures
- **Timeout**: Webhook handlers should respond quickly to avoid timeouts
- **Duplicate Events**: Implement idempotency to handle duplicate webhook events

### Getting Help

If you encounter issues, you can:

- Check the [STAB3L Developer Documentation](https://docs.stab3l.com/developer)
- Join the [STAB3L Developer Discord](https://discord.gg/stab3l-dev)
- Open an issue on [GitHub](https://github.com/stab3l)
- Contact [developer support](mailto:dev-support@stab3l.com)

## Conclusion

This guide provides a comprehensive overview of the integration options available for developers who want to build on top of STAB3L. By leveraging our smart contracts, APIs, SDKs, and webhooks, you can create powerful applications that utilize the STAB3L platform for standardized, verified, and tradable compute resources.

{% hint style="success" %}
We're excited to see what you build with STAB3L! If you create something interesting, let us know at [developers@stab3l.com](mailto:developers@stab3l.com).
{% endhint %} 