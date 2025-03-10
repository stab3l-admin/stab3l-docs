---
title: Cross-Chain Bridge
description: Learn how to use the STAB3L cross-chain bridge for transferring CU tokens between blockchains
category: User Guides
order: 3
---

# Cross-Chain Bridge

The STAB3L Cross-Chain Bridge enables seamless transfer of Compute Unit (CU) tokens between different blockchain networks, creating a unified marketplace for compute resources across multiple ecosystems.

{% hint style="info" %}
The Cross-Chain Bridge currently supports transfers between Arbitrum (primary network) and Ethereum, Polygon, Optimism, and Solana.
{% endhint %}

## How the Bridge Works

The STAB3L Cross-Chain Bridge uses a lock-and-mint mechanism to transfer CU tokens between chains:

<div class="mermaid-wrapper">
  <img src="https://quickchart.io/chart?c={type:'sequence',data:{actors:['User','Source Chain','Relayers','Destination Chain'],actorKeys:['user','source','relayers','destination'],signals:[{message:'Lock CU tokens',from:'user',to:'source'},{message:'Emit LockEvent',from:'source',to:'source'},{message:'Monitor events',from:'source',to:'relayers',dashed:true},{message:'Confirm lock (multiple confirmations)',from:'relayers',to:'destination'},{message:'Verify confirmations',from:'destination',to:'destination'},{message:'Mint equivalent CU tokens',from:'destination',to:'user'}]}}" alt="Cross-Chain Bridge Flow" />
</div>

1. **Lock**: User locks CU tokens on the source chain
2. **Verify**: Multiple relayers verify the lock event
3. **Mint**: Equivalent CU tokens are minted on the destination chain

## Using the Bridge

### Bridging CU Tokens to Another Chain

{% tabs %}
{% tab title="Web Interface" %}
1. Connect your wallet to the STAB3L platform
2. Navigate to the "Bridge" section
3. Select the source chain (current chain)
4. Select the destination chain
5. Select the CU tokens you want to bridge
6. Specify the amount
7. Review the fee and confirm the transaction
8. Wait for confirmations (typically 5-20 minutes depending on chains)
9. Receive your CU tokens on the destination chain
{% endtab %}

{% tab title="API" %}
```javascript
// Example API call to bridge tokens
const response = await fetch('https://api.stab3l.io/bridge/lock', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    sourceChain: 'arbitrum',
    destinationChain: 'polygon',
    tokenId: 123,
    amount: 10,
    feeToken: 'STAB3L' // or 'STB-GOV' or 'DEFAULT'
  })
});
```
{% endtab %}
{% endtabs %}

### Checking Bridge Transaction Status

{% tabs %}
{% tab title="Web Interface" %}
1. Navigate to the "Bridge" section
2. Click on "Transaction History"
3. Find your transaction in the list
4. View the current status:
   - **Pending**: Transaction is being processed
   - **Confirmed**: Transaction has been confirmed on the source chain
   - **Relayed**: Relayers have verified the transaction
   - **Completed**: Tokens have been minted on the destination chain
   - **Failed**: Transaction has failed (with reason)
{% endtab %}

{% tab title="API" %}
```javascript
// Example API call to check transaction status
const response = await fetch(`https://api.stab3l.io/bridge/status/${messageId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```
{% endtab %}
{% endtabs %}

## Bridge Features

### Fee Options

The STAB3L Cross-Chain Bridge offers multiple fee token options:

| Fee Token | Description | Benefit |
|-----------|-------------|---------|
| DEFAULT | Default fee token (USDC) | Stable value |
| STAB3L | STAB3L utility token | 10% fee discount |
| STB-GOV | Governance token | 25% fee discount |

To select a fee token:
1. Click on "Fee Options" during the bridge process
2. Select your preferred fee token
3. The fee amount will be recalculated automatically

### Supported Chains

The bridge currently supports the following chains:

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Arbitrum</h3>
    <p>Primary network for STAB3L</p>
    <p class="text-sm text-gray-500">Chain ID: 42161</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Ethereum</h3>
    <p>Mainnet L1</p>
    <p class="text-sm text-gray-500">Chain ID: 1</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Polygon</h3>
    <p>Polygon PoS Chain</p>
    <p class="text-sm text-gray-500">Chain ID: 137</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Optimism</h3>
    <p>Optimistic Rollup</p>
    <p class="text-sm text-gray-500">Chain ID: 10</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Solana</h3>
    <p>Solana Mainnet</p>
    <p class="text-sm text-gray-500">Non-EVM Chain</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Coming Soon</h3>
    <p>Base, Avalanche, BNB Chain</p>
    <p class="text-sm text-gray-500">In development</p>
  </div>
