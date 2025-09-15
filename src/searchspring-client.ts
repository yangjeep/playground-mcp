import { SearchspringConfig } from "./config.js";

export interface PlatformImplementationParams {
  platform: "shopify" | "bigcommerce-blueprint" | "bigcommerce-stencil" | "magento1" | "magento2" | "miva" | "commercev3" | "3dcart" | "volusion" | "custom";
  eventType: "product" | "cart" | "sale" | "search-click";
  sku?: string;
  price?: number;
  quantity?: number;
}

export interface CodeValidationParams {
  code: string;
  codeType: "search" | "autocomplete" | "suggest" | "trending" | "recommendations" | "finder" | "beacon" | "bulk-index" | "tracking";
  platform?: "shopify" | "bigcommerce" | "magento2" | "custom" | "other";
  issue?: string;
}

export interface ApiGuideParams {
  api: "search" | "autocomplete" | "suggest" | "trending" | "recommendations" | "finder" | "beacon" | "bulk-index";
}

export interface ParameterGuideParams {
  api: "search" | "autocomplete" | "suggest" | "trending" | "recommendations" | "finder" | "beacon" | "bulk-index";
  parameter: string;
}

export interface CodeGeneratorParams {
  api: "search" | "autocomplete" | "suggest" | "trending" | "recommendations" | "finder" | "beacon" | "bulk-index" | "tracking";
  platform: "shopify" | "bigcommerce" | "magento2" | "javascript" | "php" | "python" | "custom";
  eventType?: "product" | "cart" | "sale" | "search-click" | "impression";
  useCase?: string;
}

export class SearchspringClient {
  private config: SearchspringConfig;

  constructor(config: SearchspringConfig) {
    this.config = config;
  }

