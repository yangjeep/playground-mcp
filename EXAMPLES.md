# Searchspring Integration Assistant Examples

This document provides examples of how to use the Searchspring Integration Assistant MCP Server tools for implementation guidance, code validation, and troubleshooting.

**IMPORTANT**: This MCP server provides implementation guidance and code validation - it does NOT make direct API calls or return live data.

## Configuration

Set up your Searchspring site ID for implementation guidance:

```bash
export SEARCHSPRING_SITE_ID="your_site_id_here"

# Optional: Secret key (only needed for bulk indexing guidance)
export SEARCHSPRING_SECRET_KEY="your_secret_key_here"
```

## Integration Guidance Examples

### 1. Search API Implementation

Get complete implementation guidance for product search:

```json
{
  "tool": "searchspring_search",
  "parameters": {
    "query": "running shoes",
    "page": 1,
    "resultsPerPage": 20,
    "filters": {
      "brand": ["Nike", "Adidas"],
      "color": "blue"
    },
    "sort": {
      "price": "asc"
    }
  }
}
```

**Returns:**
- Complete API endpoint URL with parameters
- JavaScript implementation example with error handling
- Required vs optional parameter explanations
- Documentation links

### 2. Autocomplete Implementation

Get real-time search suggestions implementation:

```json
{
  "tool": "searchspring_autocomplete",
  "parameters": {
    "query": "runn",
    "resultsPerPage": 8
  }
}
```

**Returns:**
- Debounced input handler implementation
- Fetch API example with proper error handling
- UI integration patterns
- Performance best practices

### 3. Spell Correction & Suggestions

Get spell correction implementation guidance:

```json
{
  "tool": "searchspring_suggest",
  "parameters": {
    "query": "atheltic wear",
    "language": "en",
    "suggestionCount": 4
  }
}
```

**Returns:**
- Spell correction API implementation
- "Did you mean?" UI patterns
- Alternative suggestion handling

### 4. Trending Terms Implementation

Get trending search terms implementation:

```json
{
  "tool": "searchspring_trending",
  "parameters": {
    "limit": 6
  }
}
```

**Returns:**
- Homepage trending implementation
- No-results page alternative queries
- Dynamic content loading patterns

## Platform-Specific Code Generation

### 5. Shopify IntelliSuggest Tracking

Generate Shopify-specific tracking code:

```json
{
  "tool": "searchspring_platform_implementation",
  "parameters": {
    "platform": "shopify",
    "eventType": "product",
    "sku": "DEMO-SHOE-123",
    "price": 99.99
  }
}
```

**Returns:**
- Liquid template syntax implementation
- Product page tracking code
- Required script inclusion
- Platform-specific documentation

### 6. Magento 2 Implementation

Generate Magento 2 tracking code:

```json
{
  "tool": "searchspring_platform_implementation",
  "parameters": {
    "platform": "magento2",
    "eventType": "cart",
    "sku": "PROD-456",
    "price": 29.99,
    "quantity": 2
  }
}
```

**Returns:**
- PHP template syntax (.phtml)
- Cart page tracking implementation
- Magento-specific variable usage

### 7. Custom Platform Implementation

Get generic implementation for custom platforms:

```json
{
  "tool": "searchspring_platform_implementation",
  "parameters": {
    "platform": "custom",
    "eventType": "sale",
    "sku": "ORDER-789",
    "price": 199.99,
    "quantity": 1
  }
}
```

## Code Validation & Troubleshooting

### 8. Validate Good Implementation

Check a properly implemented tracking code:

```json
{
  "tool": "searchspring_code_validator",
  "parameters": {
    "code": "<script src=\"//cdn.searchspring.net/intellisuggest/is.min.js\"></script>\n<script>\nif (typeof ss != 'undefined') {\n  ss.track.product.view({\n    sku: 'PRODUCT-123',\n    name: 'Running Shoes',\n    price: 99.99\n  });\n}\n</script>",
    "codeType": "tracking",
    "platform": "custom"
  }
}
```

