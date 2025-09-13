import axios, { AxiosInstance } from "axios";
import { SearchspringConfig } from "./config.js";

export interface SearchParams {
  query?: string;
  page?: number;
  resultsPerPage?: number;
  filters?: Record<string, string | string[]>;
  bgfilters?: Record<string, string | string[]>;
  sort?: Record<string, "asc" | "desc">;
  userId?: string;
  sessionId?: string;
  pageLoadId?: string;
  domain?: string;
  redirectResponse?: "direct" | "minimal" | "full";
  landingPage?: string;
  tag?: string;
  includedFacets?: string[];
  excludedFacets?: string[];
  disableInlineBanners?: boolean;
  lastViewed?: string[];
  cart?: string[];
  shopper?: string;
}

export interface AutocompleteParams {
  query?: string;
  resultsPerPage?: number;
  page?: number;
  filters?: Record<string, string | string[]>;
  bgfilters?: Record<string, string | string[]>;
  sort?: Record<string, "asc" | "desc">;
  userId?: string;
  sessionId?: string;
  pageLoadId?: string;
  domain?: string;
  redirectResponse?: "direct" | "minimal" | "full";
  landingPage?: string;
  tag?: string;
  includedFacets?: string[];
  excludedFacets?: string[];
  disableInlineBanners?: boolean;
  lastViewed?: string[];
  cart?: string[];
  shopper?: string;
}

export interface SuggestParams {
  query?: string;
  language?: string;
  suggestionCount?: number;
  productCount?: number;
}

export interface TrendingParams {
  limit?: number;
}

export interface FinderParams {
  resultsPerPage: number; // Must be 0 for finder
  filters?: Record<string, string | string[]>;
  bgfilters?: Record<string, string | string[]>;
  includedFacets?: string[];
  excludedFacets?: string[];
}

export interface RecommendationParams {
  tags: string[];
  products?: string[];
  blockedItems?: string[];
  categories?: string[];
  brands?: string[];
  shopper?: string;
  cart?: string[];
  lastViewed?: string[];
  limits?: number[];
  filters?: Record<string, string | string[]>;
}

export interface BeaconEventParams {
  type: "profile.render" | "profile.impression" | "profile.click" | 
        "profile.product.render" | "profile.product.impression" | "profile.product.click";
  category: string;
  id: string;
  pid?: string;
  event: {
    profile?: {
      tag: string;
      placement: "product-page" | "home-page" | "no-results-page" | "confirmation-page" | 
                 "basket-page" | "404-page" | "user-account-page" | "other";
      seed?: Array<{ sku: string }>;
    };
    product?: {
      id: string;
      mappings?: {
        core?: Record<string, any>;
      };
      seed?: Array<{ sku: string }>;
    };
    context?: {
      type: string;
      tag: string;
      placement: string;
    };
  };
  context: {
    website: {
      trackingCode: string;
    };
    userId: string;
    sessionId: string;
    pageLoadId?: string;
  };
}

export interface BulkIndexParams {
  feedId: number;
  feedFile?: File;
  requestedBy?: string;
}

export interface IntelliSuggestTrackingParams {
  type: "product" | "cart" | "sale";
  event: {
    sku: string;
    price?: number;
    quantity?: number;
    category?: string;
    name?: string;
    [key: string]: any;
  };
  context?: {
    website?: {
      trackingCode?: string;
    };
    userId?: string;
    sessionId?: string;
    pageLoadId?: string;
  };
}

export interface SearchResultClickParams {
  intellisuggestData: string;
  intellisuggestSignature: string;
  note?: string;
}

export interface PlatformImplementationParams {
  platform: "shopify" | "bigcommerce-blueprint" | "bigcommerce-stencil" | "magento1" | "magento2" | "miva" | "commercev3" | "3dcart" | "volusion" | "custom";
  eventType: "product" | "cart" | "sale" | "search-click";
  sku?: string;
  price?: number;
  quantity?: number;
}

