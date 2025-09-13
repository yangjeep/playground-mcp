# Searchspring Integration Assistant

A Model Context Protocol (MCP) server that provides **implementation guidance, code validation, and troubleshooting** for Searchspring's e-commerce APIs.

> **Important**: This is an integration assistant, not an API proxy. It returns implementation guidance and code examples rather than live API data.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   npm run build
   ```

2. **Configure environment**:
   ```bash
   export SEARCHSPRING_SITE_ID="your_site_id_here"
   # Optional: export SEARCHSPRING_SECRET_KEY="your_secret_key" (for bulk indexing only)
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

## What This MCP Does

✅ **Implementation Guidance** - Step-by-step API integration instructions
✅ **Code Validation** - Analyze existing implementations for issues
✅ **Platform-Specific Code** - Generate Shopify, Magento, etc. tracking code
✅ **Troubleshooting** - Diagnose common integration problems
✅ **Documentation Links** - Direct links to relevant Searchspring docs

❌ **Not an API Proxy** - Does not make live API calls or return product data

## Available Tools

### Implementation Guidance Tools

| Tool | Input | Output |
|------|-------|--------|
| `searchspring_search` | Search parameters (query, filters, sort) | Complete API endpoint URL + JavaScript implementation example |
| `searchspring_autocomplete` | Query string + options | Debounced autocomplete implementation with error handling |
| `searchspring_suggest` | Query string + language | Spell correction API implementation + "Did you mean?" patterns |
| `searchspring_trending` | Limit (default: 6) | Trending terms API implementation + UI integration examples |
| `searchspring_recommendations` | Tags + personalization data | Recommendation API endpoint + implementation guidance |

### Code Generation Tools

| Tool | Input | Output |
|------|-------|--------|
| `searchspring_platform_implementation` | Platform + event type + sample data | Ready-to-use tracking code for specific platforms |
| `searchspring_search_result_click` | IntelliSuggest data + signature | JavaScript SDK implementation instructions |

**Supported Platforms**: Shopify, BigCommerce, Magento 1/2, Miva, Commerce v3, 3DCart, Volusion, Custom

### Validation & Troubleshooting Tools

| Tool | Input | Output |
|------|-------|--------|
| `searchspring_code_validator` | Code + type + platform + issue (optional) | ✅ Validation results, ⚠️ warnings, 💡 suggestions, 🔧 troubleshooting |
| `searchspring_intellisuggest_track` | Event type + product data | Tracking implementation guidance |
| `searchspring_beacon_track` | Event data + context | Analytics tracking implementation |

### Data Management Tools

| Tool | Input | Output |
|------|-------|--------|
| `searchspring_bulk_index` | Feed ID + options | Bulk indexing API implementation guidance |
| `searchspring_bulk_index_status` | None | Status check API implementation guidance |
| `searchspring_finder` | Filters + facets | Product finder API implementation with faceting |

## Example Usage

### Get Search Implementation
```json
Input: {"query": "shoes", "filters": {"brand": ["Nike"]}}
Output: Complete API URL + fetch() implementation + error handling
```

### Validate Tracking Code
```json
Input: {
  "code": "<script>ss.track.product.view({sku: 'ABC'});</script>",
  "codeType": "tracking",
  "issue": "Events not showing in analytics"
}
Output: ❌ Missing IntelliSuggest script, ⚠️ No safety check, 🔧 Troubleshooting steps
```

### Generate Platform Code
```json
Input: {"platform": "shopify", "eventType": "product", "sku": "DEMO-123"}
Output: Liquid template code for Shopify product tracking
```

## Integration Workflow

1. **Planning** → Use search/autocomplete tools to understand API structure
2. **Implementation** → Use platform-specific tools to generate tracking code
3. **Validation** → Use code validator to check implementation
4. **Troubleshooting** → Use validator with specific issues for diagnosis
5. **Testing** → Use generated API URLs to test endpoints

## Testing

Test the MCP server:
```bash
npm test
```

For interactive testing with MCP clients, see the MCP Client Integration section below.

## Configuration Options

| Variable | Required | Description |
|----------|----------|-------------|
| `SEARCHSPRING_SITE_ID` | ✅ Yes | Your Searchspring site identifier |
| `SEARCHSPRING_SECRET_KEY` | ❌ No | Only needed for bulk indexing tools |
| `SEARCHSPRING_TIMEOUT` | ❌ No | Request timeout in ms (default: 10000) |

## MCP Client Integration

### Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "searchspring": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "SEARCHSPRING_SITE_ID": "your_site_id"
      }
    }
  }
}
```

## Common Use Cases

**New Searchspring Customer**: Get implementation guidance for search, autocomplete, and tracking
**Existing Implementation Issues**: Validate code and get troubleshooting help
**Platform Migration**: Generate platform-specific tracking code
**Development Team Onboarding**: Understand API structure and best practices

## Support

- 📖 **Documentation**: https://docs.searchspring.com/
- 🎯 **Help Center**: https://help.searchspring.net/
- 🔧 **Implementation Guides**: https://help.searchspring.net/hc/en-us/sections/201185149

## License

MIT