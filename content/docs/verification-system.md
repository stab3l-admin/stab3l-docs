---
title: Verification System
description: Detailed explanation of the cryptographic verification methods used in STAB3L
category: Technical
order: 3
---

# Verification System

The STAB3L verification system is a critical component that ensures the authenticity and performance of compute resources offered on the platform. This document provides a detailed explanation of the verification methods, their implementation, and the security measures in place.

{% hint style="info" %}
This documentation is intended for developers and technical users who want to understand the inner workings of the STAB3L verification system.
{% endhint %}

{% hint style="warning" %}
**Important**: CU tokens are NOT tradable assets. They are temporary tokens that are burned immediately when exchanged for sSTB. This burning mechanism is crucial for maintaining the peg and ensuring that each sSTB is backed by real compute resources.
{% endhint %}

## Overview

STAB3L employs two primary verification methods:

1. **Zero-Knowledge Proofs (ZKPs)**: Cryptographic proofs that allow providers to verify their compute resources without revealing sensitive hardware details.

2. **Trusted Execution Environments (TEEs)**: Secure enclaves within processors that provide hardware-level security and remote attestation capabilities.

Both methods serve the same purpose: to cryptographically verify that providers possess the compute resources they claim to have and that benchmarks are run correctly.

{% hint style="info" %}
Providers can choose either verification method based on their hardware capabilities and security preferences.
{% endhint %}

## Verification Process

The verification process follows these steps:

1. **Provider Registration**: Providers register on the platform and select a verification method (ZKP or TEE).
2. **Staking Period Selection**: Providers choose a staking period (minimum 7 days), with longer periods earning higher rewards.
3. **Benchmark Execution**: Providers run standardized benchmarks on their compute resources.
4. **Proof Generation**: The benchmarks generate cryptographic proofs (ZKPs) or attestations (TEEs).
5. **On-chain Verification**: Smart contracts verify the proofs or attestations.
6. **CU Value Assignment**: Based on the verified results, a standardized CU value is assigned (1 CU = 10^15 FLOPs, valued at $0.06).
7. **Temporary CU Token Creation**: Verified compute resources are represented as temporary CU tokens.
8. **Immediate Exchange for sSTB**: These temporary CU tokens are immediately exchanged for sSTB tokens.
9. **CU Token Burning**: The temporary CU tokens are burned upon exchange for sSTB.
10. **Automatic sSTB Staking**: The newly minted sSTB tokens are automatically staked for the chosen period.
11. **Collateral Locking**: Provider's collateral (minimum 120% of CU value) is locked for the duration of the staking period.
12. **rSTB Rewards**: Providers earn rSTB rewards throughout the staking period, with longer periods earning higher rewards.

{% hint style="info" %}
The definition and value of 1 CU will be reviewed and potentially adjusted quarterly by the DAO through governance voting to ensure the CU standard remains relevant as compute technology evolves.
{% endhint %}

## Zero-Knowledge Proofs (ZKPs)

### How ZKPs Work in STAB3L

Zero-Knowledge Proofs allow providers to prove they have run benchmarks correctly without revealing sensitive information about their hardware. The ZKP system in STAB3L works as follows:

1. **Circuit Design**: Custom ZK circuits are designed for compute resource verification.

2. **Prover Software**: Providers download and run the STAB3L prover software, which:
   - Executes benchmarks on the provider's hardware
   - Collects performance metrics
   - Generates ZK proofs based on the benchmark results

3. **Proof Submission**: The generated proofs are submitted to the STAB3L platform.

4. **Verification**: Smart contracts verify the proofs using efficient verification algorithms.

### ZKP Technical Implementation

STAB3L's ZKP implementation uses the following technologies:

