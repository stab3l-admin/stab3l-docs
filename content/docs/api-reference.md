---
title: API Reference
description: Comprehensive documentation for the STAB3L API
category: Developer Resources
order: 1
---

# API Reference

The STAB3L API provides programmatic access to the STAB3L platform, allowing developers to integrate compute unit standardization, verification, and marketplace functionality into their applications.

{% hint style="info" %}
The API is available at `https://api.stab3l.io`. All requests must use HTTPS.
{% endhint %}

## Authentication

The STAB3L API uses JWT (JSON Web Tokens) for authentication:

### Obtaining an API Key

1. Register or log in to the [STAB3L Developer Portal](https://developers.stab3l.io)
2. Navigate to the "API Keys" section
3. Create a new API key
4. Store your API key securely

### Authentication Methods

{% tabs %}
{% tab title="Bearer Token" %}
Include your API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

Example:
```bash
curl -X GET \
  https://api.stab3l.io/api/v1/cu/list \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```
{% endtab %}

{% tab title="Query Parameter" %}
Include your API key as a query parameter:

```
?api_key=YOUR_API_KEY
```

Example:
```bash
curl -X GET \
  'https://api.stab3l.io/api/v1/cu/list?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

{% hint style="warning" %}
This method is less secure and should only be used for testing.
{% endhint %}
{% endtab %}
{% endtabs %}

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Standard Tier**: 100 requests per minute
- **Premium Tier**: 500 requests per minute
- **Enterprise Tier**: Custom limits

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## API Endpoints

### Compute Units

#### List CU Tokens

```
GET /api/v1/cu/list
```

Returns a list of CU tokens based on the specified filters.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `provider_id` | string | Filter by provider ID |
| `min_value` | number | Minimum CU value |
| `max_value` | number | Maximum CU value |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Response:**

```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "token_id": 123,
        "cu_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "cu_value": 100,
        "provider_id": "provider-123",
        "expiration_timestamp": 1672531200,
        "metadata": {
          "cpu_cores": 8,
          "ram_gb": 32,
          "storage_gb": 500,
          "network_mbps": 1000
        }
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

#### Get CU Token Details

```
GET /api/v1/cu/:token_id
```

Returns detailed information about a specific CU token.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `token_id` | number | The ID of the CU token |

**Response:**

```json
{
  "success": true,
  "data": {
    "token_id": 123,
    "cu_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "cu_value": 100,
    "provider_id": "provider-123",
    "expiration_timestamp": 1672531200,
    "creation_timestamp": 1640995200,
    "owner": "0x1234567890abcdef1234567890abcdef12345678",
    "metadata": {
      "cpu_cores": 8,
      "ram_gb": 32,
      "storage_gb": 500,
      "network_mbps": 1000,
      "location": {
        "country": "United States",
        "region": "US-East"
      },
      "benchmark_results": {
        "cpu_score": 8500,
        "memory_score": 7800,
        "storage_score": 9200,
        "network_score": 8900
      }
    }
  }
}
```

### Providers

#### List Providers

```
GET /api/v1/providers/list
```

Returns a list of registered compute providers.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `status` | string | Filter by status (active, pending, suspended) |
| `min_reputation` | number | Minimum reputation score |
| `location` | string | Filter by location (country or region) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Response:**

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "provider_id": "provider-123",
        "name": "Example Provider",
        "status": "active",
        "reputation_score": 95,
        "location": {
          "country": "United States",
          "region": "US-East"
        },
        "total_cu_value": 10000,
        "available_cu_value": 5000
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

#### Get Provider Details

```
GET /api/v1/providers/:provider_id
```

Returns detailed information about a specific provider.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `provider_id` | string | The ID of the provider |

**Response:**

```json
{
  "success": true,
  "data": {
    "provider_id": "provider-123",
    "name": "Example Provider",
    "status": "active",
    "reputation_score": 95,
    "registration_date": 1640995200,
    "location": {
      "country": "United States",
      "region": "US-East"
    },
    "contact_info": {
      "email": "provider@example.com",
      "website": "https://example.com"
    },
    "hardware_specifications": {
      "cpu_type": "AMD EPYC 7763",
      "total_cpu_cores": 512,
      "total_ram_gb": 4096,
      "total_storage_gb": 100000,
      "network_capacity_mbps": 10000
    },
    "statistics": {
      "total_cu_value": 10000,
      "available_cu_value": 5000,
      "total_redemptions": 150,
      "successful_redemptions": 148,
      "average_response_time": 15 // minutes
    }
  }
}
```

### Marketplace

#### List Marketplace Listings

```
GET /api/v1/marketplace/listings
```

Returns a list of active marketplace listings.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `market_type` | string | Filter by market type (spot, futures, options) |
| `provider_id` | string | Filter by provider ID |
| `min_price` | number | Minimum price |
| `max_price` | number | Maximum price |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Response:**

```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "listing_id": 456,
        "market_type": "spot",
        "token_id": 123,
        "seller": "0x1234567890abcdef1234567890abcdef12345678",
        "amount": 10,
        "price_per_token": 100,
        "total_price": 1000,
        "listed_at": 1640995200,
        "expiration": 1672531200,
        "provider_id": "provider-123",
        "cu_value": 100
      }
    ],
    "total": 200,
    "page": 1,
    "limit": 20
  }
}
```

#### Get Listing Details

```
GET /api/v1/marketplace/listings/:listing_id
```

Returns detailed information about a specific marketplace listing.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `listing_id` | number | The ID of the listing |

**Response:**

```json
{
  "success": true,
  "data": {
    "listing_id": 456,
    "market_type": "spot",
    "token_id": 123,
    "seller": "0x1234567890abcdef1234567890abcdef12345678",
    "amount": 10,
    "price_per_token": 100,
    "total_price": 1000,
    "listed_at": 1640995200,
    "expiration": 1672531200,
    "provider_id": "provider-123",
    "cu_value": 100,
    "token_details": {
      "cu_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "expiration_timestamp": 1672531200,
      "metadata": {
        "cpu_cores": 8,
        "ram_gb": 32,
        "storage_gb": 500,
        "network_mbps": 1000
      }
    },
    "provider_details": {
      "name": "Example Provider",
      "reputation_score": 95,
      "location": {
        "country": "United States",
        "region": "US-East"
      }
    }
  }
}
```

### Bridge

#### List Supported Chains

```
GET /api/v1/bridge/chains
```

Returns a list of chains supported by the bridge.

**Response:**

```json
{
  "success": true,
  "data": {
    "chains": [
      {
        "chain_id": "arbitrum",
        "name": "Arbitrum",
        "native_chain_id": 42161,
        "is_evm_compatible": true,
        "bridge_address": "0x1234567890abcdef1234567890abcdef12345678",
        "status": "active"
      },
      {
        "chain_id": "ethereum",
        "name": "Ethereum",
        "native_chain_id": 1,
        "is_evm_compatible": true,
        "bridge_address": "0x1234567890abcdef1234567890abcdef12345678",
        "status": "active"
      }
    ]
  }
}
```

#### Get Bridge Fees

```
GET /api/v1/bridge/fees
```

Returns the current bridge fees for different chains and fee tokens.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `source_chain` | string | Source chain ID |
| `destination_chain` | string | Destination chain ID |
| `amount` | number | Amount of tokens to bridge |

**Response:**

```json
{
  "success": true,
  "data": {
    "source_chain": "arbitrum",
    "destination_chain": "ethereum",
    "amount": 10,
    "fees": {
      "default": {
        "token": "USDC",
        "amount": 5.00
      },
      "stab3l": {
        "token": "STAB3L",
        "amount": 50.00,
        "discount": "10%"
      },
      "stb_gov": {
        "token": "STB-GOV",
        "amount": 2.50,
        "discount": "25%"
      }
    }
  }
}
```

#### Get Bridge Transaction Status

```
GET /api/v1/bridge/status/:message_id
```

Returns the status of a bridge transaction.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `message_id` | number | The ID of the bridge message |

**Response:**

```json
{
  "success": true,
  "data": {
    "message_id": 789,
    "source_chain": "arbitrum",
    "destination_chain": "ethereum",
    "sender": "0x1234567890abcdef1234567890abcdef12345678",
    "recipient": "0x1234567890abcdef1234567890abcdef12345678",
    "token_id": 123,
    "amount": 10,
    "status": "completed",
    "created_at": 1640995200,
    "updated_at": 1640998800,
    "confirmations": 5,
    "required_confirmations": 5,
    "source_transaction": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "destination_transaction": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  }
}
```

### Verification

#### Submit Verification

```
POST /api/v1/verification/submit
```

Submits compute resources for verification.

**Request Body:**

```json
{
  "verification_type": "zkp",
  "provider_id": "provider-123",
  "benchmark_results": {
    "cpu_score": 8500,
    "memory_score": 7800,
    "storage_score": 9200,
    "network_score": 8900
  },
  "proof": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "metadata": {
    "cpu_cores": 8,
    "ram_gb": 32,
    "storage_gb": 500,
    "network_mbps": 1000
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "verification_id": "verification-123",
    "status": "pending",
    "submitted_at": 1640995200,
    "estimated_completion_time": 1640998800
  }
}
```

#### Check Verification Status

```
GET /api/v1/verification/:verification_id
```

Checks the status of a verification request.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `verification_id` | string | The ID of the verification request |

**Response:**

```json
{
  "success": true,
  "data": {
    "verification_id": "verification-123",
    "provider_id": "provider-123",
    "status": "completed",
    "submitted_at": 1640995200,
    "completed_at": 1640998800,
    "result": {
      "is_verified": true,
      "cu_value": 100,
      "cu_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "verification_method": "zkp",
      "verifier": "0x1234567890abcdef1234567890abcdef12345678"
    }
  }
}
```

## Webhooks

The STAB3L API supports webhooks for real-time notifications:

### Setting Up Webhooks

1. Navigate to the "Webhooks" section in the Developer Portal
2. Add a new webhook URL
3. Select the events you want to subscribe to
4. Configure optional security settings

### Webhook Events

| Event | Description |
|-------|-------------|
| `cu.minted` | A new CU token has been minted |
| `cu.redeemed` | A CU token has been redeemed |
| `listing.created` | A new marketplace listing has been created |
| `listing.purchased` | A marketplace listing has been purchased |
| `verification.completed` | A verification request has been completed |
| `bridge.message_sent` | A bridge message has been sent |
| `bridge.message_received` | A bridge message has been received |

### Webhook Payload

```json
{
  "event": "cu.minted",
  "timestamp": 1640995200,
  "data": {
    "token_id": 123,
    "cu_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "cu_value": 100,
    "provider_id": "provider-123",
    "owner": "0x1234567890abcdef1234567890abcdef12345678"
  }
}
```

### Webhook Security

To ensure webhook security:

1. Verify the signature in the `X-STAB3L-Signature` header
2. Use HTTPS for your webhook endpoint
3. Implement retry logic for failed webhook deliveries

## Error Handling

The API uses standard HTTP status codes and returns detailed error information:

```json
{
  "success": false,
  "error": {
    "code": "invalid_parameter",
    "message": "The provided parameter is invalid",
    "details": {
      "parameter": "provider_id",
      "reason": "Provider ID does not exist"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `authentication_error` | Authentication failed |
| `authorization_error` | Insufficient permissions |
| `invalid_parameter` | Invalid parameter value |
| `resource_not_found` | Requested resource not found |
| `rate_limit_exceeded` | Rate limit exceeded |
| `internal_error` | Internal server error |

## SDKs and Libraries

STAB3L provides official SDKs for popular programming languages:

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">JavaScript/TypeScript</h3>
    <p>For Node.js and browser applications</p>
    <a href="https://github.com/stab3l/stab3l-js" class="text-blue-500 hover:underline">GitHub Repository</a>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Python</h3>
    <p>For Python applications and scripts</p>
    <a href="https://github.com/stab3l/stab3l-python" class="text-blue-500 hover:underline">GitHub Repository</a>
  </div>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold">Rust</h3>
    <p>For Rust applications</p>
    <a href="https://github.com/stab3l/stab3l-rust" class="text-blue-500 hover:underline">GitHub Repository</a>
  </div>
</div>

## Best Practices

{% hint style="success" %}
Following these best practices will help you build robust applications with the STAB3L API.
{% endhint %}

### Performance Optimization

1. **Use Pagination**: Always use pagination for list endpoints
2. **Limit Response Fields**: Request only the fields you need
3. **Cache Responses**: Cache responses that don't change frequently
4. **Use Webhooks**: Use webhooks for real-time updates instead of polling

### Security

1. **Secure API Keys**: Store API keys securely and never expose them in client-side code
2. **Use HTTPS**: Always use HTTPS for API requests
3. **Implement Rate Limiting**: Add rate limiting in your application
4. **Validate Webhook Signatures**: Always validate webhook signatures

### Error Handling

1. **Implement Retry Logic**: Retry failed requests with exponential backoff
2. **Handle Rate Limits**: Respect rate limit headers and pause requests when limits are reached
3. **Log Errors**: Log detailed error information for debugging
4. **Graceful Degradation**: Design your application to gracefully handle API unavailability

## Conclusion

The STAB3L API provides comprehensive access to the platform's functionality, enabling developers to build applications that leverage compute unit standardization, verification, and marketplace features. For additional support, visit the [Developer Forum](https://forum.stab3l.io/developers) or contact [developer support](mailto:developers@stab3l.io). 