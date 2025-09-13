#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { SearchspringClient } from "./searchspring-client.js";
import { validateConfig } from "./config.js";

const server = new Server(
  {
    name: "searchspring-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Global Searchspring client instance
let searchspringClient: SearchspringClient;

// Initialize the Searchspring client
async function initializeClient() {
  const config = validateConfig();
  searchspringClient = new SearchspringClient(config);
}

// Tool definitions for Searchspring APIs
const tools: Tool[] = [
  {
    name: "searchspring_search",
    description: "Search products using Searchspring Search API with filters, sorting, and pagination",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query string",
        },
        page: {
          type: "number",
          description: "Page number for pagination (starting from 1)",
          default: 1,
        },
        resultsPerPage: {
          type: "number",
          description: "Number of results per page",
          default: 24,
        },
        filters: {
          type: "object",
          description: "Search filters as key-value pairs (filter.field=value format)",
          additionalProperties: true,
        },
        bgfilters: {
          type: "object",
          description: "Background filters for initial result filtering",
          additionalProperties: true,
        },
        sort: {
          type: "object",
          description: "Sort criteria as field-direction pairs (e.g., {price: 'asc', popularity: 'desc'})",
          additionalProperties: {
            type: "string",
            enum: ["asc", "desc"]
          },
        },
        userId: {
          type: "string",
          description: "User ID for tracking (auto-generated if not provided)",
        },
        sessionId: {
          type: "string",
          description: "Session ID for tracking (auto-generated if not provided)",
        },
        pageLoadId: {
          type: "string",
          description: "Page load ID for tracking (auto-generated if not provided)",
        },
        domain: {
          type: "string",
          description: "Current page domain (defaults to example.com)",
        },
        redirectResponse: {
          type: "string",
          enum: ["direct", "minimal", "full"],
          description: "How to handle redirects in response",
        },
        landingPage: {
          type: "string",
          description: "Landing page campaign identifier",
        },
        tag: {
          type: "string",
          description: "Segmented merchandising campaign tag",
        },
        includedFacets: {
          type: "array",
          items: { type: "string" },
          description: "Specific facets to include in response",
        },
        excludedFacets: {
          type: "array",
          items: { type: "string" },
          description: "Facets to exclude from response",
        },
        disableInlineBanners: {
          type: "boolean",
          description: "Disable inline banners in response",
        },
        lastViewed: {
          type: "array",
          items: { type: "string" },
          description: "Recently viewed product SKUs for personalization",
        },
        cart: {
          type: "array",
          items: { type: "string" },
          description: "Product SKUs in current cart for personalization",
        },
        shopper: {
          type: "string",
          description: "Logged-in shopper ID for personalization",
        },
      },
    },
  },
  {
    name: "searchspring_autocomplete",
    description: "Get autocomplete results using Searchspring Autocomplete API",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Partial search query to get autocomplete for",
        },
        resultsPerPage: {
          type: "number",
          description: "Number of results per page",
          default: 24,
        },
        page: {
          type: "number",
          description: "Page number for pagination",
          default: 1,
        },
        filters: {
          type: "object",
          description: "Search filters as key-value pairs",
          additionalProperties: true,
        },
        bgfilters: {
          type: "object",
          description: "Background filters for initial result filtering",
          additionalProperties: true,
        },
        sort: {
          type: "object",
          description: "Sort criteria as field-direction pairs",
          additionalProperties: {
            type: "string",
            enum: ["asc", "desc"]
          },
        },
        userId: {
          type: "string",
          description: "User ID for tracking (auto-generated if not provided)",
        },
        sessionId: {
          type: "string",
          description: "Session ID for tracking (auto-generated if not provided)",
        },
        pageLoadId: {
          type: "string",
          description: "Page load ID for tracking (auto-generated if not provided)",
        },
        domain: {
          type: "string",
          description: "Current page domain (defaults to example.com)",
        },
        redirectResponse: {
          type: "string",
          enum: ["direct", "minimal", "full"],
          description: "How to handle redirects in response",
        },
        lastViewed: {
          type: "array",
          items: { type: "string" },
          description: "Recently viewed product SKUs for personalization",
        },
        cart: {
          type: "array",
          items: { type: "string" },
          description: "Product SKUs in current cart for personalization",
        },
        shopper: {
          type: "string",
          description: "Logged-in shopper ID for personalization",
        },
      },
    },
  },
  {
    name: "searchspring_suggest",
    description: "Get search suggestions using Searchspring Suggest API",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Query string for suggestions",
        },
        language: {
          type: "string",
          description: "Language model for spell corrections",
          default: "en",
        },
        suggestionCount: {
          type: "number",
          description: "Maximum number of suggestions to return",
          default: 4,
        },
        productCount: {
          type: "number",
          description: "Number of products to scan for matches",
          default: 20,
        },
      },
    },
  },
  {
    name: "searchspring_trending",
    description: "Get trending search terms from Searchspring",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of trending terms to return",
          default: 6,
          maximum: 25,
        },
      },
    },
  },
  {
    name: "searchspring_finder",
    description: "Get facets and filters using Searchspring Finder API (for building product finder interfaces)",
    inputSchema: {
      type: "object",
      properties: {
        filters: {
          type: "object",
          description: "Current applied filters",
          additionalProperties: true,
        },
        bgfilters: {
          type: "object",
          description: "Background filters",
          additionalProperties: true,
        },
        includedFacets: {
          type: "array",
          items: { type: "string" },
          description: "Specific facets to include in response",
        },
        excludedFacets: {
          type: "array",
          items: { type: "string" },
          description: "Facets to exclude from response",
        },
      },
    },
  },
  {
    name: "searchspring_recommendations",
    description: "Get personalized product recommendations",
    inputSchema: {
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Profile tags/IDs for recommendation types (required)",
        },
        products: {
          type: "array",
          items: { type: "string" },
          description: "Product SKUs being viewed (for cross-sell/similar recommendations)",
        },
        blockedItems: {
          type: "array",
          items: { type: "string" },
          description: "Product SKUs to block from recommendations",
        },
        categories: {
          type: "array",
          items: { type: "string" },
          description: "Category IDs for category trending recommendations",
        },
        brands: {
          type: "array",
          items: { type: "string" },
          description: "Brand names for brand trending recommendations",
        },
        shopper: {
          type: "string",
          description: "Logged-in shopper ID for personalization",
        },
        cart: {
          type: "array",
          items: { type: "string" },
          description: "Product SKUs in current cart",
        },
        lastViewed: {
          type: "array",
          items: { type: "string" },
          description: "Recently viewed product SKUs",
        },
        limits: {
          type: "array",
          items: { type: "number" },
          description: "Maximum products per profile (in order of tags)",
        },
        filters: {
          type: "object",
          description: "Filters to apply to recommendations",
          additionalProperties: true,
        },
      },
      required: ["tags"],
    },
  },
  {
    name: "searchspring_beacon_track",
    description: "Track user events using Searchspring Beacon API for recommendations analytics",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["profile.render", "profile.impression", "profile.click", 
                 "profile.product.render", "profile.product.impression", "profile.product.click"],
          description: "Type of beacon event to track",
        },
        category: {
          type: "string",
          description: "Event category (should be 'searchspring.recommendations.user-interactions')",
          default: "searchspring.recommendations.user-interactions",
        },
        id: {
          type: "string",
          description: "Unique event ID (auto-generated if not provided)",
        },
        pid: {
          type: "string",
          description: "Parent event ID if this is a child event",
        },
        event: {
          type: "object",
          description: "Event details object",
          properties: {
            profile: {
              type: "object",
              description: "Profile data for profile.* events",
              properties: {
                tag: { type: "string", description: "Profile tag identifier" },
                placement: { 
                  type: "string", 
                  enum: ["product-page", "home-page", "no-results-page", "confirmation-page", 
                         "basket-page", "404-page", "user-account-page", "other"],
                  description: "Profile placement" 
                },
                seed: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { sku: { type: "string" } }
                  },
                  description: "Seed products for recommendations"
                }
              }
            },
            product: {
              type: "object", 
              description: "Product data for profile.product.* events",
              properties: {
                id: { type: "string", description: "Product SKU/ID" },
                mappings: {
                  type: "object",
                  description: "Product core field mappings"
                },
                seed: {
                  type: "array",
                  items: {
                    type: "object", 
                    properties: { sku: { type: "string" } }
                  }
                }
              }
            },
            context: {
              type: "object",
              description: "Event context",
              properties: {
                type: { type: "string", default: "product-recommendation" },
                tag: { type: "string" },
                placement: { type: "string" }
              }
            }
          }
        },
        context: {
          type: "object",
          description: "User context for tracking",
          properties: {
            website: {
              type: "object",
              properties: {
                trackingCode: { type: "string", description: "Site ID" }
              },
              required: ["trackingCode"]
            },
            userId: { type: "string", description: "User ID" },
            sessionId: { type: "string", description: "Session ID" },
            pageLoadId: { type: "string", description: "Page load ID" }
          },
          required: ["website", "userId", "sessionId"]
        }
      },
      required: ["type", "category", "event", "context"],
    },
  },
  {
    name: "searchspring_bulk_index",
    description: "Trigger bulk indexing of product data (requires SEARCHSPRING_SECRET_KEY)",
    inputSchema: {
      type: "object",
      properties: {
        feedId: {
          type: "number",
          description: "Feed ID to index",
        },
        requestedBy: {
          type: "string",
          description: "Email address for completion notification",
        },
      },
      required: ["feedId"],
    },
  },
  {
    name: "searchspring_bulk_index_status",
    description: "Get status of bulk indexing operations (requires SEARCHSPRING_SECRET_KEY)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "searchspring_intellisuggest_track",
    description: "Track IntelliSuggest behavioral events (product views, cart additions, purchases)",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["product", "cart", "sale"],
          description: "Type of IntelliSuggest event to track",
        },
        event: {
          type: "object",
          description: "Event data object",
          properties: {
            sku: {
              type: "string",
              description: "Product SKU (must match Searchspring indexed SKU core field)",
            },
            price: {
              type: "number",
              description: "Product price",
            },
            quantity: {
              type: "number",
              description: "Product quantity (for cart/sale events)",
            },
            category: {
              type: "string",
              description: "Product category",
            },
            name: {
              type: "string",
              description: "Product name",
            },
          },
          required: ["sku"],
          additionalProperties: true,
        },
        context: {
          type: "object",
          description: "Tracking context (auto-generated if not provided)",
          properties: {
            website: {
              type: "object",
              properties: {
                trackingCode: {
                  type: "string",
                  description: "Site ID for tracking (defaults to configured siteId)",
                },
              },
            },
            userId: {
              type: "string",
              description: "User ID for tracking (auto-generated if not provided)",
            },
            sessionId: {
              type: "string",
              description: "Session ID for tracking (auto-generated if not provided)",
            },
            pageLoadId: {
              type: "string",
              description: "Page load ID for tracking (auto-generated if not provided)",
            },
          },
        },
      },
      required: ["type", "event"],
    },
  },
  {
    name: "searchspring_search_result_click",
    description: "Get implementation guide for tracking search result clicks (requires IntelliSuggest JavaScript SDK)",
    inputSchema: {
      type: "object",
      properties: {
        intellisuggestData: {
          type: "string",
          description: "IntelliSuggest data from search result (from Search API response)",
        },
        intellisuggestSignature: {
          type: "string", 
          description: "IntelliSuggest signature from search result (from Search API response)",
        },
        note: {
          type: "string",
          description: "Optional note about implementation context",
        },
      },
      required: ["intellisuggestData", "intellisuggestSignature"],
    },
  },
  {
    name: "searchspring_platform_implementation",
    description: "Get platform-specific implementation code for IntelliSuggest tracking",
    inputSchema: {
      type: "object",
      properties: {
        platform: {
          type: "string",
          enum: ["shopify", "bigcommerce-blueprint", "bigcommerce-stencil", "magento1", "magento2", "miva", "commercev3", "3dcart", "volusion", "custom"],
          description: "E-commerce platform for implementation",
        },
        eventType: {
          type: "string",
          enum: ["product", "cart", "sale", "search-click"],
          description: "Type of tracking event to implement",
        },
        sku: {
          type: "string",
          description: "Example SKU for code generation (optional)",
        },
        price: {
          type: "number",
          description: "Example price for code generation (optional)",
        },
        quantity: {
          type: "number",
          description: "Example quantity for code generation (optional)",
        },
      },
      required: ["platform", "eventType"],
    },
  },
  {
    name: "searchspring_code_validator",
    description: "Validate and troubleshoot Searchspring implementation code",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "JavaScript/HTML code to validate",
        },
        codeType: {
          type: "string",
          enum: ["tracking", "search", "autocomplete", "recommendations"],
          description: "Type of Searchspring implementation being validated",
        },
        platform: {
          type: "string",
          enum: ["shopify", "bigcommerce", "magento2", "custom", "other"],
          description: "E-commerce platform (optional)",
        },
        issue: {
          type: "string",
          description: "Specific issue or error message you're experiencing (optional)",
        },
      },
      required: ["code", "codeType"],
    },
  },
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "searchspring_search":
        return await searchspringClient.search(args as any);

      case "searchspring_autocomplete":
        return await searchspringClient.autocomplete(args as any);

      case "searchspring_suggest":
        return await searchspringClient.suggest(args as any);

      case "searchspring_trending":
        return await searchspringClient.trending(args as any);

      case "searchspring_finder":
        return await searchspringClient.finder({
          resultsPerPage: 0, // Always 0 for finder
          ...args as any,
        });

      case "searchspring_recommendations":
        return await searchspringClient.recommendations(args as any);

      case "searchspring_beacon_track":
        // Generate IDs if not provided
        const beaconArgs = {
          category: "searchspring.recommendations.user-interactions",
          id: Math.random().toString(36).substr(2, 9),
          ...args as any,
        };
        return await searchspringClient.trackEvent(beaconArgs);

      case "searchspring_bulk_index":
        return await searchspringClient.bulkIndex(args as any);

      case "searchspring_bulk_index_status":
        return await searchspringClient.getBulkIndexStatus();

      case "searchspring_intellisuggest_track":
        return await searchspringClient.trackIntelliSuggestEvent(args as any);

      case "searchspring_search_result_click":
        return await searchspringClient.trackSearchResultClick(args as any);

      case "searchspring_platform_implementation":
        return await searchspringClient.getPlatformImplementation(args as any);

      case "searchspring_code_validator":
        return await searchspringClient.validateCode(args as any);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  try {
    await initializeClient();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Searchspring MCP server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();