</div>

## Security Measures

The STAB3L Cross-Chain Bridge implements several security measures to ensure safe and reliable transfers:

{% hint style="warning" %}
Always verify the destination address and chain before confirming a bridge transaction. Cross-chain transfers cannot be reversed once completed.
{% endhint %}

### Multi-Relayer Consensus

The bridge requires confirmations from multiple relayers before minting tokens on the destination chain:

- Minimum of 5 out of 9 relayers must confirm each transaction
- Relayers are selected through governance and must stake STB-GOV tokens
- Malicious relayers can be slashed and removed from the network

### Circuit Breaker

The bridge includes a circuit breaker mechanism that can be triggered in case of suspicious activity:

- Automatically pauses bridge operations if unusual patterns are detected
- Requires governance approval to resume operations
- 48-hour timelock for resuming operations after a circuit breaker event

### Message Timeout

Bridge messages have a timeout period to prevent stuck transactions:

- Default timeout: 24 hours
- If a message is not processed within the timeout period, it can be reclaimed on the source chain
- Users can reclaim their locked tokens if the bridge transaction fails

## Advanced Features

### Batch Transfers

The bridge supports batch transfers to reduce gas costs:

1. Select multiple CU tokens to bridge
2. The bridge will process them in a single transaction
3. Gas costs are significantly reduced compared to individual transfers

### Cross-Chain Redemption

Users can redeem CU tokens on any supported chain:

1. Bridge CU tokens to your preferred chain
2. Redeem them directly on that chain
3. The redemption process works the same way across all chains

### Bridge Factory

The STAB3L ecosystem includes a Bridge Factory contract that can deploy new bridge instances:

- Governance can approve new chain integrations
- Each new bridge is deployed with appropriate security parameters
- All bridges share the same relayer network for security

## Troubleshooting

<details>
<summary>Transaction Stuck in Pending Status</summary>

If your transaction has been pending for more than 30 minutes:

1. Check the source chain explorer to confirm the lock transaction was successful
2. Verify that you have sufficient gas on the destination chain for token receipt
3. Contact support with your transaction hash if the issue persists
</details>

<details>
<summary>Failed Transaction</summary>

If your transaction has failed:

1. Check the error message in the transaction history
2. Common reasons for failure:
   - Insufficient relayer confirmations
   - Destination chain congestion
   - Contract paused due to circuit breaker
3. You can reclaim your tokens on the source chain after the timeout period
</details>

<details>
<summary>Wrong Chain or Amount</summary>

If you've sent tokens to the wrong chain or specified an incorrect amount:

1. Unfortunately, cross-chain transactions cannot be reversed once completed
2. You can bridge the tokens back to the original chain in a new transaction
3. Always double-check the destination chain and amount before confirming
</details>

## Bridge Fees

Bridge fees vary depending on the source and destination chains:

| Source Chain | Destination Chain | Base Fee (USDC) | STAB3L Fee | STB-GOV Fee |
|--------------|-------------------|----------------|------------|-------------|
| Arbitrum     | Ethereum          | 5.00           | 4.50       | 3.75        |
| Arbitrum     | Polygon           | 2.00           | 1.80       | 1.50        |
| Arbitrum     | Optimism          | 2.50           | 2.25       | 1.88        |
| Arbitrum     | Solana            | 3.00           | 2.70       | 2.25        |
| Ethereum     | Arbitrum          | 3.00           | 2.70       | 2.25        |
| Polygon      | Arbitrum          | 1.50           | 1.35       | 1.13        |
| Optimism     | Arbitrum          | 2.00           | 1.80       | 1.50        |
| Solana       | Arbitrum          | 2.50           | 2.25       | 1.88        |

Bridge fees are used to cover gas costs on the destination chain and to reward relayers for securing the network. A portion of the fees is also sent to the treasury to support ongoing development.

## Conclusion

The STAB3L Cross-Chain Bridge enables a unified marketplace for compute resources across multiple blockchain ecosystems. By bridging CU tokens between chains, users can access a wider range of providers and trading opportunities, while providers can reach a larger audience for their compute resources. 