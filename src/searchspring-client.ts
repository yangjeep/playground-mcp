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
  codeType: "tracking" | "search" | "autocomplete" | "recommendations";
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
          "Always include tracking parameters (userId, sessionId, pageLoadId)",
          "Use background filters (bgfilter.*) for permanent filtering",
          "Implement proper error handling",
          "Use debouncing for real-time search",
          "Include pagination for large result sets"
        ]
      },
      autocomplete: {
        name: "Autocomplete API",
        description: "Real-time search suggestions as user types",
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
    }, 300);
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
        description: "Faceted search for building product finder interfaces",
        endpoint: `https://${this.config.siteId}.a.searchspring.io/api/search/finder.json`,
        requiredParams: ["siteId", "resultsPerPage"],
        optionalParams: ["filter.*", "bgfilter.*", "includedFacets", "excludedFacets"],
        example: `function getFacets() {
  fetch('https://${this.config.siteId}.a.searchspring.io/api/search/finder.json?siteId=${this.config.siteId}&resultsPerPage=0&filter.category=shoes')
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
          description: "Unique identifier for tracking user behavior",
          type: "string",
          example: "user-12345 or anonymous-uuid",
          bestPractices: [
            "Generate persistent UUID for anonymous users",
            "Use actual user ID for logged-in users",
            "Store in localStorage/cookie for consistency",
            "Required for analytics and personalization"
          ],
          useCases: ["User tracking", "Personalization", "Analytics"],
          relatedParams: ["sessionId", "pageLoadId", "shopper"]
        },
        sessionId: {
          description: "Session identifier for tracking user journey",
          type: "string",
          example: "session-67890",
          bestPractices: [
            "Generate new UUID per session",
            "Persist throughout user's visit",
            "Reset on browser close/new session",
            "Used for analytics and behavior tracking"
          ],
          useCases: ["Session tracking", "User journey analysis", "Analytics"],
          relatedParams: ["userId", "pageLoadId"]
        },
        pageLoadId: {
          description: "Unique identifier for each page load/search",
          type: "string",
          example: "page-abc123",
          bestPractices: [
            "Generate new UUID for each search/page load",
            "Used for tracking specific search interactions",
            "Important for click tracking and analytics",
            "Don't reuse across different searches"
          ],
          useCases: ["Search tracking", "Click analytics", "Performance monitoring"],
          relatedParams: ["userId", "sessionId"]
        }
      },
      autocomplete: {
        q: {
          description: "Partial search query for autocomplete suggestions",
          type: "string",
          example: "runn (user typing 'running')",
          bestPractices: [
            "Start suggestions after 2+ characters",
            "Use debouncing (300ms delay)",
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
    const code = platformCode[eventType] || platformCode.product;

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