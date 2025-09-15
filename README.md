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

✅ **Implementation Guidance** - Step-by-step API integration instructions for all 8 Searchspring APIs

✅ **Code Validation** - Analyze existing implementations for issues with platform-specific checks

✅ **Platform-Specific Code** - Generate code for Shopify, BigCommerce, Magento, and 7+ platforms

✅ **Troubleshooting** - Diagnose common integration problems with targeted solutions

✅ **Modern Platform Support** - Includes Shopify checkout extensibility and Web Pixel guidance

✅ **Documentation Links** - Direct links to relevant Searchspring docs

❌ **Not an API Proxy** - Does not make live API calls or return product data

## Available Tools

### 🎯 Implementation Guidance

| Tool | Input | Output |
|------|-------|--------|
| `searchspring_api_guide` | API name | Complete implementation guide with endpoints, examples, and best practices |
| `searchspring_parameter_guide` | API name + parameter | Detailed parameter explanation with usage examples and best practices |

**Supported APIs**: `search`, `autocomplete`, `suggest`, `trending`, `recommendations`, `finder`, `beacon`, `bulk-index`

### 🔧 Code Generation & Validation

| Tool | Input | Output |
|------|-------|--------|
| `searchspring_code_generator` | API + platform (+ eventType for tracking) | Platform-specific implementation code |
| `searchspring_code_validator` | Code + codeType (+ platform + issue) | Validation results, warnings, suggestions, and troubleshooting |

**Supported Platforms**: `shopify`, `bigcommerce`, `magento1`, `magento2`, `miva`, `commercev3`, `3dcart`, `volusion`, `javascript`, `php`, `python`, `custom`
**Supported Code Types**: `search`, `autocomplete`, `suggest`, `trending`, `recommendations`, `finder`, `beacon`, `bulk-index`, `tracking`

## Example Usage

### Get API Implementation Guide
```json
// Get comprehensive guidance for any API
Input: {"api": "search"}
Output: Complete implementation guide with endpoints, examples, and best practices
```

### Get Parameter Details
```json
// Understand specific API parameters
Input: {"api": "search", "parameter": "filters"}
Output: Detailed explanation of filters parameter with examples and best practices
```

### Generate Platform Code
```json
// Generate platform-specific implementation
Input: {"api": "beacon", "platform": "shopify", "eventType": "product"}
Output: Ready-to-use Shopify tracking code with Liquid template syntax
```

### Validate Implementation
```json
// Validate existing code and get troubleshooting help
Input: {
  "code": "<script>ss.track.product.view({sku: 'ABC'});</script>",
  "codeType": "tracking",
  "platform": "shopify",
  "issue": "Events not showing in analytics"
}
Output: ❌ Missing IntelliSuggest script, ⚠️ No safety check, 🔧 Troubleshooting steps
```

## Integration Workflow

1. **Planning** → Use `searchspring_api_guide` to understand API structure and requirements
2. **Deep Dive** → Use `searchspring_parameter_guide` for specific parameter details
3. **Implementation** → Use `searchspring_code_generator` to create platform-specific code
4. **Validation** → Use `searchspring_code_validator` to check your implementation
5. **Troubleshooting** → Use validator with specific issues for detailed diagnosis

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

## Docker Deployment

Ready for production deployment with Docker:

```bash
# Build the Docker image
docker build -t searchspring-mcp .

# Run with environment variables
docker run -e SEARCHSPRING_SITE_ID=your_site_id searchspring-mcp
```

**Security Features**: Non-root user, minimal Alpine base, production-optimized

## Common Use Cases

**New Searchspring Customer**: Get implementation guidance for search, autocomplete, and tracking
**Existing Implementation Issues**: Validate code and get troubleshooting help
**Platform Migration**: Generate platform-specific tracking code
**Development Team Onboarding**: Understand API structure and best practices
**Modern Shopify Stores**: Get guidance for checkout extensibility and Web Pixel tracking

## Support

- 📖 **Documentation**: https://docs.searchspring.com/
- 🎯 **Help Center**: https://help.searchspring.net/
- 🔧 **Implementation Guides**: https://help.searchspring.net/hc/en-us/sections/201185149

## License

MIT