# Searchspring MCP Server

MCP server for Searchspring API integration to help with customer onboarding and partner/customer led integrations.

This Model Context Protocol (MCP) server provides tools for integrating with Searchspring's e-commerce search and recommendation APIs, making it easier for customers to implement trending, search, autocomplete, suggest, IntelliSuggest, recommendation, and beacon tracking capabilities.

## Features

The server provides MCP tools for all major Searchspring APIs:

- **Search API**: Full-text product search with filtering, sorting, and pagination
- **Autocomplete API**: Real-time search query suggestions
- **Suggest API**: Product discovery suggestions  
- **IntelliSuggest Tracking**: Event tracking for AI-powered analytics (tracking only)
- **Recommendations API**: Product recommendations (trending, popular, related, etc.)
- **Trending API**: Trending products and search terms
- **Beacon API**: Event tracking for analytics and personalization
- **Bulk Indexing API**: Bulk product data indexing and management
- **Finder API**: Advanced product discovery with faceting and filtering

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

#### 1. Search Products (`searchspring_search`)

Search for products with advanced filtering and sorting:

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

#### 2. Autocomplete (`searchspring_autocomplete`)

Get real-time search suggestions:

```json
{
  "query": "runn",
  "limit": 10
}
```

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

#### 11. Bulk Indexing (`searchspring_bulk_index`)

Bulk index products into Searchspring:

```json
{
  "products": [
    {
      "id": "prod123",
      "title": "Running Shoes",
      "price": 99.99,
      "brand": "Nike",
      "category": "shoes"
    },
    {
      "id": "prod456", 
      "title": "Athletic Shorts",
      "price": 29.99,
      "brand": "Adidas",
      "category": "apparel"
    }
  ],
  "operation": "add",
  "batchSize": 100,
  "validateOnly": false
}
```

Available operations:
- `add`: Add new products
- `update`: Update existing products
- `delete`: Remove products
- `replace`: Replace product data entirely

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
