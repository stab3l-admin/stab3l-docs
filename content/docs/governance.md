---
title: Governance Participation
description: Learn how to participate in STAB3L governance using STB-GOV tokens
category: User Guides
order: 4
---

# Governance Participation

STAB3L is governed by its community through a decentralized governance system powered by the STB-GOV token. This guide explains how to participate in governance decisions and help shape the future of the platform.

{% hint style="info" %}
Governance decisions are made through on-chain voting using the STB-GOV token. Holding STB-GOV tokens grants you voting power proportional to your holdings.
{% endhint %}

## Governance Overview

The STAB3L governance system enables token holders to:

- Propose changes to the protocol
- Vote on proposals
- Delegate voting power
- Implement approved changes

<div class="mermaid-wrapper">
  <img src="https://quickchart.io/chart?c={type:'flowchart',data:{nodes:[{id:'A',text:'STB-GOV Token Holders'},{id:'B',text:'Create Proposals'},{id:'C',text:'Vote on Proposals'},{id:'D',text:'Delegate Voting Power'},{id:'E',text:'Discussion Period'},{id:'F',text:'Voting Period'},{id:'G',text:'Quorum Reached?'},{id:'H',text:'Majority Approve?'},{id:'I',text:'Proposal Fails'},{id:'J',text:'Timelock Period'},{id:'K',text:'Implementation'}],edges:[{from:'A',to:'B'},{from:'A',to:'C'},{from:'A',to:'D'},{from:'B',to:'E'},{from:'E',to:'F'},{from:'F',to:'G'},{from:'G',to:'H',label:'Yes'},{from:'G',to:'I',label:'No'},{from:'H',to:'J',label:'Yes'},{from:'H',to:'I',label:'No'},{from:'J',to:'K'}]}}" alt="Governance Process Flow" />
</div>

## STB-GOV Token

The STB-GOV token is the governance token of the STAB3L ecosystem:

- **Total Supply**: 1 billion tokens
- **Distribution**: Community (40%), Team (20%), Treasury (20%), Investors (15%), Advisors (5%)
- **Utility**: Governance voting, staking rewards, fee discounts

### Acquiring STB-GOV Tokens

{% tabs %}
{% tab title="Staking" %}
Earn STB-GOV tokens by staking CU tokens:

1. Navigate to the "Staking" section
2. Select the CU tokens you want to stake
3. Specify the amount and staking period
4. Confirm the transaction
5. Earn STB-GOV tokens as rewards based on your stake
{% endtab %}

{% tab title="Buying" %}
Purchase STB-GOV tokens on supported exchanges:

1. **Decentralized Exchanges**:
   - Uniswap (Arbitrum)
   - SushiSwap (Arbitrum)
   - Trader Joe (Arbitrum)

2. **Centralized Exchanges**:
   - Coming soon
{% endtab %}

{% tab title="Participating" %}
Earn STB-GOV tokens by participating in the ecosystem:

- Trading on the marketplace
- Providing liquidity
- Contributing to development
- Participating in community activities
{% endtab %}
{% endtabs %}

## Governance Process

### Creating a Proposal

To create a governance proposal:

1. Hold at least 1,000 STB-GOV tokens
2. Navigate to the "Governance" section
3. Click on "Create Proposal"
4. Fill in the proposal details:
   - Title
   - Description
   - Actions (contract calls)
   - Discussion link (forum post)
5. Submit the proposal (requires gas fee)

{% hint style="warning" %}
Before creating an on-chain proposal, it's recommended to discuss your idea on the [STAB3L Forum](https://forum.stab3l.io) to gather community feedback and refine your proposal.
{% endhint %}

### Voting on Proposals

To vote on governance proposals:

1. Navigate to the "Governance" section
2. Browse active proposals
3. Click on a proposal to view details
4. Select your vote: "For," "Against," or "Abstain"
5. Confirm your vote (requires gas fee)

Your voting power is determined by your STB-GOV balance at the time the proposal was created.

### Delegating Votes

If you don't want to actively vote on every proposal, you can delegate your voting power:

1. Navigate to the "Governance" section
2. Click on "Delegate Votes"
3. Enter the address of your chosen delegate
4. Confirm the transaction (requires gas fee)

You can change your delegation or vote directly at any time.

## Proposal Lifecycle