  async getApiGuide(params: ApiGuideParams) {
    const { api } = params;

    const apiGuides = {
      search: {
        name: "Search API",
        description: "Full-text product search with filtering, sorting, and pagination",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/api/search/search.json`,
        requiredParams: ["siteId", "resultsFormat", "userId", "sessionId", "pageLoadId", "domain"],
        optionalParams: ["q", "page", "resultsPerPage", "filter.*", "bgfilter.*", "sort.*", "redirectResponse", "landingPage", "tag", "includedFacets", "excludedFacets", "disableInlineBanners", "lastViewed", "cart", "shopper"],
        example: `fetch('https://${this.config.siteId}.a.searchspring.io/api/search/search.json?siteId=${this.config.siteId}&resultsFormat=json&q=shoes&userId=user123&sessionId=session456&pageLoadId=page789&domain=https://yoursite.com')
  .then(response => response.json())
  .then(data => {
    console.log('Total results:', data.pagination.totalResults);
    data.results.forEach(product => {
      console.log(product.title, product.price);
    });
  })
  .catch(error => console.error('Search error:', error));`,
        useCases: [
          "Product catalog search",
          "Category page filtering",
          "Search results page",
          "Faceted navigation"
        ],
        bestPractices: [
          "Always include tracking parameters: userId (from ssUserId cookie), sessionId (from ssSessionIdNamespace cookie), pageLoadId (UUID v4), domain (window.location.href)",
          "Use background filters (bgfilter.*) for permanent filtering, not filter.*",
          "Implement proper error handling with .catch()",
          "Use debouncing for real-time search (minimum 50ms for autocomplete)",
          "Include pagination for large result sets",
          "Use query parameter (q) for all search requests"
        ]
      },
      autocomplete: {
        name: "Autocomplete API",
        description: "Real-time product preview as user types - REQUIRED for autocomplete functionality (not Search API)",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json`,
        requiredParams: ["siteId", "resultsFormat", "userId", "sessionId", "pageLoadId", "domain"],
        optionalParams: ["q", "resultsPerPage", "page", "filter.*", "bgfilter.*", "sort.*", "redirectResponse", "lastViewed", "cart", "shopper"],
        example: `const searchInput = document.getElementById('search');
let debounceTimer;

searchInput.addEventListener('input', function(e) {
  clearTimeout(debounceTimer);
  const query = e.target.value;

  if (query.length >= 2) {
    debounceTimer = setTimeout(() => {
      fetchAutocomplete(query);
    }, 50); // 50ms debounce as recommended by Searchspring docs
  }
});

function fetchAutocomplete(query) {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json?siteId=${this.config.siteId}&resultsFormat=json&q=' + query + '&userId=user123&sessionId=session456&pageLoadId=page789&domain=https://yoursite.com')
    .then(response => response.json())
    .then(data => displaySuggestions(data))
    .catch(error => console.error('Autocomplete error:', error));
}`,
        useCases: [
          "Search input suggestions",
          "Product finder autocomplete",
          "Category autocomplete",
          "Brand/attribute suggestions"
        ],
        bestPractices: [
          "Use debouncing (300ms delay recommended)",
          "Start suggesting after 2+ characters",
          "Limit results to 8-10 suggestions",
          "Handle keyboard navigation (up/down arrows)",
          "Clear suggestions on blur or escape"
        ]
      },
      suggest: {
        name: "Suggest API",
        description: "Spell correction and alternative search term suggestions",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/api/suggest/query`,
        requiredParams: ["siteId"],
        optionalParams: ["q", "language", "suggestionCount", "productCount"],
        example: `function getSuggestions(query) {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/suggest/query?siteId=${this.config.siteId}&q=' + query + '&language=en&suggestionCount=4')
    .then(response => response.json())
    .then(data => {
      if (data.spellCorrection && data.spellCorrection.corrected) {
        showSpellCorrection(data.spellCorrection.corrected);
      }
      if (data.suggestions && data.suggestions.length > 0) {
        showAlternativeSuggestions(data.suggestions);
      }
    })
    .catch(error => console.error('Suggest error:', error));
}`,
        useCases: [
          "Spell correction for misspelled queries",
          "Alternative search suggestions",
          "No results page suggestions",
          "Query expansion"
        ],
        bestPractices: [
          "Show spell corrections prominently",
          "Limit suggestions to 3-5 alternatives",
          "Use on no-results pages",
          "Consider user's language/locale"
        ]
      },
      trending: {
        name: "Trending API",
        description: "Popular search terms and trending content",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/api/suggest/trending`,
        requiredParams: ["siteId"],
        optionalParams: ["limit"],
        example: `function loadTrendingTerms() {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/suggest/trending?siteId=${this.config.siteId}&limit=6')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('trending-terms');
      data.terms.forEach(term => {
        const link = document.createElement('a');
        link.href = '/search?q=' + encodeURIComponent(term.query);
        link.textContent = term.query;
        container.appendChild(link);
      });
    })
    .catch(error => console.error('Trending error:', error));
}`,
        useCases: [
          "Homepage trending searches",
          "No results page alternatives",
          "Popular content widgets",
          "Search inspiration"
        ],
        bestPractices: [
          "Update trending terms regularly",
          "Limit to 5-8 terms for better UX",
          "Use on homepage and no-results pages",
          "Make terms clickable for easy searching"
        ]
      },
      recommendations: {
        name: "Recommendations API",
        description: "Personalized product recommendations",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/boost/${this.config.siteId}/recommend`,
        requiredParams: ["tags"],
        optionalParams: ["products", "blockedItems", "categories", "brands", "shopper", "cart", "lastViewed", "limits", "filter.*"],
        example: `function getRecommendations() {
  const params = new URLSearchParams({
    tags: 'similar-products,trending',
    products: 'PRODUCT-123',
    limits: '5,10',
    shopper: 'user123'
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/boost/${this.config.siteId}/recommend?' + params)
    .then(response => response.json())
    .then(data => {
      data.profiles.forEach(profile => {
        console.log('Profile:', profile.tag);
        profile.results.forEach(product => {
          console.log(' -', product.title, product.price);
        });
      });
    })
    .catch(error => console.error('Recommendations error:', error));
}`,
        useCases: [
          "Product page cross-sells",
          "Homepage personalization",
          "Cart page upsells",
          "Related products"
        ],
        bestPractices: [
          "Use multiple recommendation types (tags)",
          "Include personalization data (shopper, cart, lastViewed)",
          "Block out-of-stock or inappropriate items",
          "Set reasonable limits per profile"
        ]
      },
      finder: {
        name: "Finder API",
        description: "Faceted search for building product finder interfaces - uses Search API with resultsPerPage=0",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/api/search/search.json`,
        requiredParams: ["siteId", "resultsPerPage=0"],
        optionalParams: ["filter.*", "bgfilter.*", "includedFacets", "excludedFacets"],
        example: `function getFacets() {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/search.json?siteId=${this.config.siteId}&resultsPerPage=0&filter.category=shoes')
    .then(response => response.json())
    .then(data => {
      data.facets.forEach(facet => {
        console.log('Facet:', facet.label);
        facet.values.forEach(value => {
          console.log(' -', value.label, '(' + value.count + ')');
        });
      });
    })
    .catch(error => console.error('Finder error:', error));
}`,
        useCases: [
          "Product finder widgets",
          "Advanced filtering interfaces",
          "Category navigation",
          "Faceted search"
        ],
        bestPractices: [
          "Always set resultsPerPage=0 for facets-only",
          "Use includedFacets to limit returned facets",
          "Apply background filters for category pages",
          "Show facet counts for better UX"
        ]
      },
      beacon: {
        name: "Beacon API",
        description: "Advanced event tracking for Personalized Recommendations - NOTE: For basic product tracking use IntelliSuggest ss.track.* methods",
        endpoint: `https://beacon.searchspring.io/api/event`,
        requiredParams: ["array of event objects with: category, context, event, id, type"],
        optionalParams: ["pid (for profile.product.* events)"],
        example: `function trackEvent(eventType, eventData) {
  const payload = {
    type: eventType,
    category: 'searchspring.recommendations.user-interactions',
    siteId: '${this.config.siteId}',
    id: 'event-' + Date.now(),
    userid: 'user123',
    sessionid: 'session456',
    data: eventData,
    context: {
      website: { trackingCode: '${this.config.siteId}' },
      page: { url: window.location.href }
    }
  };

  fetch('https://beacon.searchspring.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => console.log('Event tracked:', data))
  .catch(error => console.error('Tracking error:', error));
}`,
        useCases: [
          "Recommendation impression tracking",
          "Click-through analytics",
          "User behavior analytics",
          "Custom event tracking"
        ],
        bestPractices: [
          "Use consistent event categories",
          "Include user and session identifiers",
          "Batch events when possible",
          "Handle tracking failures gracefully",
          "Include relevant context data"
        ]
      },
      "bulk-index": {
        name: "Bulk Indexing API",
        description: "Bulk product data indexing and management",
        endpoint: `https://index-api.searchspring.net/api/index/feed`,
        requiredParams: ["feedId"],
        optionalParams: ["requestedBy"],
        example: `// Requires SEARCHSPRING_SECRET_KEY for authentication
function triggerBulkIndex() {
  const auth = btoa('${this.config.siteId}:' + secretKey);

  fetch('https://index-api.searchspring.net/api/index/feed?feedId=12345&requestedBy=admin@example.com', {
    method: 'PUT',
    headers: {
      'Authorization': 'Basic ' + auth,
      'User-Agent': 'YourApp/1.0.0'
    }
  })
  .then(response => response.json())
  .then(data => console.log('Indexing started:', data))
  .catch(error => console.error('Indexing error:', error));
}`,
        useCases: [
          "Product catalog updates",
          "Inventory synchronization",
          "Scheduled data imports",
          "Content management integration"
        ],
        bestPractices: [
          "Requires secret key authentication",
          "Use for batch updates, not real-time",
          "Include requestedBy email for notifications",
          "Monitor indexing status after triggering"
        ]
      }
    };

    const guide = apiGuides[api];
    if (!guide) {
      throw new Error(`Unknown API: ${api}`);
    }

    return {
      content: [
        {
          type: "text",
          text: `# ${guide.name} Implementation Guide

## Overview
${guide.description}

**API Endpoint**: ${guide.endpoint}

## Required Parameters
${guide.requiredParams.map(param => `- \`${param}\``).join('\n')}

## Optional Parameters
${guide.optionalParams.map(param => `- \`${param}\``).join('\n')}

## Implementation Example
\`\`\`javascript
${guide.example}
\`\`\`

## Common Use Cases
${guide.useCases.map(useCase => `- ${useCase}`).join('\n')}

## Best Practices
${guide.bestPractices.map(practice => `- ${practice}`).join('\n')}

## Documentation
📖 **Full API Documentation**: https://docs.searchspring.com/api/${api}/
🎯 **Help Center**: https://help.searchspring.net/
🔧 **Implementation Guides**: https://help.searchspring.net/hc/en-us/sections/201185149`,
        },
      ],
    };
  }

