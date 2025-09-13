# Searchspring Integration Assistant (MCP Server)

MCP server designed as an integration assistant to help customers implement Searchspring APIs correctly.

This Model Context Protocol (MCP) server provides **implementation guidance, code validation, and troubleshooting tools** for Searchspring's e-commerce APIs. Instead of making direct API calls, it serves as an intelligent assistant that helps developers properly implement search, autocomplete, IntelliSuggest tracking, and recommendations in their applications.

## Features

The server provides **integration assistance** for all major Searchspring APIs:

- **Implementation Guidance**: Step-by-step code examples and API endpoint construction
- **Platform-Specific Code Generation**: Ready-to-use code for Shopify, Magento, BigCommerce, etc.
- **Code Validation & Troubleshooting**: Analyze existing implementations and identify issues
- **Best Practices**: Security, performance, and reliability recommendations
- **Documentation Links**: Direct links to relevant Searchspring documentation

### Supported API Integrations:
- **Search API**: Implementation guides for product search with filtering and pagination
- **Autocomplete API**: Real-time search suggestions implementation patterns
- **Suggest API**: Spell correction and alternative query suggestions
- **IntelliSuggest Tracking**: Behavioral event tracking implementation (product views, cart, purchases)
- **Recommendations API**: Personalized product recommendation integration
- **Trending API**: Popular search terms and trending content
- **Beacon API**: Analytics event tracking for recommendations
- **Bulk Indexing API**: Product data indexing guidance (requires secret key)
- **Finder API**: Advanced product discovery interfaces

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Configure your Searchspring credentials as environment variables:

```env
# Required: Your Searchspring site ID  
SEARCHSPRING_SITE_ID=your_site_id_here

# Optional: Your Searchspring secret key (required only for bulk indexing)
SEARCHSPRING_SECRET_KEY=your_secret_key_here

# Optional: Request timeout in milliseconds (defaults to 10000)
SEARCHSPRING_TIMEOUT=10000
```

## Usage

### Running the Server

Start the MCP server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Available Tools

#### 1. Search API Implementation (`searchspring_search`)

Get implementation guidance for product search integration:

```json
{
  "query": "running shoes",
  "page": 1,
  "resultsPerPage": 20,
  "filters": {
    "brand": ["Nike", "Adidas"],
    "color": "blue"
  },
  "sort": {
    "price": "asc",
    "popularity": "desc"
  }
}
```

**Returns**: Complete API endpoint URL, required parameters, JavaScript implementation example, and documentation links.

#### 2. Autocomplete Implementation (`searchspring_autocomplete`)

Get implementation guidance for real-time search suggestions:

```json
{
  "query": "runn",
  "resultsPerPage": 10
}
```

**Returns**: Complete autocomplete implementation with debouncing, error handling, and UI integration examples.

#### 3. Search Suggestions (`searchspring_suggest`)

Get product discovery suggestions:

```json
{
  "query": "athletic wear",
  "categories": ["shoes", "apparel"],
  "limit": 10
}
```

#### 4. IntelliSuggest Tracking (`searchspring_intellisuggest_track`)

Track behavioral events for IntelliSuggest analytics and personalization:

```json
{
  "type": "product",
  "event": {
    "sku": "ABC123",
    "name": "Running Shoes",
    "price": 99.99,
    "category": "footwear"
  }
}
```

Available event types:
- `product`: Product page view
- `cart`: Cart addition/view
- `sale`: Purchase completion

#### 5. Platform Implementation (`searchspring_platform_implementation`)

Get platform-specific IntelliSuggest tracking code:

```json
{
  "platform": "shopify",
  "eventType": "product",
  "sku": "ABC123",
  "price": 99.99
}
```

Available platforms:
- `shopify`, `bigcommerce-stencil`, `magento2`, `custom`, etc.

#### 6. Search Result Click Guide (`searchspring_search_result_click`)

Get implementation guide for search result click tracking:

```json
{
  "intellisuggestData": "data-from-search-api",
  "intellisuggestSignature": "signature-from-search-api"
}
```

#### 7. Beacon Tracking (`searchspring_beacon_track`)

Track user events for recommendations analytics:

