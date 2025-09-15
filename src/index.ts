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
    name: "searchspring_api_guide",
    description: "Get comprehensive implementation guidance for any Searchspring API",
    inputSchema: {
      type: "object",
      properties: {
        api: {
          type: "string",
          enum: ["search", "autocomplete", "suggest", "trending", "recommendations", "finder", "beacon", "bulk-index"],
          description: "The Searchspring API to get implementation guidance for",
        },
      },
      required: ["api"],
    },
  },
  {
    name: "searchspring_parameter_guide",
    description: "Get detailed explanation for specific API parameters, their usage, and best practices",
    inputSchema: {
      type: "object",
      properties: {
        api: {
          type: "string",
          enum: ["search", "autocomplete", "suggest", "trending", "recommendations", "finder", "beacon", "bulk-index"],
          description: "The Searchspring API containing the parameter",
        },
        parameter: {
          type: "string",
          description: "The specific parameter to get guidance for (e.g., 'filters', 'sort', 'tags')",
        },
      },
      required: ["api", "parameter"],
    },
  },
  {
    name: "searchspring_code_generator",
    description: "Generate implementation code for any Searchspring API with platform-specific examples",
    inputSchema: {
      type: "object",
      properties: {
        api: {
          type: "string",
          enum: ["search", "autocomplete", "suggest", "trending", "recommendations", "finder", "beacon", "bulk-index", "tracking"],
          description: "The Searchspring API to generate code for",
        },
        platform: {
          type: "string",
          enum: ["shopify", "bigcommerce", "magento2", "javascript", "php", "python", "custom"],
          description: "Platform or language for code generation",
        },
        eventType: {
          type: "string",
          enum: ["product", "cart", "sale", "search-click", "impression"],
          description: "Type of tracking event (for tracking/beacon APIs only)",
        },
        useCase: {
          type: "string",
          description: "Specific use case or scenario for the code (optional)",
        },
      },
      required: ["api", "platform"],
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
          enum: ["search", "autocomplete", "suggest", "trending", "recommendations", "finder", "beacon", "bulk-index", "tracking"],
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
      case "searchspring_api_guide":
        return await searchspringClient.getApiGuide(args as any);

      case "searchspring_parameter_guide":
        return await searchspringClient.getParameterGuide(args as any);

      case "searchspring_code_generator":
        return await searchspringClient.generateCode(args as any);

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