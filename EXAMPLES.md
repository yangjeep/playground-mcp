# Searchspring MCP Server Examples

This document provides examples of how to use the Searchspring MCP Server tools.

## Configuration

First, make sure you have your Searchspring credentials configured:

```bash
export SEARCHSPRING_API_KEY="your_api_key_here"
export SEARCHSPRING_SITE_ID="your_site_id_here"
```

## Example Tool Calls

### 1. Product Search

Search for running shoes with filters:

```json
{
  "tool": "searchspring_search",
  "parameters": {
    "query": "running shoes",
    "page": 1,
    "resultsPerPage": 12,
    "filters": {
      "brand": ["Nike", "Adidas", "New Balance"],
      "price": "50-150",
      "size": ["8", "9", "10"]
    },
    "sort": "price_asc"
  }
}
```

### 2. Autocomplete Suggestions

Get autocomplete suggestions for "runn":

```json
{
  "tool": "searchspring_autocomplete",
  "parameters": {
    "query": "runn",
    "limit": 8
  }
}
```

### 3. Product Suggestions

Get product suggestions for athletic wear:

```json
{
  "tool": "searchspring_suggest",
  "parameters": {
    "query": "athletic wear",
    "categories": ["apparel", "shoes", "accessories"],
    "limit": 10
  }
}
```

### 4. IntelliSuggest

Get AI-powered suggestions with user context:

```json
{
  "tool": "searchspring_intellisuggest",
  "parameters": {
    "query": "comfortable walking shoes",
    "userId": "user_12345",
    "sessionId": "session_67890",
    "limit": 5
  }
}
```

### 5. Trending Products

Get trending products in the electronics category:

```json
{
  "tool": "searchspring_trending",
  "parameters": {
    "type": "products",
    "timeframe": "week",
    "categoryId": "electronics",
    "limit": 15
  }
}
```

### 6. Product Recommendations

Get related product recommendations:

```json
{
  "tool": "searchspring_recommendations",
  "parameters": {
    "type": "related",
    "productId": "PROD_12345",
    "userId": "user_12345",
    "limit": 8
  }
}
```

Get trending recommendations:

```json
{
  "tool": "searchspring_recommendations",
  "parameters": {
    "type": "trending",
    "categoryId": "shoes",
    "limit": 10
  }
}
```

### 7. Event Tracking

Track a product view event:

```json
{
  "tool": "searchspring_beacon_track",
  "parameters": {
    "event": "view",
    "userId": "user_12345",
    "sessionId": "session_67890",
    "productId": "PROD_12345",
    "metadata": {
      "page": "product-detail",
      "referrer": "search-results",
      "position": 3
    }
  }
}
```

Track a search event:

```json
{
  "tool": "searchspring_beacon_track",
  "parameters": {
    "event": "search",
    "userId": "user_12345",
    "sessionId": "session_67890",
    "query": "running shoes",
    "metadata": {
      "results_count": 45,
      "page": "search-results"
    }
  }
}
```

Track a purchase event:

```json
{
  "tool": "searchspring_beacon_track",
  "parameters": {
    "event": "purchase",
    "userId": "user_12345",
    "sessionId": "session_67890",
    "productId": "PROD_12345",
    "metadata": {
      "price": 89.99,
      "quantity": 1,
      "order_id": "ORDER_789"
    }
  }
}
```

## Common Use Cases

### E-commerce Site Search Implementation

1. **Search Bar with Autocomplete**:
   - Use `searchspring_autocomplete` for real-time suggestions
   - Use `searchspring_search` for full search results

2. **Product Discovery**:
   - Use `searchspring_suggest` for category-based suggestions
   - Use `searchspring_trending` to show popular items

3. **Personalized Recommendations**:
   - Use `searchspring_intellisuggest` for intelligent suggestions
   - Use `searchspring_recommendations` with user context

4. **Analytics and Optimization**:
   - Use `searchspring_beacon_track` to track all user interactions
   - Monitor search patterns and product engagement

### Customer Onboarding Flow

For new Searchspring customers, this MCP server helps with:

1. **API Testing**: Quickly test all Searchspring endpoints
2. **Integration Planning**: Understand data structures and responses  
3. **Proof of Concept**: Build rapid prototypes using the tools
4. **Documentation**: Generate integration examples from tool responses