export interface CodeValidationParams {
  code: string;
  codeType: "tracking" | "search" | "autocomplete" | "recommendations";
  platform?: "shopify" | "bigcommerce" | "magento2" | "custom" | "other";
  issue?: string;
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class SearchspringClient {
  private config: SearchspringConfig;
  private searchClient: AxiosInstance;
  private beaconClient: AxiosInstance;
  private bulkIndexClient?: AxiosInstance;

  constructor(config: SearchspringConfig) {
    this.config = config;
    
    // Main search API client
    this.searchClient = axios.create({
      baseURL: `https://${config.siteId}.a.searchspring.io`,
      timeout: config.timeout || 10000,
      headers: {
        "User-Agent": "Searchspring-MCP-Server/1.0.0",
      },
    });

    // Beacon tracking client
    this.beaconClient = axios.create({
      baseURL: "https://beacon.searchspring.io",
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Searchspring-MCP-Server/1.0.0",
      },
    });

    // Bulk indexing client (if secret key provided)
    if (config.secretKey) {
      this.bulkIndexClient = axios.create({
        baseURL: "https://index-api.searchspring.net",
        timeout: config.timeout || 30000,
        auth: {
          username: config.siteId,
          password: config.secretKey,
        },
        headers: {
          "User-Agent": "Searchspring-MCP-Server/1.0.0",
        },
      });
    }
  }

