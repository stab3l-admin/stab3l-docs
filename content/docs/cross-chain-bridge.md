---
title: Cross-Chain Bridge
description: Learn how to use the STAB3L cross-chain bridge for transferring sSTB tokens between blockchains
category: User Guides
order: 3
---

# Cross-Chain Bridge

The STAB3L Cross-Chain Bridge enables seamless transfer of sSTB tokens between different blockchain networks, creating a unified marketplace for compute resources across multiple ecosystems.

{% hint style="info" %}
The Cross-Chain Bridge currently supports transfers between Arbitrum (primary network) and Ethereum, Polygon, Optimism, and Solana.
{% endhint %}

{% hint style="warning" %}
**Important**: CU tokens are NOT tradable assets and cannot be bridged. They are temporary tokens that are burned immediately when exchanged for sSTB. Only sSTB tokens can be transferred across chains.
{% endhint %}

## How the Bridge Works

The STAB3L Cross-Chain Bridge uses a lock-and-mint mechanism to transfer sSTB tokens between chains:

<div id="bridge-flow-chart" style="height: 400px; width: 100%; margin: 20px 0; border: 1px dashed #ccc; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
  <p style="font-style: italic; color: #666;">Chart loading...</p>
</div>
<script>
  if (typeof window !== 'undefined' && typeof window.renderChart === 'function') {
    window.renderChart(
      'bridge-flow-chart',
      'bar',
      {
        labels: ["User Locks Tokens", "Source Chain Event", "Relayers Monitor", "Relayers Confirm", "Destination Verifies", "Tokens Minted"],
        datasets: [
          {
            label: "Bridge Process Flow",
            data: [100, 90, 80, 70, 60, 50],
            backgroundColor: [
              "rgba(75, 192, 192, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(201, 203, 207, 0.7)"
            ],
            borderColor: [
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(255, 99, 132)",
              "rgb(201, 203, 207)"
            ],
            borderWidth: 1
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Cross-Chain Bridge Flow',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': Step ' + (context.dataIndex + 1);
              }
            }
          }
        }
      }
    );
  } else {
    document.getElementById('bridge-flow-chart').innerHTML = '<div style="text-align:center;padding:20px;">Chart could not be loaded: renderChart function not available</div>';
  }
</script>

1. **Lock**: User locks sSTB tokens on the source chain

2. **Verify**: Multiple relayers verify the lock event

3. **Mint**: Equivalent sSTB tokens are minted on the destination chain

## Using the Bridge

### Bridging sSTB Tokens to Another Chain

{% tabs %}
{% tab title="Web Interface" %}
1. Connect your wallet to the STAB3L platform

2. Navigate to the "Bridge" section

3. Select the source chain (current chain)

4. Select the destination chain

5. Enter the amount of sSTB tokens you want to bridge

6. Review the fee and confirm the transaction

7. Wait for confirmations (typically 5-20 minutes depending on chains)

8. Receive your sSTB tokens on the destination chain
{% endtab %}

{% tab title="API" %}
```javascript
// Example API call to bridge tokens
const response = await fetch('https://api.stab3l.com/bridge/lock', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    sourceChain: 'arbitrum',
    destinationChain: 'polygon',
    amount: 10,
    feeToken: 'sSTB' // or 'rSTB' or 'DEFAULT'
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
const response = await fetch(`https://api.stab3l.com/bridge/status/${messageId}`, {
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
| sSTB | STAB3L utility token | 10% fee discount |
| rSTB | Governance token | 25% fee discount |

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
- Relayers are selected through governance and must stake rSTB tokens
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

1. Select multiple amounts of sSTB to bridge
2. The bridge will process them in a single transaction
3. Gas costs are significantly reduced compared to individual transfers

### Cross-Chain Redemption

Users can redeem sSTB tokens for compute resources on any supported chain:

1. Bridge sSTB tokens to your preferred chain
2. Redeem them directly on that chain for compute resources
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

| Source Chain | Destination Chain | Base Fee (USDC) | sSTB Fee | rSTB Fee |
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

The STAB3L Cross-Chain Bridge enables a unified marketplace for compute resources across multiple blockchain ecosystems. By bridging sSTB tokens between chains, users can access a wider range of providers and trading opportunities, while providers can reach a larger audience for their compute resources. 