**Returns:**
- ✅ Validation results (what's working)
- Best practices confirmation
- Documentation links

### 9. Troubleshoot Problematic Code

Identify issues in broken implementation:

```json
{
  "tool": "searchspring_code_validator",
  "parameters": {
    "code": "<script async src=\"//cdn.searchspring.net/intellisuggest/is.min.js\"></script>\n<script>\nss.track.product.view({\n  name: 'Running Shoes',\n  price: 99.99\n});\n</script>",
    "codeType": "tracking",
    "platform": "shopify",
    "issue": "Tracking events not appearing in analytics"
  }
}
```

**Returns:**
- ❌ Issues identified (missing SKU, unsafe script loading)
- ⚠️ Warnings (async script, missing safety checks)
- 🔧 Specific troubleshooting for the reported issue
- 💡 Suggestions for improvements

### 10. Search Implementation Validation

Validate search API integration:

```json
{
  "tool": "searchspring_code_validator",
  "parameters": {
    "code": "fetch('https://abc123.a.searchspring.io/api/search/search.json?siteId=abc123&q=test')\n  .then(response => response.json())\n  .then(data => console.log(data));",
    "codeType": "search",
    "issue": "Getting CORS errors"
  }
}
```

**Returns:**
- Missing parameter analysis
- CORS troubleshooting guidance
- Error handling recommendations

## Tracking Implementation Examples

### 11. IntelliSuggest Product Tracking

Get guidance for product view tracking:

```json
{
  "tool": "searchspring_intellisuggest_track",
  "parameters": {
    "type": "product",
    "event": {
      "sku": "PRODUCT-123",
      "name": "Athletic Sneakers",
      "price": 89.99,
      "category": "footwear"
    }
  }
}
```

### 12. Cart Event Tracking

Get guidance for cart addition tracking:

```json
{
  "tool": "searchspring_intellisuggest_track",
  "parameters": {
    "type": "cart",
    "event": {
      "sku": "PRODUCT-456",
      "name": "Sports T-Shirt",
      "price": 24.99,
      "quantity": 2,
      "category": "apparel"
    }
  }
}
```

### 13. Purchase Event Tracking

Get guidance for purchase completion tracking:

```json
{
  "tool": "searchspring_intellisuggest_track",
  "parameters": {
    "type": "sale",
    "event": {
      "sku": "PRODUCT-789",
      "name": "Running Shorts",
      "price": 34.99,
      "quantity": 1,
      "category": "apparel"
    }
  }
}
```

## Implementation Flow Examples

### 14. Search Result Click Tracking

Get implementation guidance for search result clicks:

```json
{
  "tool": "searchspring_search_result_click",
  "parameters": {
    "intellisuggestData": "eyJ0eXBlIjoic2VhcmNoIiwic291cmNlIjoic2VhcmNoIn0=",
    "intellisuggestSignature": "abc123def456",
    "note": "Implementing on product listing page"
  }
}
```

**Returns:**
- IntelliSuggest JavaScript SDK requirements
- Implementation instructions (not direct API calls)
- Documentation links for proper setup

### 15. Recommendations Implementation

Get guidance for recommendation profiles:

```json
{
  "tool": "searchspring_recommendations",
  "parameters": {
    "tags": ["similar-products", "trending"],
    "products": ["PRODUCT-123"],
    "limits": [5, 10],
    "shopper": "user123"
  }
}
```

**Returns:**
- API endpoint construction
- Parameter explanation
- Implementation examples

## Common Integration Scenarios

### New Customer Onboarding

1. **Start with Search**: Use `searchspring_search` to understand API structure
2. **Add Autocomplete**: Use `searchspring_autocomplete` for enhanced UX
3. **Implement Tracking**: Use `searchspring_platform_implementation` for your platform
4. **Validate Code**: Use `searchspring_code_validator` to ensure correctness
5. **Add Recommendations**: Use `searchspring_recommendations` for personalization

### Troubleshooting Existing Implementation

1. **Code Analysis**: Use `searchspring_code_validator` with your existing code
2. **Issue-Specific Help**: Include the `issue` parameter for targeted troubleshooting
3. **Platform Comparison**: Compare with `searchspring_platform_implementation` output
4. **Best Practices**: Review suggestions and warnings from validation

### Testing & Validation Workflow

1. **Implementation**: Generate code using platform-specific tools
2. **Validation**: Check implementation with code validator
3. **Testing**: Use generated API URLs to test endpoints
4. **Troubleshooting**: Use validator with specific issues
5. **Documentation**: Follow provided documentation links

## Demo & Interactive Testing

Run the included demo for hands-on examples:

```bash
./demo.sh
```

The demo showcases:
- 6 real-world integration scenarios
- Code validation examples (good vs problematic)
- Platform-specific code generation
- Troubleshooting guidance
- Interactive testing options

## Support Resources

All tools provide:
- 📖 **Documentation Links**: Direct links to relevant Searchspring docs
- 🔧 **Troubleshooting**: Issue-specific guidance
- 💡 **Best Practices**: Security and performance recommendations
- ✅ **Validation**: Code correctness verification

For additional support:
- Documentation: https://docs.searchspring.com/
- Support: https://help.searchspring.net/
- Implementation Guides: https://help.searchspring.net/hc/en-us/sections/201185149