  private buildSearchParams(params: SearchParams | AutocompleteParams): URLSearchParams {
    const searchParams = new URLSearchParams();
    searchParams.append("siteId", this.config.siteId);
    searchParams.append("resultsFormat", "json");
    searchParams.append("userId", params.userId!);
    searchParams.append("sessionId", params.sessionId!);
    searchParams.append("pageLoadId", params.pageLoadId!);
    searchParams.append("domain", params.domain!);

    if ('query' in params && params.query) {
      searchParams.append("q", params.query);
    }

    if (params.page) {
      searchParams.append("page", params.page.toString());
    }

    if (params.resultsPerPage) {
      searchParams.append("resultsPerPage", params.resultsPerPage.toString());
    }

    // Add filters with correct format
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(`filter.${key}`, v));
        } else {
          searchParams.append(`filter.${key}`, value);
        }
      });
    }

    // Add background filters
    if (params.bgfilters) {
      Object.entries(params.bgfilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(`bgfilter.${key}`, v));
        } else {
          searchParams.append(`bgfilter.${key}`, value);
        }
      });
    }

    // Add sort parameters
    if (params.sort) {
      Object.entries(params.sort).forEach(([key, direction]) => {
        searchParams.append(`sort.${key}`, direction);
      });
    }

    // Add optional parameters
    if (params.redirectResponse) {
      searchParams.append("redirectResponse", params.redirectResponse);
    }

    if (params.landingPage) {
      searchParams.append("landing-page", params.landingPage);
    }

    if (params.tag) {
      searchParams.append("tag", params.tag);
    }

    if (params.includedFacets) {
      params.includedFacets.forEach(facet => {
        searchParams.append("includedFacets", facet);
      });
    }

    if (params.excludedFacets) {
      params.excludedFacets.forEach(facet => {
        searchParams.append("excludedFacets", facet);
      });
    }

    if (params.disableInlineBanners) {
      searchParams.append("disableInlineBanners", "true");
    }

    if (params.lastViewed) {
      searchParams.append("lastViewed", params.lastViewed.join(","));
    }

    if (params.cart) {
      searchParams.append("cart", params.cart.join(","));
    }

    if (params.shopper) {
      searchParams.append("shopper", params.shopper);
    }

    return searchParams;
  }

  async search(params: SearchParams) {
    // Build the actual API URL for implementation guidance
    const searchParams = this.buildSearchParams({
      ...params,
      userId: params.userId || "USER_ID_HERE",
      sessionId: params.sessionId || "SESSION_ID_HERE",
      pageLoadId: params.pageLoadId || "PAGE_LOAD_ID_HERE",
      domain: params.domain || "https://your-site.com",
    });

    const apiUrl = `https://${this.config.siteId}.a.searchspring.io/api/search/search.json?${searchParams}`;

    return {
      content: [
        {
          type: "text",
          text: `Searchspring Search API Implementation Guide\n\n` +
               `API Endpoint: ${apiUrl}\n\n` +
               `Required Parameters:\n` +
               `- siteId: ${this.config.siteId}\n` +
               `- resultsFormat: json\n` +
               `- userId: Unique user identifier\n` +
               `- sessionId: Session identifier\n` +
               `- pageLoadId: Page load identifier\n` +
               `- domain: Your website domain\n\n` +
               `Optional Parameters:\n` +
               `- q: Search query ("${params.query || 'search terms'}")\n` +
               `- page: Page number (${params.page || 1})\n` +
               `- resultsPerPage: Results per page (${params.resultsPerPage || 24})\n` +
               `- filter.{field}: Apply filters\n` +
               `- sort.{field}: Sort direction (asc/desc)\n\n` +
               `Example JavaScript Implementation:\n` +
               `\`\`\`javascript\n` +
               `fetch('${apiUrl}')\n` +
               `  .then(response => response.json())\n` +
               `  .then(data => {\n` +
               `    // Handle search results\n` +
               `    console.log(data.results);\n` +
               `    // Update your UI with results\n` +
               `  })\n` +
               `  .catch(error => console.error('Search error:', error));\n` +
               `\`\`\`\n\n` +
               `Documentation: https://docs.searchspring.com/api/search/`,
        },
      ],
    };
  }

  async autocomplete(params: AutocompleteParams) {
    // Build the actual API URL for implementation guidance
    const searchParams = this.buildSearchParams({
      ...params,
      userId: params.userId || "USER_ID_HERE",
      sessionId: params.sessionId || "SESSION_ID_HERE",
      pageLoadId: params.pageLoadId || "PAGE_LOAD_ID_HERE",
      domain: params.domain || "https://your-site.com",
    });

    const apiUrl = `https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json?${searchParams}`;

    return {
      content: [
        {
          type: "text",
          text: `Searchspring Autocomplete API Implementation Guide\n\n` +
               `API Endpoint: ${apiUrl}\n\n` +
               `Use Case: Real-time search suggestions as user types\n\n` +
               `Implementation Example:\n` +
               `\`\`\`javascript\n` +
               `// Add to your search input field\n` +
               `const searchInput = document.getElementById('search');\n` +
               `let debounceTimer;\n\n` +
               `searchInput.addEventListener('input', function(e) {\n` +
               `  clearTimeout(debounceTimer);\n` +
               `  const query = e.target.value;\n` +
               `  \n` +
               `  if (query.length >= 2) {\n` +
               `    debounceTimer = setTimeout(() => {\n` +
               `      fetchAutocomplete(query);\n` +
               `    }, 300);\n` +
               `  }\n` +
               `});\n\n` +
               `function fetchAutocomplete(query) {\n` +
               `  const url = 'https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json';\n` +
               `  const params = new URLSearchParams({\n` +
               `    siteId: '${this.config.siteId}',\n` +
               `    resultsFormat: 'json',\n` +
               `    q: query,\n` +
               `    userId: getUserId(),\n` +
               `    sessionId: getSessionId(),\n` +
               `    pageLoadId: getPageLoadId(),\n` +
               `    domain: window.location.origin\n` +
               `  });\n` +
               `  \n` +
               `  fetch(url + '?' + params)\n` +
               `    .then(response => response.json())\n` +
               `    .then(data => displaySuggestions(data))\n` +
               `    .catch(error => console.error('Autocomplete error:', error));\n` +
               `}\n` +
               `\`\`\`\n\n` +
               `Documentation: https://docs.searchspring.com/api/autocomplete/`,
        },
      ],
    };
  }

  async suggest(params: SuggestParams) {
    const searchParams = new URLSearchParams({
      siteId: this.config.siteId,
      q: params.query || "search term",
      language: params.language || "en",
      suggestionCount: (params.suggestionCount || 4).toString(),
      productCount: (params.productCount || 20).toString(),
    });

    const apiUrl = `https://${this.config.siteId}.a.searchspring.io/api/suggest/query?${searchParams}`;

    return {
      content: [
        {
          type: "text",
          text: `Searchspring Suggest API Implementation Guide\n\n` +
               `API Endpoint: ${apiUrl}\n\n` +
               `Use Case: Spell correction and search term suggestions\n\n` +
               `Key Features:\n` +
               `- Spell correction for misspelled queries\n` +
               `- Alternative search term suggestions\n` +
               `- Language-specific correction models\n\n` +
               `Implementation Example:\n` +
               `\`\`\`javascript\n` +
               `function getSuggestions(query) {\n` +
               `  const url = 'https://${this.config.siteId}.a.searchspring.io/api/suggest/query';\n` +
               `  const params = new URLSearchParams({\n` +
               `    siteId: '${this.config.siteId}',\n` +
               `    q: query,\n` +
               `    language: 'en',\n` +
               `    suggestionCount: '4',\n` +
               `    productCount: '20'\n` +
               `  });\n\n` +
               `  fetch(url + '?' + params)\n` +
               `    .then(response => response.json())\n` +
               `    .then(data => {\n` +
               `      if (data.spellCorrection && data.spellCorrection.corrected) {\n` +
               `        // Show "Did you mean: {corrected}?"\n` +
               `        showSpellCorrection(data.spellCorrection.corrected);\n` +
               `      }\n` +
               `      \n` +
               `      if (data.suggestions && data.suggestions.length > 0) {\n` +
               `        // Show alternative suggestions\n` +
               `        showSuggestions(data.suggestions);\n` +
               `      }\n` +
               `    })\n` +
               `    .catch(error => console.error('Suggest error:', error));\n` +
               `}\n` +
               `\`\`\`\n\n` +
               `Documentation: https://docs.searchspring.com/api/suggest/`,
        },
      ],
    };
  }

  async trending(params: TrendingParams) {
    const searchParams = new URLSearchParams({
      siteId: this.config.siteId,
      limit: (params.limit || 6).toString(),
    });

    const apiUrl = `https://${this.config.siteId}.a.searchspring.io/api/suggest/trending?${searchParams}`;

    return {
      content: [
        {
          type: "text",
          text: `Searchspring Trending API Implementation Guide\n\n` +
               `API Endpoint: ${apiUrl}\n\n` +
               `Use Case: Display trending search terms and popular queries\n\n` +
               `Implementation Example:\n` +
               `\`\`\`javascript\n` +
               `function loadTrendingTerms() {\n` +
               `  const url = 'https://${this.config.siteId}.a.searchspring.io/api/suggest/trending';\n` +
               `  const params = new URLSearchParams({\n` +
               `    siteId: '${this.config.siteId}',\n` +
               `    limit: '${params.limit || 6}'\n` +
               `  });\n\n` +
               `  fetch(url + '?' + params)\n` +
               `    .then(response => response.json())\n` +
               `    .then(data => {\n` +
               `      // Display trending terms\n` +
               `      const trendingContainer = document.getElementById('trending-terms');\n` +
               `      data.terms.forEach(term => {\n` +
               `        const link = document.createElement('a');\n` +
               `        link.href = '/search?q=' + encodeURIComponent(term.query);\n` +
               `        link.textContent = term.query;\n` +
               `        trendingContainer.appendChild(link);\n` +
               `      });\n` +
               `    })\n` +
               `    .catch(error => console.error('Trending error:', error));\n` +
               `}\n\n` +
               `// Load trending terms on page load\n` +
               `document.addEventListener('DOMContentLoaded', loadTrendingTerms);\n` +
               `\`\`\`\n\n` +
               `Common Use Cases:\n` +
               `- Homepage trending search suggestions\n` +
               `- No results page alternative queries\n` +
               `- Search landing page popular terms\n\n` +
               `Documentation: https://docs.searchspring.com/api/trending/`,
        },
      ],
    };
  }

  async finder(params: FinderParams) {
    try {
      const searchParams = new URLSearchParams({
        siteId: this.config.siteId,
        resultsPerPage: "0", // Always 0 for finder
      });

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

      // Add background filters
      if (params.bgfilters) {
        Object.entries(params.bgfilters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(`bgfilter.${key}`, v));
          } else {
            searchParams.append(`bgfilter.${key}`, value);
          }
        });
      }

      if (params.includedFacets) {
        params.includedFacets.forEach(facet => {
          searchParams.append("includedFacets", facet);
        });
      }

      if (params.excludedFacets) {
        params.excludedFacets.forEach(facet => {
          searchParams.append("excludedFacets", facet);
        });
      }

      const response = await this.searchClient.get(`/api/search/finder.json?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Finder API results (facets only):\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Finder API error: ${this.getErrorMessage(error)}`);
    }
  }

  async recommendations(params: RecommendationParams) {
    try {
      const searchParams = new URLSearchParams();

      // Add tags (required)
      searchParams.append("tags", params.tags.join(","));

      if (params.products) {
        searchParams.append("products", params.products.join(","));
      }

      if (params.blockedItems) {
        searchParams.append("blockedItems", params.blockedItems.join(","));
      }

      if (params.categories) {
        searchParams.append("categories", params.categories.join(","));
      }

      if (params.brands) {
        searchParams.append("brands", params.brands.join(","));
      }

      if (params.shopper) {
        searchParams.append("shopper", params.shopper);
      }

      if (params.cart) {
        searchParams.append("cart", params.cart.join(","));
      }

      if (params.lastViewed) {
        searchParams.append("lastViewed", params.lastViewed.join(","));
      }

      if (params.limits) {
        searchParams.append("limits", params.limits.join(","));
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

      const recClient = axios.create({
        baseURL: `https://${this.config.siteId}.a.searchspring.io`,
        timeout: this.config.timeout || 10000,
        headers: {
          "User-Agent": "Searchspring-MCP-Server/1.0.0",
        },
      });

      const response = await recClient.get(`/boost/${this.config.siteId}/recommend?${searchParams}`);
      
      return {
        content: [
          {
            type: "text",
            text: `Recommendations for tags [${params.tags.join(", ")}]:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Recommendations API error: ${this.getErrorMessage(error)}`);
    }
  }

  async trackEvent(params: BeaconEventParams) {
    try {
      const response = await this.beaconClient.post("/beacon", params);
      
      return {
        content: [
          {
            type: "text",
            text: `Beacon event tracked successfully: ${params.type}\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Beacon API error: ${this.getErrorMessage(error)}`);
    }
  }

  async bulkIndex(params: BulkIndexParams) {
    if (!this.bulkIndexClient) {
      throw new Error("Bulk indexing requires SEARCHSPRING_SECRET_KEY to be configured");
    }

    try {
      const formData = new FormData();
      formData.append("feedId", params.feedId.toString());
      
      if (params.feedFile) {
        formData.append("feedFile", params.feedFile);
      }
      
      if (params.requestedBy) {
        formData.append("requestedBy", params.requestedBy);
      }

      const method = params.feedFile ? "POST" : "PUT";
      const config: any = {
        method,
        url: "/api/index/feed",
      };
      
      if (method === "POST") {
        config.data = formData;
        config.headers = { "Content-Type": "multipart/form-data" };
      } else {
        config.params = { feedId: params.feedId, requestedBy: params.requestedBy };
      }
      
      const response = await this.bulkIndexClient.request(config);
      
      return {
        content: [
          {
            type: "text",
            text: `Bulk indexing ${method === "POST" ? "with file upload" : "trigger"} completed for feed ${params.feedId}:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Bulk indexing error: ${this.getErrorMessage(error)}`);
    }
  }

  async getBulkIndexStatus() {
    if (!this.bulkIndexClient) {
      throw new Error("Bulk index status requires SEARCHSPRING_SECRET_KEY to be configured");
    }

    try {
      const response = await this.bulkIndexClient.get("/api/index/status");
      
      return {
        content: [
          {
            type: "text",
            text: `Bulk indexing status:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Bulk index status error: ${this.getErrorMessage(error)}`);
    }
  }

  async trackIntelliSuggestEvent(params: IntelliSuggestTrackingParams) {
    try {
      const eventPayload = {
        type: params.type,
        category: "searchspring.recommendations.user-interactions",
        id: generateId(),
        event: params.event,
        context: {
          website: {
            trackingCode: params.context?.website?.trackingCode || this.config.siteId,
          },
          userId: params.context?.userId || generateId(),
          sessionId: params.context?.sessionId || generateId(),
          pageLoadId: params.context?.pageLoadId || generateId(),
        },
      };

      const response = await this.beaconClient.post("/beacon", eventPayload);
      
      return {
        content: [
          {
            type: "text",
            text: `IntelliSuggest ${params.type} event tracked successfully:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`IntelliSuggest tracking error: ${this.getErrorMessage(error)}`);
    }
  }

  async trackSearchResultClick(params: SearchResultClickParams) {
    // Note: This requires the IntelliSuggest JavaScript SDK to work properly
    // The API cannot be called directly - this is for reference/documentation only
    return {
      content: [
        {
          type: "text",
          text: `Search result click tracking requires IntelliSuggest JavaScript SDK.\n\n` +
               `IMPORTANT: Cannot be implemented via direct API calls.\n\n` +
               `Required implementation:\n` +
               `1. Include IntelliSuggest script: <script src="//cdn.searchspring.net/intellisuggest/is.min.js"></script>\n` +
               `2. Use the JavaScript SDK to track clicks with these parameters:\n` +
               `   - intellisuggestData: ${params.intellisuggestData}\n` +
               `   - intellisuggestSignature: ${params.intellisuggestSignature}\n\n` +
               `These values come from Search API response results.\n` +
               `Documentation: https://help.searchspring.net/hc/en-us/articles/201185129-Adding-IntelliSuggest-Tracking#productclicks`,
        },
      ],
    };
  }

  async getPlatformImplementation(params: PlatformImplementationParams) {
    const { platform, eventType, sku = "PRODUCT_SKU", price = 99.99, quantity = 1 } = params;

    const implementations: Record<string, Record<string, string>> = {
      shopify: {
        product: `<!-- Add to product page template -->
<script>
if (typeof ss != 'undefined') {
  ss.track.product.view({
    sku: '{{ product.variants.first.sku }}',
    name: '{{ product.title }}',
    price: {{ product.price | money_without_currency }}
  });
}
</script>`,
        cart: `<!-- Add to cart page or add-to-cart action -->
<script>
if (typeof ss != 'undefined') {
  {% for item in cart.items %}
  ss.track.cart.add({
    sku: '{{ item.sku }}',
    name: '{{ item.product.title }}',
    price: {{ item.price | money_without_currency }},
    quantity: {{ item.quantity }}
  });
  {% endfor %}
}
</script>`,
        sale: `<!-- Add to thank you page -->
<script>
if (typeof ss != 'undefined') {
  {% for line_item in order.line_items %}
  ss.track.purchase.buy({
    sku: '{{ line_item.sku }}',
    name: '{{ line_item.title }}',
    price: {{ line_item.price | money_without_currency }},
    quantity: {{ line_item.quantity }}
  });
  {% endfor %}
}
</script>`
      },
      "bigcommerce-stencil": {
        product: `<!-- Add to product page template -->
<script>
if (typeof ss != 'undefined') {
  ss.track.product.view({
    sku: '{{product.sku}}',
    name: '{{product.title}}',
    price: {{product.price.without_tax.value}}
  });
}
</script>`,
        cart: `<!-- Add to cart page -->
<script>
if (typeof ss != 'undefined') {
  {{#each cart.items}}
  ss.track.cart.add({
    sku: '{{sku}}',
    name: '{{name}}',
    price: {{price.value}},
    quantity: {{quantity}}
  });
  {{/each}}
}
</script>`,
        sale: `<!-- Add to order confirmation -->
<script>
if (typeof ss != 'undefined') {
  {{#each order.items}}
  ss.track.purchase.buy({
    sku: '{{sku}}',
    name: '{{name}}',
    price: {{price.value}},
    quantity: {{quantity}}
  });
  {{/each}}
}
</script>`
      },
      magento2: {
        product: `<!-- Add to catalog/product/view.phtml -->
<script>
if (typeof ss != 'undefined') {
  ss.track.product.view({
    sku: '<?= $product->getSku() ?>',
    name: '<?= $product->getName() ?>',
    price: <?= $product->getFinalPrice() ?>
  });
}
</script>`,
        cart: `<!-- Add to checkout/cart/index.phtml -->
<script>
if (typeof ss != 'undefined') {
  <?php foreach ($cart->getAllVisibleItems() as $item): ?>
  ss.track.cart.add({
    sku: '<?= $item->getSku() ?>',
    name: '<?= $item->getName() ?>',
    price: <?= $item->getPrice() ?>,
    quantity: <?= $item->getQty() ?>
  });
  <?php endforeach; ?>
}
</script>`,
        sale: `<!-- Add to checkout/success.phtml -->
<script>
if (typeof ss != 'undefined') {
  <?php foreach ($order->getAllVisibleItems() as $item): ?>
  ss.track.purchase.buy({
    sku: '<?= $item->getSku() ?>',
    name: '<?= $item->getName() ?>',
    price: <?= $item->getPrice() ?>,
    quantity: <?= (int)$item->getQtyOrdered() ?>
  });
  <?php endforeach; ?>
}
</script>`
      },
      custom: {
        product: `<!-- Generic implementation for product view -->
<script>
// Ensure IntelliSuggest is loaded
if (typeof ss != 'undefined') {
  ss.track.product.view({
    sku: '${sku}',
    name: 'Product Name',
    price: ${price}
  });
}
</script>`,
        cart: `<!-- Generic implementation for cart/add to cart -->
<script>
if (typeof ss != 'undefined') {
  ss.track.cart.add({
    sku: '${sku}',
    name: 'Product Name',
    price: ${price},
    quantity: ${quantity}
  });
}
</script>`,
        sale: `<!-- Generic implementation for purchase -->
<script>
if (typeof ss != 'undefined') {
  ss.track.purchase.buy({
    sku: '${sku}',
    name: 'Product Name',
    price: ${price},
    quantity: ${quantity}
  });
}
</script>`
      }
    };

    const platformCode = implementations[platform] || implementations.custom;
    const code = platformCode![eventType] || platformCode!.product;

    const documentationUrls: Record<string, string> = {
      shopify: "https://help.searchspring.net/hc/en-us/articles/206972376-IntelliSuggest-Tracking-in-Shopify",
      "bigcommerce-blueprint": "https://help.searchspring.net/hc/en-us/articles/115001480266",
      "bigcommerce-stencil": "https://help.searchspring.net/hc/en-us/articles/360056186252",
      magento1: "https://help.searchspring.net/hc/en-us/articles/201185069-IntelliSuggest-Tracking-in-Magento",
      magento2: "https://github.com/searchspring/magento2-searchspring-tracking/",
      miva: "https://help.searchspring.net/hc/en-us/articles/201185049-IntelliSuggest-Tracking-for-Miva-Merchant",
      commercev3: "https://help.searchspring.net/hc/en-us/articles/201185179",
      "3dcart": "https://help.searchspring.net/hc/en-us/articles/201185169-IntelliSuggest-Tracking-in-3dCart",
      volusion: "https://help.searchspring.net/hc/en-us/articles/115001879966",
      custom: "https://help.searchspring.net/hc/en-us/articles/201185129-Adding-IntelliSuggest-Tracking"
    };

    return {
      content: [
        {
          type: "text",
          text: `IntelliSuggest Tracking Implementation for ${platform.toUpperCase()} - ${eventType} event:\n\n` +
               `IMPORTANT: Include IntelliSuggest script first:\n` +
               `<script src="//cdn.searchspring.net/intellisuggest/is.min.js"></script>\n\n` +
               `Implementation Code:\n${code}\n\n` +
               `Documentation: ${documentationUrls[platform]}\n\n` +
               `Requirements:\n` +
               `- _isuid cookie must be set\n` +
               `- IntelliSuggest script must NOT have defer/async attributes\n` +
               `- SKU values must match Searchspring indexed product SKU core field`,
        },
      ],
    };
  }

  async validateCode(params: CodeValidationParams) {
    const { code, codeType, platform, issue } = params;

    const validationResults: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Common validation checks
    if (codeType === "tracking") {
      // Check for IntelliSuggest script inclusion
      if (!code.includes("cdn.searchspring.net/intellisuggest") && !code.includes("is.min.js")) {
        validationResults.push("❌ Missing IntelliSuggest script: <script src='//cdn.searchspring.net/intellisuggest/is.min.js'></script>");
      } else {
        validationResults.push("✅ IntelliSuggest script inclusion detected");
      }

      // Check for ss.track usage
      if (!code.includes("ss.track")) {
        validationResults.push("❌ No tracking calls found (ss.track.product.view, ss.track.cart.add, ss.track.purchase.buy)");
      } else {
        validationResults.push("✅ Tracking calls detected");
      }

      // Check for typeof ss check
      if (!code.includes("typeof ss")) {
        warnings.push("⚠️  Consider adding safety check: if (typeof ss != 'undefined')");
      }

      // Check for required tracking fields
      if (code.includes("ss.track.product") && !code.includes("sku")) {
        validationResults.push("❌ Product tracking missing required 'sku' field");
      }

      if (code.includes("ss.track.cart") && (!code.includes("sku") || !code.includes("quantity"))) {
        validationResults.push("❌ Cart tracking missing required 'sku' and/or 'quantity' fields");
      }

      if (code.includes("ss.track.purchase") && (!code.includes("sku") || !code.includes("quantity"))) {
        validationResults.push("❌ Purchase tracking missing required 'sku' and/or 'quantity' fields");
      }
    }

    if (codeType === "search" || codeType === "autocomplete") {
      // Check for API endpoint
      if (!code.includes(".a.searchspring.io")) {
        validationResults.push("❌ Missing Searchspring API endpoint (should include .a.searchspring.io)");
      }

      // Check for required parameters
      if (!code.includes("siteId")) {
        validationResults.push("❌ Missing required 'siteId' parameter");
      }

      if (!code.includes("userId") && !code.includes("sessionId")) {
        warnings.push("⚠️  Missing tracking parameters (userId, sessionId) - these are required for analytics");
      }

      // Check for error handling
      if (!code.includes(".catch") && !code.includes("try")) {
        warnings.push("⚠️  No error handling detected - consider adding .catch() or try/catch");
      }
    }

    // Platform-specific checks
    if (platform === "shopify") {
      if (codeType === "tracking" && !code.includes("{{")) {
        warnings.push("⚠️  No Liquid template variables detected - make sure you're using Shopify's template syntax");
      }

      if (code.includes("product.variants.first.sku") && !code.includes("product.selected_or_first_available_variant.sku")) {
        suggestions.push("💡 Consider using product.selected_or_first_available_variant.sku for better variant handling");
      }
    }

    if (platform === "magento2") {
      if (codeType === "tracking" && !code.includes("<?=")) {
        warnings.push("⚠️  No PHP template syntax detected - make sure you're using Magento's .phtml syntax");
      }
    }

    // Issue-specific troubleshooting
    let troubleshooting = "";
    if (issue) {
      troubleshooting = `\n\nTroubleshooting for: "${issue}"\n`;

      if (issue.toLowerCase().includes("not working") || issue.toLowerCase().includes("not tracking")) {
        troubleshooting += `Common causes:\n` +
                          `- IntelliSuggest script not loaded or blocked by ad blockers\n` +
                          `- Script placed in wrong location (should be in <head> or before tracking calls)\n` +
                          `- Missing _isuid cookie (check browser dev tools > Application > Cookies)\n` +
                          `- SKU values don't match Searchspring indexed product SKU field\n` +
                          `- Browser console errors preventing script execution\n`;
      }

      if (issue.toLowerCase().includes("undefined") || issue.toLowerCase().includes("is not defined")) {
        troubleshooting += `Script loading issue:\n` +
                          `- Ensure IntelliSuggest script loads before your tracking code\n` +
                          `- Remove async/defer attributes from the IntelliSuggest script tag\n` +
                          `- Check browser console for script loading errors\n`;
      }

      if (issue.toLowerCase().includes("search") || issue.toLowerCase().includes("results")) {
        troubleshooting += `API integration issues:\n` +
                          `- Verify siteId is correct: ${this.config.siteId}\n` +
                          `- Check CORS settings if calling from browser\n` +
                          `- Ensure all required parameters are included\n` +
                          `- Check network tab for API response errors\n`;
      }
    }

    const summary = `Code Validation Results for ${codeType.toUpperCase()} implementation${platform ? ` on ${platform.toUpperCase()}` : ''}\n\n` +
                   `${validationResults.join('\n')}\n\n` +
                   (warnings.length > 0 ? `Warnings:\n${warnings.join('\n')}\n\n` : '') +
                   (suggestions.length > 0 ? `Suggestions:\n${suggestions.join('\n')}\n\n` : '') +
                   troubleshooting +
                   `\nFor additional support:\n` +
                   `- Documentation: https://docs.searchspring.com/\n` +
                   `- Support: https://help.searchspring.net/\n` +
                   `- Implementation guides: https://help.searchspring.net/hc/en-us/sections/201185149`;

    return {
      content: [
        {
          type: "text",
          text: summary,
        },
      ],
    };
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