- **Circuit Framework**: [Circom](https://docs.circom.io/) for circuit design
- **Proving System**: [Groth16](https://eprint.iacr.org/2016/260.pdf) for efficient proof generation and verification
- **Verification Contract**: Custom Solidity contract optimized for gas efficiency

{% tabs %}
{% tab title="ZKP Circuit Example" %}
```circom
pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/poseidon.circom";

template ComputeVerifier() {
    signal input benchmarkResults[10];
    signal input hardwareNonce;
    signal input timestamp;
    
    signal output validationHash;
    
    // Verify benchmark results are within valid ranges
    component rangeChecks[10];
    for (var i = 0; i < 10; i++) {
        rangeChecks[i] = LessEqThan(64);
        rangeChecks[i].in[0] <== benchmarkResults[i];
        rangeChecks[i].in[1] <== 1000000; // Maximum valid benchmark value
    }
    
    // Calculate validation hash
    component hasher = Poseidon(12);
    for (var i = 0; i < 10; i++) {
        hasher.inputs[i] <== benchmarkResults[i];
    }
    hasher.inputs[10] <== hardwareNonce;
    hasher.inputs[11] <== timestamp;
    
    validationHash <== hasher.out;
}

component main = ComputeVerifier();
```
{% endtab %}

{% tab title="Verification Contract" %}
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IVerifier.sol";

contract ZKPVerificationManager is ReentrancyGuard {
    IVerifier public immutable verifier;
    
    mapping(address => bool) public verifiedProviders;
    mapping(address => uint256) public providerCUValue;
    
    event ProviderVerified(address indexed provider, uint256 cuValue);
    
    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }
    
    function submitProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[12] memory input,
        uint256 cuValue
    ) external nonReentrant {
        require(!verifiedProviders[msg.sender], "Provider already verified");
        
        // Verify the ZKP
        require(verifier.verifyProof(a, b, c, input), "Invalid proof");
        
        // Store verification result
        verifiedProviders[msg.sender] = true;
        providerCUValue[msg.sender] = cuValue;
        
        emit ProviderVerified(msg.sender, cuValue);
    }
}
```
{% endtab %}
{% endtabs %}

### Security Considerations for ZKPs

- **Proof Soundness**: The ZKP system ensures that it is computationally infeasible to generate a valid proof for false statements.
- **Zero-Knowledge Property**: No information about the provider's hardware is revealed beyond what is explicitly shared.
- **Circuit Updates**: The ZK circuits are periodically updated to address potential vulnerabilities and improve efficiency.
- **Trusted Setup**: The ZK system uses a trusted setup ceremony with multiple participants to ensure security.

## Trusted Execution Environments (TEEs)

### How TEEs Work in STAB3L

Trusted Execution Environments provide hardware-level security for running benchmarks and generating attestations. The TEE system in STAB3L works as follows:

1. **Enclave Setup**: Providers set up TEE enclaves (Intel SGX, AMD SEV, etc.) on their servers.

2. **Benchmark Execution**: The STAB3L benchmark software runs within the secure enclave.

3. **Attestation Generation**: The enclave generates a cryptographic attestation that proves:
   - The benchmark ran in a genuine TEE
   - The benchmark code was not tampered with
   - The benchmark results are authentic

4. **Attestation Verification**: Smart contracts verify the attestation using the TEE manufacturer's verification services.

### TEE Technical Implementation

STAB3L's TEE implementation supports the following technologies:

- **Intel SGX**: Software Guard Extensions for Intel processors
- **AMD SEV**: Secure Encrypted Virtualization for AMD processors
- **AWS Nitro Enclaves**: Secure enclaves for AWS cloud instances
- **Azure Confidential Computing**: Microsoft's TEE implementation

{% tabs %}
{% tab title="TEE Benchmark Runner" %}
```rust
use sgx_types::*;
use sgx_urts::SgxEnclave;
use std::io::{Read, Write};

// Path to the signed enclave
const ENCLAVE_FILE: &str = "benchmark_enclave.signed.so";

