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
          default: 20,
        },
        filters: {
          type: "object",
          description: "Search filters as key-value pairs",
          additionalProperties: true,
        },
        sort: {
          type: "string",
          description: "Sort criteria (e.g., 'price_asc', 'price_desc', 'relevance')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "searchspring_autocomplete",
    description: "Get autocomplete suggestions for search queries",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Partial search query to get autocomplete suggestions for",
        },
        limit: {
          type: "number",
          description: "Maximum number of suggestions to return",
          default: 10,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "searchspring_suggest",
    description: "Get search suggestions for product discovery",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Query string for suggestions",
        },
        categories: {
          type: "array",
          items: { type: "string" },
          description: "Product categories to filter suggestions",
        },
        limit: {
          type: "number",
          description: "Maximum number of suggestions to return",
          default: 10,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "searchspring_intellisuggest",
    description: "Get intelligent product suggestions using Searchspring IntelliSuggest",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for intelligent suggestions",
        },
        userId: {
          type: "string",
          description: "User ID for personalized suggestions",
        },
        sessionId: {
          type: "string",
          description: "Session ID for tracking user behavior",
        },
        limit: {
          type: "number",
          description: "Maximum number of suggestions to return",
          default: 5,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "searchspring_recommendations",
    description: "Get product recommendations based on various strategies",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["trending", "popular", "related", "viewed", "bought_together"],
          description: "Type of recommendations to retrieve",
        },
        productId: {
          type: "string",
          description: "Product ID for related/similar product recommendations",
        },
        userId: {
          type: "string",
          description: "User ID for personalized recommendations",
        },
        categoryId: {
          type: "string",
          description: "Category ID to filter recommendations",
        },
        limit: {
          type: "number",
          description: "Maximum number of recommendations to return",
          default: 10,
        },
      },
      required: ["type"],
    },
  },
  {
    name: "searchspring_trending",
    description: "Get trending products and search terms",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["products", "searches"],
          description: "Type of trending data to retrieve",
          default: "products",
        },
        timeframe: {
          type: "string",
          enum: ["hour", "day", "week", "month"],
          description: "Timeframe for trending data",
          default: "day",
        },
        categoryId: {
          type: "string",
          description: "Category ID to filter trending items",
        },
        limit: {
          type: "number",
          description: "Maximum number of trending items to return",
          default: 20,
        },
      },
    },
  },
  {
    name: "searchspring_beacon_track",
    description: "Track user events using Searchspring Beacon API for analytics",
    inputSchema: {
      type: "object",
      properties: {
        event: {
          type: "string",
          enum: ["view", "click", "purchase", "add_to_cart", "search"],
          description: "Type of event to track",
        },
        userId: {
          type: "string",
          description: "User ID for tracking",
        },
        sessionId: {
          type: "string",
          description: "Session ID for tracking",
        },
        productId: {
          type: "string",
          description: "Product ID (for product-related events)",
        },
        query: {
          type: "string",
          description: "Search query (for search events)",
        },
        metadata: {
          type: "object",
          description: "Additional event metadata",
          additionalProperties: true,
        },
      },
      required: ["event"],
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

      case "searchspring_intellisuggest":
        return await searchspringClient.intelliSuggest(args as any);

      case "searchspring_recommendations":
        return await searchspringClient.recommendations(args as any);

      case "searchspring_trending":
        return await searchspringClient.trending(args as any);

      case "searchspring_beacon_track":
        return await searchspringClient.trackEvent(args as any);

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