  async getParameterGuide(params: ParameterGuideParams) {
    const { api, parameter } = params;

    const parameterGuides: Record<string, Record<string, any>> = {
      search: {
        q: {
          description: "Search query string - the terms users want to search for",
          type: "string",
          example: "running shoes",
          bestPractices: [
            "URL encode special characters",
            "Trim whitespace before sending",
            "Consider query preprocessing (stemming, synonyms)",
            "Handle empty queries gracefully"
          ],
          useCases: ["Product search", "Site search", "Autocomplete"],
          relatedParams: ["redirectResponse", "landingPage"]
        },
        filters: {
          description: "Apply filters to search results using filter.{field}=value format",
          type: "object",
          example: "filter.brand=Nike&filter.color=blue&filter.price=50-100",
          bestPractices: [
            "Use exact field names from your product data",
            "For multiple values: filter.brand=Nike&filter.brand=Adidas",
            "For ranges: filter.price=min-max",
            "URL encode filter values"
          ],
          useCases: ["Category filtering", "Faceted navigation", "Price filtering"],
          relatedParams: ["bgfilters", "includedFacets", "excludedFacets"]
        },
        bgfilters: {
          description: "Background filters applied permanently, not visible to users",
          type: "object",
          example: "bgfilter.status=active&bgfilter.visibility=public",
          bestPractices: [
            "Use for system-level filtering (active products, visible items)",
            "Hide discontinued or out-of-stock products",
            "Apply site-specific rules",
            "Don't expose in filter UI"
          ],
          useCases: ["Product visibility", "Inventory filtering", "Site restrictions"],
          relatedParams: ["filters"]
        },
        sort: {
          description: "Sort search results by field and direction",
          type: "object",
          example: "sort.price=asc&sort.popularity=desc",
          bestPractices: [
            "Primary sort first, secondary sort second",
            "Use 'asc' for ascending, 'desc' for descending",
            "Common sorts: price, popularity, title, date",
            "Provide sort options to users"
          ],
          useCases: ["Price sorting", "Popularity sorting", "Name sorting", "Date sorting"],
          relatedParams: ["resultsPerPage", "page"]
        },
        userId: {
          description: "Unique identifier for tracking user behavior - sourced from ssUserId cookie",
          type: "string",
          example: "value from ssUserId cookie",
          bestPractices: [
            "Always get value from ssUserId cookie",
            "Automatically set by Searchspring tracking",
            "Do not manually generate - use cookie value",
            "Required for analytics and personalization"
          ],
          useCases: ["User tracking", "Personalization", "Analytics"],
          relatedParams: ["sessionId", "pageLoadId", "domain"]
        },
        sessionId: {
          description: "Session identifier for tracking user journey - sourced from ssSessionIdNamespace cookie",
          type: "string",
          example: "value from ssSessionIdNamespace cookie",
          bestPractices: [
            "Always get value from ssSessionIdNamespace cookie",
            "Automatically set by Searchspring tracking",
            "Do not manually generate - use cookie value",
            "Used for analytics and behavior tracking"
          ],
          useCases: ["Session tracking", "User journey analysis", "Analytics"],
          relatedParams: ["userId", "pageLoadId"]
        },
        pageLoadId: {
          description: "Unique identifier for each page load/search - should be UUID v4",
          type: "string",
          example: "e560933a-b0fe-408d-8df5-807270e79fb8",
          bestPractices: [
            "Generate new UUID v4 for each page load",
            "Update on every physical page load",
            "For SPA/headless: update on URL route change",
            "Critical for proper analytics tracking"
          ],
          useCases: ["Search tracking", "Click analytics", "Performance monitoring"],
          relatedParams: ["userId", "sessionId", "domain"]
        },
        domain: {
          description: "Current page URL - should be window.location.href",
          type: "string",
          example: "https://yoursite.com/search?q=shoes",
          bestPractices: [
            "Always use window.location.href value",
            "Include full URL with protocol and parameters",
            "Required for proper analytics and personalization",
            "Do not hardcode - get dynamically"
          ],
          useCases: ["Page tracking", "Analytics", "Personalization context"],
          relatedParams: ["userId", "sessionId", "pageLoadId"]
        }
      },
      autocomplete: {
        q: {
          description: "Partial search query for autocomplete suggestions",
          type: "string",
          example: "runn (user typing 'running')",
          bestPractices: [
            "Start suggestions after 2+ characters",
            "Use debouncing (50ms delay recommended by Searchspring)",
            "Handle special characters properly",
            "Clear suggestions when query is empty"
          ],
          useCases: ["Search input autocomplete", "Product suggestions", "Query completion"],
          relatedParams: ["resultsPerPage"]
        }
      },
      recommendations: {
        tags: {
          description: "Recommendation profile tags/IDs that define recommendation types",
          type: "array",
          example: "['similar-products', 'trending', 'recently-viewed']",
          bestPractices: [
            "Use meaningful profile names",
            "Configure profiles in Searchspring dashboard first",
            "Combine multiple recommendation types",
            "Order by priority/importance"
          ],
          useCases: ["Product recommendations", "Cross-selling", "Upselling", "Related products"],
          relatedParams: ["limits", "products", "shopper"]
        },
        limits: {
          description: "Maximum number of products per recommendation profile",
          type: "array",
          example: "[5, 10, 3] (corresponds to tags array order)",
          bestPractices: [
            "Match array length to tags array",
            "Consider page layout constraints",
            "Balance variety vs. performance",
            "Typical limits: 4-12 products"
          ],
          useCases: ["Controlling recommendation quantity", "Layout optimization"],
          relatedParams: ["tags"]
        },
        shopper: {
          description: "Logged-in user identifier for personalization",
          type: "string",
          example: "user-12345",
          bestPractices: [
            "Use only for authenticated users",
            "Consistent with your user system",
            "Improves recommendation quality",
            "Don't use for anonymous users"
          ],
          useCases: ["Personalized recommendations", "User-specific suggestions"],
          relatedParams: ["cart", "lastViewed"]
        }
      },
      beacon: {
        type: {
          description: "Event type identifier for analytics tracking",
          type: "string",
          example: "profile.impression, profile.click, custom.event",
          bestPractices: [
            "Use descriptive event names",
            "Follow consistent naming conventions",
            "Group related events with prefixes",
            "Document custom event types"
          ],
          useCases: ["Event categorization", "Analytics filtering", "Reporting"],
          relatedParams: ["category", "data"]
        },
        category: {
          description: "Event category for grouping analytics events",
          type: "string",
          example: "searchspring.recommendations.user-interactions",
          bestPractices: [
            "Use Searchspring standard categories when possible",
            "Create logical category hierarchies",
            "Document custom categories",
            "Keep category names consistent"
          ],
          useCases: ["Analytics grouping", "Event filtering", "Reporting dashboards"],
          relatedParams: ["type", "data"]
        },
        data: {
          description: "Event payload containing specific event data",
          type: "object",
          example: "{profile: {tag: 'similar-products'}, product: {id: 'SKU123'}}",
          bestPractices: [
            "Include relevant event context",
            "Keep payload size reasonable",
            "Use consistent data structure",
            "Validate data before sending"
          ],
          useCases: ["Event details", "Analytics context", "Personalization data"],
          relatedParams: ["type", "context"]
        }
      }
    };

    const apiParams = parameterGuides[api];
    if (!apiParams) {
      return {
        content: [
          {
            type: "text",
            text: `Parameter guidance for ${api} API is not yet available. Use the searchspring_api_guide tool to get comprehensive API documentation.`,
          },
        ],
      };
    }

    const paramGuide = apiParams[parameter];
    if (!paramGuide) {
      const availableParams = Object.keys(apiParams);
      return {
        content: [
          {
            type: "text",
            text: `Parameter '${parameter}' not found for ${api} API.

Available parameters for ${api}:
${availableParams.map(p => `- ${p}`).join('\n')}

Use one of these parameter names to get detailed guidance.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `# ${parameter} Parameter Guide (${api.toUpperCase()} API)

## Description
${paramGuide.description}

**Type**: ${paramGuide.type}

## Example Usage
\`\`\`
${paramGuide.example}
\`\`\`

## Best Practices
${paramGuide.bestPractices.map((practice: string) => `- ${practice}`).join('\n')}

## Common Use Cases
${paramGuide.useCases.map((useCase: string) => `- ${useCase}`).join('\n')}

## Related Parameters
${paramGuide.relatedParams.map((param: string) => `- \`${param}\``).join('\n')}

## Documentation
📖 **API Documentation**: https://docs.searchspring.com/api/${api}/
🎯 **Parameter Reference**: https://docs.searchspring.com/api/${api}/#parameters`,
        },
      ],
    };
  }

  async generateCode(params: CodeGeneratorParams) {
    const { api, platform, eventType, useCase } = params;

    // For backward compatibility, handle "tracking" as legacy alias
    const targetApi = api === "tracking" ? "beacon" : api;

    if (targetApi === "beacon" && eventType) {
      return this.generateTrackingCode(platform, eventType);
    }

    return this.generateApiCode(targetApi, platform, useCase);
  }

  private async generateApiCode(api: string, platform: string, useCase?: string) {
    // Generate implementation code for specific APIs
    const codeTemplates: Record<string, Record<string, string>> = {
      search: {
        javascript: `// Search API implementation
function searchProducts(query, filters = {}) {
  const params = new URLSearchParams({
    siteId: '${this.config.siteId}',
    resultsFormat: 'json',
    q: query,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageLoadId: getPageLoadId(),
    domain: window.location.origin
  });

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    params.append(\`filter.\${key}\`, value);
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/search.json?' + params)
    .then(response => response.json())
    .then(data => {
      console.log('Total results:', data.pagination.totalResults);
      displaySearchResults(data.results);
    })
    .catch(error => console.error('Search error:', error));
}`,
        shopify: `<!-- Shopify search implementation -->
<form action="/search" method="get">
  <input type="text" name="q" placeholder="Search products..." />
  <button type="submit">Search</button>
</form>

<script>
// Enhanced search with Searchspring API
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = this.querySelector('input[name="q"]').value;

  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/search.json?siteId=${this.config.siteId}&resultsFormat=json&q=' + query + '&userId={{ customer.id | default: "anonymous" }}&sessionId={{ session.id }}&domain={{ shop.permanent_domain }}')
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(error => console.error('Search error:', error));
});
</script>`
      },
      autocomplete: {
        javascript: `// Autocomplete implementation
const searchInput = document.getElementById('search');
let debounceTimer;

searchInput.addEventListener('input', function(e) {
  clearTimeout(debounceTimer);
  const query = e.target.value;

  if (query.length < 2) return;

  debounceTimer = setTimeout(() => {
    const params = new URLSearchParams({
      siteId: '${this.config.siteId}',
      resultsFormat: 'json',
      q: query,
      userId: getUserId(),
      sessionId: getSessionId()
    });

    fetch('https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json?' + params)
      .then(response => response.json())
      .then(data => displayAutocomplete(data.suggestions))
      .catch(error => console.error('Autocomplete error:', error));
  }, 300);
});`,
        shopify: `<!-- Shopify autocomplete implementation -->
<div class="search-autocomplete">
  <input type="text" id="search-input" placeholder="Search products..." />
  <div id="autocomplete-results"></div>
</div>

<script>
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('autocomplete-results');
let debounceTimer;

searchInput.addEventListener('input', function(e) {
  clearTimeout(debounceTimer);
  const query = e.target.value;

  if (query.length < 2) {
    resultsDiv.innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(() => {
    fetch('https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json?siteId=${this.config.siteId}&resultsFormat=json&q=' + query + '&userId={{ customer.id | default: "anonymous" }}&sessionId={{ session.id }}')
      .then(response => response.json())
      .then(data => {
        resultsDiv.innerHTML = data.suggestions.map(s =>
          '<div class="suggestion" onclick="selectSuggestion("' + s.text + '")">' + s.text + '</div>'
        ).join('');
      })
      .catch(error => console.error('Autocomplete error:', error));
  }, 300);
});
</script>`
      },
      suggest: {
        javascript: `// Suggest API implementation
function getSuggestions(query) {
  const params = new URLSearchParams({
    siteId: '${this.config.siteId}',
    resultsFormat: 'json',
    q: query,
    userId: getUserId(),
    sessionId: getSessionId()
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/api/suggest/query?' + params)
    .then(response => response.json())
    .then(data => {
      if (data.suggested) {
        console.log('Did you mean:', data.suggested);
        displaySuggestion(data.suggested);
      }
    })
    .catch(error => console.error('Suggest error:', error));
}`,
        shopify: `<!-- Shopify spell check implementation -->
<script>
function checkSpelling(query) {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/suggest/query?siteId=${this.config.siteId}&resultsFormat=json&q=' + query + '&userId={{ customer.id | default: "anonymous" }}&sessionId={{ session.id }}')
    .then(response => response.json())
    .then(data => {
      if (data.suggested && data.suggested !== query) {
        document.getElementById('suggestion').innerHTML =
          'Did you mean: <a href="/search?q=' + data.suggested + '">' + data.suggested + '</a>?';
      }
    });
}
</script>`
      },
      trending: {
        javascript: `// Trending API implementation
function getTrendingSearches() {
  const params = new URLSearchParams({
    siteId: '${this.config.siteId}',
    resultsFormat: 'json',
    userId: getUserId(),
    sessionId: getSessionId()
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/trending.json?' + params)
    .then(response => response.json())
    .then(data => {
      console.log('Trending searches:', data.trending);
      displayTrendingSearches(data.trending);
    })
    .catch(error => console.error('Trending error:', error));
}`,
        shopify: `<!-- Shopify trending searches implementation -->
<div class="trending-searches">
  <h3>Trending Searches</h3>
  <div id="trending-list"></div>
</div>

<script>
fetch('https://${this.config.siteId}.a.searchspring.io/api/search/trending.json?siteId=${this.config.siteId}&resultsFormat=json&userId={{ customer.id | default: "anonymous" }}&sessionId={{ session.id }}')
  .then(response => response.json())
  .then(data => {
    const trendingList = document.getElementById('trending-list');
    trendingList.innerHTML = data.trending.map(term =>
      '<a href="/search?q=' + term + '" class="trending-term">' + term + '</a>'
    ).join('');
  })
  .catch(error => console.error('Trending error:', error));
</script>`
      },
      recommendations: {
        javascript: `// Recommendations API implementation
function getRecommendations(options = {}) {
  const params = new URLSearchParams({
    siteId: '${this.config.siteId}',
    resultsFormat: 'json',
    userId: getUserId(),
    sessionId: getSessionId(),
    pageLoadId: getPageLoadId(),
    domain: window.location.origin,
    ...options
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/api/recommend/recommend.json?' + params)
    .then(response => response.json())
    .then(data => {
      console.log('Recommendations:', data.results);
      displayRecommendations(data.results);
    })
    .catch(error => console.error('Recommendations error:', error));
}`,
        shopify: `<!-- Shopify recommendations implementation -->
<div class="product-recommendations">
  <h3>Recommended Products</h3>
  <div id="recommendations-grid"></div>
</div>

<script>
fetch('https://${this.config.siteId}.a.searchspring.io/api/recommend/recommend.json?siteId=${this.config.siteId}&resultsFormat=json&userId={{ customer.id | default: "anonymous" }}&sessionId={{ session.id }}&domain={{ shop.permanent_domain }}')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = data.results.map(product =>
      '<div class="product-card"><img src="' + product.imageUrl + '"><h4>' + product.name + '</h4><p>$' + product.price + '</p></div>'
    ).join('');
  })
  .catch(error => console.error('Recommendations error:', error));
</script>`
      },
      finder: {
        javascript: `// Finder API implementation
function buildProductFinder() {
  const params = new URLSearchParams({
    siteId: '${this.config.siteId}',
    resultsFormat: 'json',
    userId: getUserId(),
    sessionId: getSessionId()
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/search.json?resultsPerPage=0&' + params)
    .then(response => response.json())
    .then(data => {
      console.log('Finder facets:', data.facets);
      buildFinderInterface(data.facets);
    })
    .catch(error => console.error('Finder error:', error));
}`,
        shopify: `<!-- Shopify product finder implementation -->
<div class="product-finder">
  <h3>Find Your Perfect Product</h3>
  <div id="finder-facets"></div>
  <div id="finder-results"></div>
</div>

<script>
fetch('https://${this.config.siteId}.a.searchspring.io/api/search/search.json?siteId=${this.config.siteId}&resultsPerPage=0&resultsFormat=json&userId={{ customer.id | default: "anonymous" }}&sessionId={{ session.id }}')
  .then(response => response.json())
  .then(data => {
    const facetsDiv = document.getElementById('finder-facets');
    facetsDiv.innerHTML = data.facets.map(facet =>
      '<div class="facet"><label>' + facet.label + '</label><select data-facet="' + facet.field + '">' +
      facet.values.map(v => '<option value="' + v.value + '">' + v.label + '</option>').join('') +
      '</select></div>'
    ).join('');
  })
  .catch(error => console.error('Finder error:', error));
</script>`
      },
      beacon: {
        javascript: `// Beacon API for Personalized Recommendations tracking
// NOTE: This is for recommendations beacon tracking, not basic product tracking
// For basic IntelliSuggest tracking use ss.track.* methods instead

function trackRecommendationEvent(events) {
  // Events should be an array of event objects
  fetch('https://beacon.searchspring.io/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events)
  })
  .then(response => response.json())
  .then(data => console.log('Recommendation events tracked:', data))
  .catch(error => console.error('Beacon error:', error));
}

// Example: Track profile render event
function trackProfileRender(profileId, tag, placement) {
  const events = [{
    category: "searchspring.recommendations.user-interactions",
    context: {
      pageLoadId: getPageLoadId(),
      userId: getUserId(),
      sessionId: getSessionId(),
      website: { trackingCode: '${this.config.siteId}' }
    },
    event: {
      context: { type: "product-recommendation", tag: tag, placement: placement },
      profile: { tag: tag, placement: placement, seed: [""] }
    },
    id: profileId,
    type: "profile.render"
  }];
  trackRecommendationEvent(events);
}`,
        shopify: `<!-- Shopify beacon tracking for Personalized Recommendations -->
<!-- NOTE: For basic product tracking, use IntelliSuggest ss.track.* methods instead -->
<script>
function trackRecommendationEvents(events) {
  fetch('https://beacon.searchspring.io/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events)
  })
  .then(response => response.json())
  .then(result => console.log('Recommendation events tracked:', result))
  .catch(error => console.error('Beacon error:', error));
}

// Example: Track recommendation profile impression
function trackProfileImpression(profileId, tag, placement) {
  const events = [{
    category: "searchspring.recommendations.user-interactions",
    context: {
      pageLoadId: generateUUID(),
      userId: '{{ customer.id | default: "anonymous" }}',
      sessionId: '{{ session.id }}',
      website: { trackingCode: '${this.config.siteId}' }
    },
    event: {
      context: { type: "product-recommendation", tag: tag, placement: placement },
      profile: { tag: tag, placement: placement, seed: [""] }
    },
    id: profileId,
    type: "profile.impression"
  }];
  trackRecommendationEvents(events);
}
</script>`
      },
      "bulk-index": {
        javascript: `// Bulk Index API implementation
function bulkIndexProducts(products) {
  const indexData = {
    siteId: '${this.config.siteId}',
    secretKey: 'YOUR_SECRET_KEY', // Replace with actual secret key
    products: products
  };

  fetch('https://index-api.searchspring.net/api/index/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indexData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Bulk index response:', data);
    if (data.batchId) {
      checkIndexStatus(data.batchId);
    }
  })
  .catch(error => console.error('Bulk index error:', error));
}`,
        php: `<?php
// PHP Bulk Index API implementation
function bulkIndexProducts($products) {
    $data = [
        'siteId' => '${this.config.siteId}',
        'secretKey' => 'YOUR_SECRET_KEY', // Replace with actual secret key
        'products' => $products
    ];

    $ch = curl_init('https://index-api.searchspring.net/api/index/bulk');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}
?>`
  clearTimeout(debounceTimer);
  const query = e.target.value;

  if (query.length >= 2) {
    debounceTimer = setTimeout(() => {
      fetchAutocomplete(query);
    }, 300);
  } else {
    hideSuggestions();
  }
});

function fetchAutocomplete(query) {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/autocomplete.json?siteId=${this.config.siteId}&resultsFormat=json&q=' + query)
    .then(response => response.json())
    .then(data => displaySuggestions(data))
    .catch(error => console.error('Autocomplete error:', error));
}`
      },
      recommendations: {
        javascript: `// Recommendations implementation
function loadRecommendations(tags, context = {}) {
  const params = new URLSearchParams({
    tags: tags.join(','),
    limits: '5,10',
    shopper: context.userId || '',
    ...context
  });

  fetch('https://${this.config.siteId}.a.searchspring.io/boost/${this.config.siteId}/recommend?' + params)
    .then(response => response.json())
    .then(data => {
      data.profiles.forEach(profile => {
        displayRecommendations(profile.tag, profile.results);
      });
    })
    .catch(error => console.error('Recommendations error:', error));
}`
      }
    };

    const apiCode = codeTemplates[api]?.[platform] || codeTemplates[api]?.javascript;

    if (!apiCode) {
      return {
        content: [{
          type: "text",
          text: `Code generation for ${api} API on ${platform} platform is not yet available. Use the searchspring_api_guide tool to get implementation guidance.`
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: `# ${api.toUpperCase()} API Code for ${platform.toUpperCase()}

${useCase ? `**Use Case**: ${useCase}\n\n` : ''}**Generated Implementation:**

\`\`\`${platform === 'javascript' ? 'javascript' : 'html'}
${apiCode}
\`\`\`

**Next Steps:**
1. Customize the code for your specific needs
2. Add error handling and user feedback
3. Test the implementation thoroughly
4. Use the code validator tool to check your implementation

**Documentation**: https://docs.searchspring.com/api/${api}/`
      }]
    };
  }

  private async generateTrackingCode(platform: string, eventType: string) {
    const sku = "PRODUCT_SKU";
    const price = 99.99;
    const quantity = 1;

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
    const code = platformCode?.[eventType] || platformCode?.product || implementations.custom?.product || 'Code generation not available';

    const documentationUrls: Record<string, string> = {
      shopify: "https://help.searchspring.net/hc/en-us/articles/206972376-IntelliSuggest-Tracking-in-Shopify",
      custom: "https://help.searchspring.net/hc/en-us/articles/201185129-Adding-IntelliSuggest-Tracking"
    };

    return {
      content: [
        {
          type: "text",
          text: `IntelliSuggest Tracking Implementation for ${platform.toUpperCase()} - ${eventType} event:

IMPORTANT: Include IntelliSuggest script first:
<script src="//cdn.searchspring.net/intellisuggest/is.min.js"></script>

Implementation Code:
${code}

Documentation: ${documentationUrls[platform] || documentationUrls.custom}

Requirements:
- _isuid cookie must be set
- IntelliSuggest script must NOT have defer/async attributes
- SKU values must match Searchspring indexed product SKU core field`,
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
    if (codeType === "tracking" || codeType === "beacon") {
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

    if (codeType === "search" || codeType === "autocomplete" || codeType === "suggest" || codeType === "trending" || codeType === "finder" || codeType === "recommendations") {
      // Check for API endpoint
      if (!code.includes(".a.searchspring.io")) {
        validationResults.push("❌ Missing Searchspring API endpoint (should include .a.searchspring.io)");
      } else {
        validationResults.push("✅ Searchspring API endpoint detected");
      }

      // Check for required parameters
      if (!code.includes("siteId")) {
        validationResults.push("❌ Missing required 'siteId' parameter");
      } else {
        validationResults.push("✅ siteId parameter detected");
      }

      if (!code.includes("userId") && !code.includes("sessionId")) {
        warnings.push("⚠️  Missing tracking parameters (userId, sessionId) - these are required for analytics");
      }

      // API-specific validations
      if (codeType === "search" && !code.includes("q=")) {
        validationResults.push("❌ Search API missing query parameter 'q'");
      }

      if (codeType === "autocomplete" && !code.includes("debounce")) {
        warnings.push("⚠️  Consider implementing debouncing for autocomplete to reduce API calls");
      }

      if (codeType === "recommendations" && !code.includes("pageLoadId")) {
        warnings.push("⚠️  Recommendations work better with pageLoadId parameter");
      }

      // Check for error handling
      if (!code.includes(".catch") && !code.includes("try")) {
        warnings.push("⚠️  No error handling detected - consider adding .catch() or try/catch");
      }
    }

    if (codeType === "beacon") {
      // Check for beacon endpoint
      if (!code.includes("beacon.searchspring.io")) {
        validationResults.push("❌ Missing Beacon API endpoint (should be beacon.searchspring.io)");
      } else {
        validationResults.push("✅ Beacon API endpoint detected");
      }

      // Check for POST method
      if (!code.includes("POST")) {
        validationResults.push("❌ Beacon API requires POST method");
      }

      // Check for required beacon fields
      if (!code.includes("type")) {
        validationResults.push("❌ Beacon tracking missing required 'type' field");
      }
    }

    if (codeType === "bulk-index") {
      // Check for bulk index endpoint
      if (!code.includes("index-api.searchspring.net")) {
        validationResults.push("❌ Missing Bulk Index API endpoint (should be index-api.searchspring.net)");
      } else {
        validationResults.push("✅ Bulk Index API endpoint detected");
      }

      // Check for secret key
      if (!code.includes("secretKey")) {
        validationResults.push("❌ Bulk Index API requires 'secretKey' parameter");
      }

      // Check for products array
      if (!code.includes("products")) {
        validationResults.push("❌ Bulk Index API missing 'products' array");
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
      troubleshooting = `

Troubleshooting for: "${issue}"
`;

      if (issue.toLowerCase().includes("not working") || issue.toLowerCase().includes("not tracking")) {
        troubleshooting += `Common causes:
- IntelliSuggest script not loaded or blocked by ad blockers
- Script placed in wrong location (should be in <head> or before tracking calls)
- Missing _isuid cookie (check browser dev tools > Application > Cookies)
- SKU values don't match Searchspring indexed product SKU field
- Browser console errors preventing script execution
`;
      }

      if (issue.toLowerCase().includes("undefined") || issue.toLowerCase().includes("is not defined")) {
        troubleshooting += `Script loading issue:
- Ensure IntelliSuggest script loads before your tracking code
- Remove async/defer attributes from the IntelliSuggest script tag
- Check browser console for script loading errors
`;
      }

      if (issue.toLowerCase().includes("search") || issue.toLowerCase().includes("results")) {
        troubleshooting += `API integration issues:
- Verify siteId is correct: ${this.config.siteId}
- Check CORS settings if calling from browser
- Ensure all required parameters are included
- Check network tab for API response errors
`;
      }
    }

    const summary = `Code Validation Results for ${codeType.toUpperCase()} implementation${platform ? ` on ${platform.toUpperCase()}` : ''}

${validationResults.join('\n')}

${warnings.length > 0 ? `Warnings:\n${warnings.join('\n')}\n` : ''}${suggestions.length > 0 ? `Suggestions:\n${suggestions.join('\n')}\n` : ''}${troubleshooting}
For additional support:
- Documentation: https://docs.searchspring.com/
- Support: https://help.searchspring.net/
- Implementation guides: https://help.searchspring.net/hc/en-us/sections/201185149`;

    return {
      content: [
        {
          type: "text",
          text: summary,
        },
      ],
    };
  }
}