fn main() -> Result<(), String> {
    // Initialize the enclave
    let enclave = match init_enclave() {
        Ok(e) => e,
        Err(err) => return Err(format!("Failed to initialize enclave: {}", err)),
    };

    println!("Enclave initialized successfully. ID: {}", enclave.geteid());
    
    // Run benchmark inside the enclave
    let mut benchmark_results = [0u64; 10];
    let mut retval = sgx_status_t::SGX_SUCCESS;
    
    let result = unsafe {
        run_benchmark(
            enclave.geteid(),
            &mut retval,
            benchmark_results.as_mut_ptr(),
            benchmark_results.len() as u32
        )
    };

    // Check the result
    match result {
        sgx_status_t::SGX_SUCCESS => {
            if retval == sgx_status_t::SGX_SUCCESS {
                println!("Benchmark completed successfully");
                println!("Results: {:?}", benchmark_results);
                
                // Generate attestation
                let mut attestation = vec![0u8; 1024];
                let mut att_size = 0u32;
                
                let att_result = unsafe {
                    generate_attestation(
                        enclave.geteid(),
                        &mut retval,
                        benchmark_results.as_ptr(),
                        benchmark_results.len() as u32,
                        attestation.as_mut_ptr(),
                        attestation.len() as u32,
                        &mut att_size
                    )
                };
                
                if att_result == sgx_status_t::SGX_SUCCESS && retval == sgx_status_t::SGX_SUCCESS {
                    attestation.truncate(att_size as usize);
                    println!("Attestation generated successfully");
                    
                    // Save attestation to file
                    let mut file = std::fs::File::create("attestation.bin").unwrap();
                    file.write_all(&attestation).unwrap();
                    
                    Ok(())
                } else {
                    Err(format!("Failed to generate attestation: {:?}", att_result))
                }
            } else {
                Err(format!("Enclave returned error: {:?}", retval))
            }
        },
        err => Err(format!("Failed to run benchmark: {:?}", err)),
    }
}

fn init_enclave() -> SgxResult<SgxEnclave> {
    let mut launch_token: sgx_launch_token_t = [0; 1024];
    let mut launch_token_updated: i32 = 0;
    
    let debug = 1;
    let mut misc_attr = sgx_misc_attribute_t {
        secs_attr: sgx_attributes_t { flags: 0, xfrm: 0 },
        misc_select: 0,
    };
    
    SgxEnclave::create(
        ENCLAVE_FILE,
        debug,
        &mut launch_token,
        &mut launch_token_updated,
        &mut misc_attr
    )
}

extern {
    fn run_benchmark(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        results: *mut u64,
        results_len: u32
    ) -> sgx_status_t;
    
    fn generate_attestation(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        results: *const u64,
        results_len: u32,
        attestation: *mut u8,
        attestation_max_len: u32,
        attestation_len: *mut u32
    ) -> sgx_status_t;
}
```
{% endtab %}

{% tab title="TEE Verification Contract" %}
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/ITEEVerifier.sol";

contract TEEVerificationManager is ReentrancyGuard {
    ITEEVerifier public immutable teeVerifier;
    
    mapping(address => bool) public verifiedProviders;
    mapping(address => uint256) public providerCUValue;
    
    event ProviderVerified(address indexed provider, uint256 cuValue, string teeType);
    
    constructor(address _teeVerifier) {
        teeVerifier = ITEEVerifier(_teeVerifier);
    }
    
    function submitAttestation(
        bytes calldata attestation,
        string calldata teeType,
        uint256 cuValue
    ) external nonReentrant {
        require(!verifiedProviders[msg.sender], "Provider already verified");
        
        // Verify the TEE attestation
        require(teeVerifier.verifyAttestation(attestation, teeType), "Invalid attestation");
        
        // Extract benchmark results from attestation
        uint256[] memory benchmarkResults = teeVerifier.extractBenchmarkResults(attestation);
        
        // Validate benchmark results
        require(validateBenchmarkResults(benchmarkResults), "Invalid benchmark results");
        
        // Store verification result
        verifiedProviders[msg.sender] = true;
        providerCUValue[msg.sender] = cuValue;
        
        emit ProviderVerified(msg.sender, cuValue, teeType);
    }
    
    function validateBenchmarkResults(uint256[] memory results) internal pure returns (bool) {
        // Implement validation logic
        // This is a simplified example
        if (results.length != 10) return false;
        
        for (uint i = 0; i < results.length; i++) {
            if (results[i] > 1000000) return false;
        }
        
        return true;
    }
}
```
{% endtab %}
{% endtabs %}

### Security Considerations for TEEs

