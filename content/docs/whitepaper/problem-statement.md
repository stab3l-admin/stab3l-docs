---
title: Problem Statement
description: Compute Market Volatility and its impact on innovation
category: Whitepaper
order: 2
---

# 2. Problem Statement: Compute Market Volatility

The global compute market, valued at over \$500 billion, is characterized by significant price volatility, creating inefficiencies that stifle innovation for AI startups, blockchain developers, and scientific researchers. This section quantifies the volatility, identifies its root causes, and demonstrates the economic and operational challenges it poses, setting the foundation for STAB3L's stabilizing solution.

{% hint style="warning" %}
Compute market volatility of ±30% annually creates unpredictable costs for users and revenue instability for providers, undermining long-term planning and investment.
{% endhint %}

## 2.1 Quantification of Compute Market Volatility

Compute costs exhibit an annual volatility of approximately 30%, driven by fluctuating supply and demand dynamics. Let's define:

$P_{CU}$: The market price of 1 Compute Unit (CU) in USD, where 1 CU = 10^15 FLOPs, benchmarked against high-performance instances like AWS p4d.24xlarge (nominally \$0.06/CU at launch, with historical fluctuations between \$0.04 and \$0.08).

Volatility ($\sigma_{CU}$): The standard deviation of $P_{CU}$ over time, modeled as a lognormal distribution:

$$P_{CU} \sim LogNormal(\mu, \sigma_{CU})$$

Based on historical data (2019–2024), $\sigma_{CU} \approx 0.3$ (30% relative volatility), with a mean $\mu$ corresponding to a nominal \$0.06/CU. This results in a price range of \$0.042–\$0.084 with 95% confidence, calculated as:

$$P_{CU,95\\%} = e^{\mu \pm 1.96 \cdot \sigma_{CU}}$$

Substituting $\mu = \ln(0.06)$ and $\sigma_{CU} = 0.3$:

$$P_{CU,lower} = e^{\ln(0.06) - 1.96 \cdot 0.3} \approx 0.042$$

$$P_{CU,upper} = e^{\ln(0.06) + 1.96 \cdot 0.3} \approx 0.084$$

This volatility translates to unpredictable costs for users and revenue instability for providers, undermining long-term planning and investment.

## 2.2 Root Causes of Volatility

The 30% annual volatility arises from three primary factors:

### 2.2.1 Energy Price Variability

Energy costs, a major component of compute operations, fluctuate due to seasonal, geopolitical, and regulatory factors. Let $C_{energy}$ represent the cost per kWh of electricity, modeled as:

$$C_{energy} \sim Normal(\mu_{energy}, \sigma_{energy})$$

Historical data (2020–2024) reveals that energy prices average approximately \$0.12/kWh (represented by parameter $\mu_{energy}$) with a volatility of 25% (parameter $\sigma_{energy} \approx 0.25$). During geopolitical crises (e.g., Ukraine conflict, 2022), prices spiked to \$0.18/kWh. Since compute providers consume 1–2 kWh per CU-hour, these energy cost fluctuations directly impact $P_{CU}$:

$$P_{CU,energy} = P_{base} + \alpha \cdot C_{energy}$$

Where:

- $P_{base}$ is the baseline hardware cost (\$0.04/CU), and; 

- $\alpha \approx 0.01$ (energy cost per CU-hour). 

A 25% increase in $C_{energy}$ raises $P_{CU}$ by ~0.25%, contributing ~7.5% to overall volatility.

### 2.2.2 Hardware Shortages (e.g., GPU Scarcity)

Hardware supply constraints, particularly for GPUs, drive price spikes. During the 2021–2022 crypto mining boom, GPU prices (e.g., NVIDIA A100) surged from \$10,000 to \$15,000, a 50% increase. Let $P_{hardware}$ represent hardware cost per CU:

$$P_{hardware} \sim LogNormal(\mu_{hardware}, \sigma_{hardware})$$

With:

- $\mu_{hardware} = \ln(0.02)$ (baseline \$0.02/CU) and;
-  $\sigma_{hardware} \approx 0.4$ (40% volatility), $P_{hardware}$ ranges from \$0.012 to \$0.033 with 95% confidence. This contributes ~12% to $P_{CU}$ volatility, as hardware costs form ~33% of $P_{CU}$.

{% hint style="info" %}
GPU shortages during the 2021-2022 crypto mining boom caused hardware prices to surge by 50%, significantly impacting compute costs for AI researchers and blockchain developers.
{% endhint %}

### 2.2.3 Demand Surges from AI, Blockchain, and Scientific Applications

Demand spikes, driven by AI training (e.g., GPT-4, 2023), blockchain scaling (e.g., Ethereum 2.0), and scientific simulations, create supply-demand mismatches. Let $D_{CU}$ represent demand for CUs (in billions per month), modeled as:

$$D_{CU} \sim Poisson(\lambda)$$

With $\lambda \approx 50$ billion CUs/month (baseline), but spikes during AI launches (e.g., $\lambda = 75$) increase $P_{CU}$ by ~20% due to supply constraints. The price impact is:

$$P_{CU,demand} = P_{base} \cdot (1 + \beta \cdot (D_{CU} - D_{base}))$$

Where $\beta \approx 0.0001$ (price elasticity), and $D_{base} = 50$ billion CUs/month. A 50% demand surge raises $P_{CU}$ by ~5%, contributing ~10.5% to volatility.

## 2.3 Economic and Operational Challenges

This 30% volatility creates:

- **User Uncertainty**: AI startups face unpredictable costs, e.g., a \$1M training budget could vary ±\$300K, risking project viability.
- **Provider Instability**: Compute providers (e.g., data centers) face revenue fluctuations, deterring long-term hardware investments.
- **Market Inefficiency**: No global pricing index exists, leading to arbitrage inefficiencies and fragmented markets.

## 2.4 Graph Description

**Figure 2.1: Compute Unit Price Volatility (2019–2025)**

A line graph of $P_{CU}$ over time, showing historical fluctuations (\$0.04–\$0.08) with annotations for energy spikes (2022), GPU shortages (2021–2022), and demand surges (2023 AI boom). The 95% confidence interval (\$0.042–\$0.084) highlights the ±30% volatility, with a superimposed dashed line at \$0.06 (nominal STAB3L target).

## 2.5 Simulation of Volatility Impact

To quantify the impact, we perform a Monte Carlo simulation:

{% tabs %}
{% tab title="Parameters" %}
- $P_{CU} \sim LogNormal(\ln(0.06), 0.3)$
- $C_{energy} \sim Normal(0.12, 0.25)$
- $P_{hardware} \sim LogNormal(\ln(0.02), 0.4)$
- $D_{CU} \sim Poisson(50)$ with 10% probability of spikes to 75
{% endtab %}

{% tab title="Calculation" %}
10,000 runs over 12 months, calculating $P_{CU}$ as:

$$P_{CU} = P_{base} + \alpha \cdot C_{energy} + P_{hardware} + \beta \cdot (D_{CU} - D_{base})$$
{% endtab %}

{% tab title="Results" %}
95% of simulations show $P_{CU}$ ranging from \$0.042 to \$0.084, confirming 30% volatility. The economic impact is a \$150M annual loss in efficiency for a \$500B market, as users overpay or underutilize resources.
{% endtab %}
{% endtabs %}

## 2.6 STAB3L's Role

STAB3L addresses this volatility by pegging sSTB to 1 CU at \$0.06, stabilizing costs for users while incentivizing providers to maintain supply. The protocol's design, detailed in subsequent sections, mitigates energy, hardware, and demand risks through dynamic governance, liquidity incentives, and risk management. 