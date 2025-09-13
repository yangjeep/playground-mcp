import axios, { AxiosInstance } from "axios";
import { SearchspringConfig } from "./config.js";

export interface SearchParams {
  query: string;
  page?: number;
  resultsPerPage?: number;
  filters?: Record<string, any>;
  sort?: string;
}

export interface AutocompleteParams {
  query: string;
  limit?: number;
}

export interface SuggestParams {
  query: string;
  categories?: string[];
  limit?: number;
}

export interface IntelliSuggestTrackParams {
  interaction: "search" | "click" | "view" | "select";
  userId?: string;
  sessionId?: string;
  query?: string;
  productId?: string;
  position?: number;
  metadata?: Record<string, any>;
}

export interface BulkIndexParams {
  products: Record<string, any>[];
  operation?: "add" | "update" | "delete" | "replace";
  batchSize?: number;
  validateOnly?: boolean;
}

export interface FinderParams {
  query?: string;
  filters?: Record<string, any>;
  facets?: string[];
  sort?: string;
  page?: number;
  resultsPerPage?: number;
  includeMetadata?: boolean;
}

export interface RecommendationParams {
  type: "trending" | "popular" | "related" | "viewed" | "bought_together";
  productId?: string;
  userId?: string;
  categoryId?: string;
  limit?: number;
}

export interface TrendingParams {
  type?: "products" | "searches";
  timeframe?: "hour" | "day" | "week" | "month";
  categoryId?: string;
  limit?: number;
}

export interface BeaconEventParams {
  event: "view" | "click" | "purchase" | "add_to_cart" | "search";
  userId?: string;
  sessionId?: string;
  productId?: string;
  query?: string;
  metadata?: Record<string, any>;
}

export class SearchspringClient {
  private apiClient: AxiosInstance;
  private config: SearchspringConfig;

