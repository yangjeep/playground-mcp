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

### 🎯 Implementation Guidance Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `searchspring_api_guide` | Complete API guidance | API name | Full implementation guide with endpoints, examples, best practices |
| `searchspring_parameter_guide` | Parameter details | API name + parameter | Detailed parameter explanation with usage examples |

**Supported APIs**: `search`, `autocomplete`, `suggest`, `trending`, `recommendations`, `finder`, `beacon`, `bulk-index`

### 🔧 Code Generation & Validation Tools
| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `searchspring_code_generator` | Platform-specific code | API + platform (+ eventType for tracking) | Ready-to-use implementation code |
| `searchspring_code_validator` | Code analysis | Code + codeType (+ platform + issue) | ✅ Validation, ⚠️ warnings, 💡 suggestions, 🔧 troubleshooting |

**Supported Platforms**: `shopify`, `bigcommerce`, `magento2`, `javascript`, `php`, `python`, `custom`
**Supported Code Types**: `search`, `autocomplete`, `suggest`, `trending`, `recommendations`, `finder`, `beacon`, `bulk-index`, `tracking`

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
- **API guide tool** provides complete implementation guidance for any Searchspring API
- **Parameter guide tool** explains specific API parameters with examples and best practices
- **Code generator tool** creates platform-specific implementation code
- **Code validator tool** analyzes implementations for issues and improvements
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
1. Use `searchspring_api_guide` to understand API structure and requirements
2. Use `searchspring_parameter_guide` for detailed parameter understanding
3. Use `searchspring_code_generator` for platform-specific implementation
4. Use `searchspring_code_validator` to ensure correctness

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