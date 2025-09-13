# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for Searchspring's e-commerce APIs. It provides tools for integrating search, recommendations, autocomplete, tracking, and product indexing capabilities for e-commerce applications.

## Essential Commands

### Build and Development
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm run dev` - Run development server with auto-reload using tsx
- `npm run watch` - Watch mode for development
- `npm start` - Start the built MCP server
- `npm test` - Run the basic validation test suite

### Environment Setup
Required environment variables:
- `SEARCHSPRING_SITE_ID` - Your Searchspring site ID

Optional environment variables:
- `SEARCHSPRING_SECRET_KEY` - Your Searchspring secret key (required only for bulk indexing)
- `SEARCHSPRING_TIMEOUT` - Request timeout in milliseconds (defaults to 10000)

## Architecture

### Core Components

**Main Server (`src/index.ts`)**
- MCP server setup using @modelcontextprotocol/sdk
- Tool definitions for 9 Searchspring APIs
- Request routing and error handling
- Server runs on stdio transport

**API Client (`src/searchspring-client.ts`)**
- SearchspringClient class handles all API interactions
- Multiple Axios instances for different API endpoints:
  - Main search API: `https://{siteId}.a.searchspring.io`
  - Beacon tracking: `https://beacon.searchspring.io`
  - Bulk indexing: `https://index-api.searchspring.net`
- Automatic ID generation for required tracking parameters
- Comprehensive parameter interfaces for type safety

**Configuration (`src/config.ts`)**
- Zod schema validation for environment variables
- Configuration validation with helpful error messages
- Default values and optional parameters

### Available MCP Tools

1. **searchspring_search** - Product search with filtering, sorting, pagination
2. **searchspring_autocomplete** - Real-time search query suggestions
3. **searchspring_suggest** - Search term suggestions and spell correction
4. **searchspring_trending** - Trending search terms
5. **searchspring_finder** - Facet discovery for product finder interfaces
6. **searchspring_recommendations** - Personalized product recommendations
7. **searchspring_beacon_track** - Event tracking for recommendations analytics
8. **searchspring_intellisuggest_track** - IntelliSuggest behavioral event tracking (product view, cart, sale)
9. **searchspring_search_result_click** - Implementation guide for search result click tracking
10. **searchspring_platform_implementation** - Platform-specific IntelliSuggest tracking code generation
11. **searchspring_bulk_index** - Bulk product data indexing (requires secret key)
12. **searchspring_bulk_index_status** - Check bulk indexing status (requires secret key)

### Type Safety
- Strict TypeScript configuration with comprehensive type checking
- Interface definitions for all API parameters
- Zod validation for configuration
- ESNext modules with bundler resolution

### Testing
- Basic validation test in `test/basic-test.js`
- Tests configuration validation and client instantiation
- Requires build step before testing

## Documentation Structure

- **README.md** - Comprehensive usage documentation and API examples
- **EXAMPLES.md** - Detailed tool usage examples and common patterns
- **docs.searchspring.com/** - Extensive Searchspring API documentation