Each governance proposal goes through several stages:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">1. Discussion</h3>
    <p>Community discusses the proposal on the forum</p>
    <p class="text-sm text-gray-500">Recommended: 7 days</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">2. Creation</h3>
    <p>Proposal is created on-chain</p>
    <p class="text-sm text-gray-500">Requires: 1,000 STB-GOV</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">3. Voting</h3>
    <p>Community votes on the proposal</p>
    <p class="text-sm text-gray-500">Duration: 5 days</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">4. Timelock</h3>
    <p>Waiting period before implementation</p>
    <p class="text-sm text-gray-500">Duration: 2 days</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">5. Execution</h3>
    <p>Proposal is executed if approved</p>
    <p class="text-sm text-gray-500">Anyone can trigger execution</p>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">6. Implementation</h3>
    <p>Changes are applied to the protocol</p>
    <p class="text-sm text-gray-500">Automatic after execution</p>
  </div>
</div>

### Voting Requirements

For a proposal to pass, it must meet the following requirements:

- **Quorum**: At least 4% of total STB-GOV supply must vote
- **Majority**: More than 50% of votes must be "For"
- **Duration**: Voting period lasts 5 days

## Governance Parameters

The following parameters can be modified through governance:

| Parameter | Description | Current Value |
|-----------|-------------|---------------|
| Proposal Threshold | Minimum STB-GOV to create proposal | 1,000 STB-GOV |
| Quorum | Minimum participation required | 4% of supply |
| Voting Period | Duration of voting | 5 days |
| Timelock Period | Waiting period before execution | 2 days |
| Emergency Timelock | Timelock for emergency actions | 6 hours |

## Governance Security

The STAB3L governance system includes several security measures:

### Multi-Signature Governance

Critical protocol parameters and contracts are controlled by a 7/11 multi-signature wallet:

- 4 core team members
- 7 community-elected signers

This ensures that no single entity can make changes without broad consensus.

### Timelocks

All governance actions are subject to timelocks:

- **Standard Timelock**: 2 days for regular proposals
- **Emergency Timelock**: 6 hours for emergency actions (requires 9/11 multi-sig approval)

### Circuit Breakers

Governance can trigger circuit breakers to pause protocol functions in case of emergencies:

<details>
<summary>Minting Circuit Breaker</summary>

Pauses the minting of new CU tokens if:
- Collateral price drops more than 20% in 1 hour
- Suspicious minting activity is detected
- Verification system is compromised
</details>

<details>
<summary>Bridge Circuit Breaker</summary>

Pauses the cross-chain bridge if:
- Unusual bridge activity is detected
- Destination chain has issues
- Relayer network is compromised
</details>

<details>
<summary>Market Circuit Breaker</summary>

Pauses marketplace activities if:
- Extreme price volatility occurs
- Suspicious trading patterns are detected
- Smart contract vulnerability is discovered
</details>

## Governance Analytics

The "Governance Analytics" section provides insights into governance activities:

- **Proposal Statistics**: Number of proposals created, passed, and rejected
- **Voting Participation**: Percentage of STB-GOV tokens that participate in voting
- **Voter Distribution**: Distribution of voting power among participants
- **Delegation Network**: Visualization of delegation relationships

## Best Practices for Governance Participation

{% hint style="success" %}
Effective governance participation helps ensure the long-term success of the STAB3L ecosystem.
{% endhint %}

### For Proposal Creators

1. **Research thoroughly**: Understand the problem you're trying to solve
2. **Discuss with the community**: Get feedback before creating an on-chain proposal
3. **Be specific**: Clearly define the proposed changes and their expected impact
4. **Consider alternatives**: Present multiple options when appropriate
5. **Provide implementation details**: Include technical specifications or code changes

### For Voters

1. **Stay informed**: Read proposals carefully and understand their implications
2. **Participate regularly**: Vote on all proposals to ensure your voice is heard
3. **Consider long-term impact**: Vote based on what's best for the ecosystem's future
4. **Delegate responsibly**: If delegating, choose delegates who share your values
5. **Join discussions**: Participate in forum discussions to help refine proposals

## Conclusion

Governance participation is a key aspect of the STAB3L ecosystem, allowing the community to collectively guide the platform's development and evolution. By holding STB-GOV tokens and actively participating in governance, you can help shape the future of decentralized compute resources. 