  constructor(config: SearchspringConfig) {
    this.config = config;
    this.apiClient = axios.create({
      baseURL: config.baseUrl || "https://api.searchspring.net",
      timeout: config.timeout || 10000,
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Searchspring-MCP-Server/1.0.0",
      },
    });
  }

  async search(params: SearchParams) {
    try {
      const searchParams = new URLSearchParams({
        q: params.query,
        page: (params.page || 1).toString(),
        resultsPerPage: (params.resultsPerPage || 20).toString(),
        siteId: this.config.siteId,
      });

      if (params.sort) {
        searchParams.append("sort", params.sort);
      }

      // Add filters
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(`filter.${key}`, v));
          } else {
            searchParams.append(`filter.${key}`, value);
          }
        });
      }

      const response = await this.apiClient.get(`/api/search/search.json?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Search Results for "${params.query}":\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Search API error: ${this.getErrorMessage(error)}`);
    }
  }

  async autocomplete(params: AutocompleteParams) {
    try {
      const searchParams = new URLSearchParams({
        q: params.query,
        limit: (params.limit || 10).toString(),
        siteId: this.config.siteId,
      });

      const response = await this.apiClient.get(`/api/suggest/query?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Autocomplete suggestions for "${params.query}":\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Autocomplete API error: ${this.getErrorMessage(error)}`);
    }
  }

  async suggest(params: SuggestParams) {
    try {
      const searchParams = new URLSearchParams({
        q: params.query,
        limit: (params.limit || 10).toString(),
        siteId: this.config.siteId,
      });

      if (params.categories) {
        params.categories.forEach(category => {
          searchParams.append("categories[]", category);
        });
      }

      const response = await this.apiClient.get(`/api/suggest/suggest?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Suggestions for "${params.query}":\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Suggest API error: ${this.getErrorMessage(error)}`);
    }
  }

  async trackIntelliSuggest(params: IntelliSuggestTrackParams) {
    try {
      const eventData = {
        interaction: params.interaction,
        siteId: this.config.siteId,
        timestamp: new Date().toISOString(),
        ...(params.userId && { userId: params.userId }),
        ...(params.sessionId && { sessionId: params.sessionId }),
        ...(params.query && { query: params.query }),
        ...(params.productId && { productId: params.productId }),
        ...(params.position && { position: params.position }),
        ...(params.metadata && { metadata: params.metadata }),
      };

      const response = await this.apiClient.post("/api/intellisuggest/track", eventData);
      
      return {
        content: [
          {
            type: "text",
            text: `IntelliSuggest interaction tracked: ${params.interaction}\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`IntelliSuggest tracking error: ${this.getErrorMessage(error)}`);
    }
  }

  async recommendations(params: RecommendationParams) {
    try {
      const requestBody = {
        type: params.type,
        siteId: this.config.siteId,
        limit: params.limit || 10,
        ...(params.productId && { productId: params.productId }),
        ...(params.userId && { userId: params.userId }),
        ...(params.categoryId && { categoryId: params.categoryId }),
      };

      const response = await this.apiClient.post("/api/recommend/products", requestBody);
      
      return {
        content: [
          {
            type: "text",
            text: `${params.type} recommendations:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Recommendations API error: ${this.getErrorMessage(error)}`);
    }
  }

  async trending(params: TrendingParams) {
    try {
      const searchParams = new URLSearchParams({
        type: params.type || "products",
        timeframe: params.timeframe || "day",
        limit: (params.limit || 20).toString(),
        siteId: this.config.siteId,
      });

      if (params.categoryId) {
        searchParams.append("categoryId", params.categoryId);
      }

      const response = await this.apiClient.get(`/api/trending?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Trending ${params.type || "products"} (${params.timeframe || "day"}):\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Trending API error: ${this.getErrorMessage(error)}`);
    }
  }

  async trackEvent(params: BeaconEventParams) {
    try {
      const eventData = {
        event: params.event,
        siteId: this.config.siteId,
        timestamp: new Date().toISOString(),
        ...(params.userId && { userId: params.userId }),
        ...(params.sessionId && { sessionId: params.sessionId }),
        ...(params.productId && { productId: params.productId }),
        ...(params.query && { query: params.query }),
        ...(params.metadata && { metadata: params.metadata }),
      };

      const response = await this.apiClient.post("/api/event/track", eventData);
      
      return {
        content: [
          {
            type: "text",
            text: `Event tracked successfully: ${params.event}\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Beacon API error: ${this.getErrorMessage(error)}`);
    }
  }

  async bulkIndex(params: BulkIndexParams) {
    try {
      const requestData = {
        products: params.products,
        operation: params.operation || "add",
        siteId: this.config.siteId,
        batchSize: params.batchSize || 100,
        validateOnly: params.validateOnly || false,
        timestamp: new Date().toISOString(),
      };

      const response = await this.apiClient.post("/api/feed/bulk", requestData);
      
      return {
        content: [
          {
            type: "text",
            text: `Bulk indexing ${params.operation || "add"} operation completed for ${params.products.length} products:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Bulk indexing error: ${this.getErrorMessage(error)}`);
    }
  }

  async finder(params: FinderParams) {
    try {
      const searchParams = new URLSearchParams({
        siteId: this.config.siteId,
        page: (params.page || 1).toString(),
        resultsPerPage: (params.resultsPerPage || 20).toString(),
      });

      if (params.query) {
        searchParams.append("q", params.query);
      }

      if (params.sort) {
        searchParams.append("sort", params.sort);
      }

      if (params.includeMetadata !== false) {
        searchParams.append("includeMetadata", "true");
      }

      // Add filters
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(`filter.${key}`, v));
          } else {
            searchParams.append(`filter.${key}`, value);
          }
        });
      }

      // Add facets
      if (params.facets) {
        params.facets.forEach(facet => {
          searchParams.append("facet", facet);
        });
      }

      const response = await this.apiClient.get(`/api/finder/search?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Finder API results${params.query ? ` for "${params.query}"` : ""}:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Finder API error: ${this.getErrorMessage(error)}`);
    }
  }

  private getErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        return "Network error: No response received";
      }
    }
    return error.message || "Unknown error";
  }
}