- **Remote Attestation**: TEEs provide remote attestation capabilities that allow verification of the enclave's authenticity.
- **Memory Encryption**: Data within the TEE is encrypted and protected from access by the operating system or other processes.
- **Side-Channel Attacks**: STAB3L implements countermeasures against side-channel attacks on TEEs.
- **Manufacturer Updates**: The TEE verification system is updated regularly to incorporate security patches from manufacturers.

## Standardization Algorithm

After verification, the benchmark results are processed by a standardization algorithm that normalizes them across different hardware configurations. This ensures that CUs from different providers are comparable and interchangeable.

The standardization algorithm:

1. Normalizes benchmark results based on reference hardware configurations
2. Applies weightings to different performance metrics (CPU, memory, storage, network)
3. Calculates a standardized CU value
4. Assigns a quality tier (Standard, Premium, Enterprise)

{% tabs %}
{% tab title="Standardization Algorithm" %}
```python
def standardize_compute_unit(benchmark_results):
    """
    Standardize benchmark results into a compute unit value.
    
    Args:
        benchmark_results: Dictionary containing benchmark results
        
    Returns:
        Tuple of (cu_value, quality_tier)
    """
    # Reference values for normalization
    reference_values = {
        'cpu_score': 10000,
        'memory_score': 8000,
        'storage_score': 5000,
        'network_score': 3000
    }
    
    # Weights for different components
    weights = {
        'cpu_score': 0.4,
        'memory_score': 0.3,
        'storage_score': 0.2,
        'network_score': 0.1
    }
    
    # Normalize scores
    normalized_scores = {}
    for metric, value in benchmark_results.items():
        if metric in reference_values:
            normalized_scores[metric] = value / reference_values[metric]
    
    # Calculate weighted score
    weighted_score = 0
    for metric, normalized_value in normalized_scores.items():
        weighted_score += normalized_value * weights[metric]
    
    # Calculate CU value (1-100 scale)
    cu_value = int(weighted_score * 100)
    
    # Determine quality tier
    if cu_value >= 80:
        quality_tier = "Enterprise"
    elif cu_value >= 50:
        quality_tier = "Premium"
    else:
        quality_tier = "Standard"
    
    return (cu_value, quality_tier)
```
{% endtab %}
{% endtabs %}

## Verification Security Measures

STAB3L implements several security measures to ensure the integrity of the verification system:

### Anti-Fraud Mechanisms

- **Hardware Fingerprinting**: Each provider's hardware is fingerprinted to prevent multiple verifications of the same hardware.
- **Time-Based Challenges**: Verification includes time-based challenges to prevent replay attacks.
- **Reputation System**: Providers build a reputation over time, with higher-reputation providers receiving preferential treatment.

### Audit Trail

- **Verification History**: All verification attempts are logged and stored for audit purposes.
- **Revocation Capability**: Verifications can be revoked if fraud is detected.
- **Regular Re-verification**: Providers must re-verify their compute resources periodically.

## Integration with Other Components

The verification system integrates with other STAB3L components:

- **sSTB Minting System**: Verified compute resources are represented as temporary CU tokens that are immediately exchanged for sSTB tokens.
- **Marketplace**: sSTB tokens can be traded on the marketplace, representing the verified compute resources.
- **Redemption System**: When users redeem sSTB tokens, providers must deliver the verified compute resources.

## Future Enhancements

STAB3L is continuously improving its verification system. Planned enhancements include:

- **Additional TEE Support**: Support for more TEE technologies (e.g., ARM TrustZone).
- **Enhanced ZK Circuits**: More efficient and comprehensive ZK circuits for verification.
- **AI-Based Verification**: Integration of AI techniques to detect fraudulent verification attempts.
- **Decentralized Verification Network**: A network of independent verifiers to enhance security and decentralization.

## Conclusion

The STAB3L verification system provides a robust and secure method for verifying compute resources. By using cryptographic techniques like ZKPs and TEEs, STAB3L ensures that verified compute resources accurately back the sSTB tokens, creating a trustless marketplace for compute power.

{% hint style="success" %}
The verification system is a cornerstone of STAB3L's value proposition, enabling trustless trading of compute resources across blockchain ecosystems.
{% endhint %} 