```json
{
  "type": "profile.impression",
  "event": {
    "profile": {
      "tag": "similar-products",
      "placement": "product-page"
    }
  },
  "context": {
    "website": {
      "trackingCode": "abc123"
    },
    "userId": "user-123",
    "sessionId": "session-456"
  }
}
```

Available event types:
- `profile.render`: Profile rendered on page
- `profile.impression`: Profile viewed by user  
- `profile.click`: Profile clicked by user
- `profile.product.render`: Product rendered in profile
- `profile.product.impression`: Product viewed in profile
- `profile.product.click`: Product clicked in profile

#### 8. Recommendations (`searchspring_recommendations`)

Get personalized product recommendations:

```json
{
  "tags": ["similar-products", "trending"],
  "products": ["ABC123"],
  "limits": [5, 10],
  "shopper": "user123"
}
```

Required parameters:
- `tags`: Array of recommendation profile tags/IDs

Optional parameters:
- `products`: Product SKUs being viewed (for cross-sell/similar)
- `limits`: Maximum products per profile
- `shopper`: Logged-in shopper ID for personalization
- `cart`: Product SKUs in current cart
- `lastViewed`: Recently viewed product SKUs
- `bought_together`: Frequently bought together

#### 9. Trending Data (`searchspring_trending`)

Get trending products or search terms:

```json
{
  "type": "products",
  "timeframe": "day",
  "categoryId": "electronics",
  "limit": 20
}
```

#### 10. Finder API (`searchspring_finder`)

Get product facets for building product finder interfaces:

```json
{
  "filters": {
    "color": "blue",
    "brand": ["Nike", "Adidas"]
  },
  "includedFacets": ["color", "size", "brand"]
}
```

#### 12. Code Validation (`searchspring_code_validator`)

**NEW**: Validate and troubleshoot your Searchspring implementation:

```json
{
  "code": "<script>if (typeof ss != 'undefined') { ss.track.product.view({sku: 'ABC123'}); }</script>",
  "codeType": "tracking",
  "platform": "shopify",
  "issue": "Tracking events not appearing in analytics"
}
```

**Returns**:
- ✅ Validation results (what's working correctly)
- ⚠️ Warnings (potential issues)
- 💡 Suggestions (improvements)
- 🔧 Troubleshooting (specific issue diagnosis)

Supported code types:
- `tracking`: IntelliSuggest event tracking validation
- `search`: Search API implementation validation
- `autocomplete`: Autocomplete implementation validation
- `recommendations`: Recommendation integration validation

#### 9. Finder API (`searchspring_finder`)

Advanced product discovery with faceting:

```json
{
  "query": "athletic wear",
  "filters": {
    "brand": ["Nike", "Adidas"],
    "price": "25-100",
    "size": ["M", "L"]
  },
  "facets": ["brand", "price", "size", "color"],
  "sort": "popularity_desc",
  "page": 1,
  "resultsPerPage": 20,
  "includeMetadata": true
}
```

## Integration with MCP Clients

This server can be used with any MCP-compatible client. Here's how to configure it with Claude Desktop:

1. Add to your MCP settings file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "searchspring": {
      "command": "node",
      "args": ["path/to/searchspring-mcp-server/dist/index.js"],
      "env": {
        "SEARCHSPRING_API_KEY": "your_api_key",
        "SEARCHSPRING_SITE_ID": "your_site_id"
      }
    }
  }
}
```

2. Restart Claude Desktop

## API Documentation

For detailed information about Searchspring APIs, visit:
- [Searchspring Documentation](https://docs.searchspring.com)
- [API Reference](https://docs.searchspring.com/api)

## Development

### Project Structure

```
src/
├── index.ts              # Main MCP server setup
├── searchspring-client.ts # Searchspring API client
└── config.ts             # Configuration management
```

### Adding New Tools

To add a new tool:

1. Add the tool definition to the `tools` array in `index.ts`
2. Add the corresponding method to `SearchspringClient`
3. Add the case handler in the tool call switch statement

### Error Handling

The server includes comprehensive error handling:
- Configuration validation on startup
- API request/response error handling
- Proper error messages returned to MCP clients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT
