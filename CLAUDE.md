# CLAUDE.md

Project guidance for Claude Code when working with the Searchspring Integration Assistant MCP Server.

## Project Overview

**CRITICAL**: This is a Searchspring Integration Assistant - NOT an API proxy.

### What This MCP Does:
✅ **Implementation Guidance** - Returns step-by-step integration instructions
✅ **Code Validation** - Analyzes existing code for issues and improvements
✅ **Platform-Specific Code** - Generates ready-to-use tracking code for Shopify, Magento, etc.
✅ **Troubleshooting** - Diagnoses common integration problems
✅ **Documentation Links** - Provides relevant Searchspring documentation

### What This MCP Does NOT Do:
❌ **Make API Calls** - Does not contact Searchspring APIs directly
❌ **Return Live Data** - Does not provide real search results or product data
❌ **Act as Proxy** - Does not forward requests to Searchspring services

## Essential Commands

### Build and Development
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Development server with auto-reload
- `npm start` - Start the built MCP server
- `npm test` - Run validation tests

### Environment Setup
**Required**: `SEARCHSPRING_SITE_ID` - Your Searchspring site identifier
**Optional**: `SEARCHSPRING_SECRET_KEY` - Only needed for bulk indexing tools
**Optional**: `SEARCHSPRING_TIMEOUT` - Request timeout in milliseconds

## Available MCP Tools

### Implementation Guidance Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `searchspring_search` | Search API guidance | Query + filters + sort | Complete API URL + JS implementation |
| `searchspring_autocomplete` | Autocomplete guidance | Partial query | Debounced implementation + UI patterns |
| `searchspring_suggest` | Spell correction guidance | Query + language | Correction API + "Did you mean?" UI |
| `searchspring_trending` | Trending terms guidance | Limit | Trending API + homepage integration |
| `searchspring_recommendations` | Recommendation guidance | Tags + context | Recommendation API + examples |
| `searchspring_finder` | Faceted search guidance | Filters + facets | Finder API + dynamic filtering |

### Code Generation Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `searchspring_platform_implementation` | Platform-specific code | Platform + event type + data | Ready-to-use tracking code |
| `searchspring_search_result_click` | Click tracking guidance | IntelliSuggest data | JavaScript SDK instructions |

**Supported Platforms**: Shopify, BigCommerce, Magento 1/2, Miva, Commerce v3, 3DCart, Volusion, Custom

### Validation & Troubleshooting Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `searchspring_code_validator` | Code analysis | Code + type + platform + issue | ✅ Validation, ⚠️ warnings, 💡 suggestions, 🔧 troubleshooting |
| `searchspring_intellisuggest_track` | Tracking guidance | Event type + product data | Implementation guidance + context |
| `searchspring_beacon_track` | Analytics guidance | Event + context | Beacon implementation guidance |

### Data Management Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `searchspring_bulk_index` | Indexing guidance | Feed ID + options | Bulk API implementation guidance |
| `searchspring_bulk_index_status` | Status check guidance | None | Status API implementation |

## Architecture

### Core Components

**Main Server (`src/index.ts`)**
- MCP server setup and tool definitions
- Request routing to client methods
- Error handling and response formatting

**Integration Assistant (`src/searchspring-client.ts`)**
- SearchspringClient class with guidance methods
- Parameter validation and URL construction
- Code validation and troubleshooting logic
- Platform-specific implementation templates

**Configuration (`src/config.ts`)**
- Environment variable validation
- Default values and optional parameters

## Key Implementation Notes

### Tool Behavior
- **All tools return implementation guidance**, not live API data
- **Search tools** provide complete API URLs with parameters
- **Platform tools** generate ready-to-use tracking code
- **Validation tools** analyze code for issues and improvements
- **All tools** include documentation links and best practices

### Code Validation Features
- **Script inclusion checks** - Ensures IntelliSuggest script is present
- **Safety validation** - Checks for proper `typeof ss` guards
- **Required field validation** - Ensures SKU, quantity, etc. are included
- **Platform-specific warnings** - Shopify Liquid, Magento PHP syntax checks
- **Issue-specific troubleshooting** - Targeted help for common problems

### Response Format
All tools return:
```typescript
{
  content: [{
    type: "text",
    text: "Implementation guidance with:\n- API endpoints\n- Code examples\n- Best practices\n- Documentation links"
  }]
}
```

## Usage Patterns

### For Customer Onboarding
1. Use search/autocomplete tools to understand API structure
2. Use platform implementation tools for tracking code
3. Use code validator to ensure correctness
4. Use troubleshooting for issue resolution

### For Code Review
1. Use code validator with existing implementation
2. Review warnings and suggestions
3. Compare with platform-specific tool output
4. Follow documentation links for details

### For Troubleshooting
1. Use code validator with specific issue parameter
2. Get targeted troubleshooting guidance
3. Validate fixes with code validator
4. Test with generated API URLs

## Testing

**Unit Tests**: `npm test` runs validation tests
**MCP Integration**: Configure with Claude Desktop or other MCP clients for interactive testing

## Important Reminders

1. **This is NOT an API proxy** - Always provide implementation guidance, never make live API calls
2. **Focus on integration assistance** - Help developers implement Searchspring correctly
3. **Provide complete examples** - Include error handling, best practices, and documentation
4. **Platform-specific guidance** - Tailor responses to user's platform when specified
5. **Validation is key** - Always validate implementations and provide improvement suggestions