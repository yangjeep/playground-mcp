# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IMPORTANT**: This is a Searchspring Integration Assistant (MCP server) - NOT a direct API proxy.

This MCP server provides **implementation guidance, code validation, and troubleshooting tools** for Searchspring's e-commerce APIs. Instead of making direct API calls, it serves as an intelligent assistant that helps developers properly implement Searchspring integrations.

### What This MCP Does:
- ✅ Provides implementation guidance and code examples
- ✅ Validates existing implementation code
- ✅ Generates platform-specific integration code (Shopify, Magento, etc.)
- ✅ Troubleshoots common integration issues
- ✅ Returns proper API endpoint URLs and parameters

### What This MCP Does NOT Do:
- ❌ Make direct API calls to Searchspring services
- ❌ Return live search results or product data
- ❌ Act as a proxy or gateway to Searchspring APIs

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

**Integration Guidance Tools:**
1. **searchspring_search** - Search API implementation guidance with endpoint URLs and examples
2. **searchspring_autocomplete** - Autocomplete implementation patterns with debouncing and error handling
3. **searchspring_suggest** - Spell correction API implementation guidance
4. **searchspring_trending** - Trending terms API integration examples
5. **searchspring_finder** - Facet discovery implementation for product finder UIs
6. **searchspring_recommendations** - Personalized recommendations integration guidance

**Implementation & Validation Tools:**
7. **searchspring_platform_implementation** - Platform-specific code generation (Shopify, Magento, etc.)
8. **searchspring_code_validator** - 🆕 Code validation and troubleshooting for existing implementations
9. **searchspring_search_result_click** - Click tracking implementation instructions

**Tracking Guidance Tools:**
10. **searchspring_beacon_track** - Event tracking implementation guidance
11. **searchspring_intellisuggest_track** - IntelliSuggest behavioral tracking implementation

**Data Management Guidance:**
12. **searchspring_bulk_index** - Bulk indexing implementation guidance (requires secret key)
13. **searchspring_bulk_index_status** - Indexing status check implementation

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