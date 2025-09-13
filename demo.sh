#!/bin/bash

# Searchspring Integration Assistant MCP Server Demo
# This demo showcases how the MCP server helps with Searchspring API integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Demo configuration
SITE_ID="demo123"
export SEARCHSPRING_SITE_ID="$SITE_ID"

echo -e "${BLUE}================================================================================================${NC}"
echo -e "${BLUE}                    Searchspring Integration Assistant MCP Server Demo${NC}"
echo -e "${BLUE}================================================================================================${NC}"
echo ""
echo -e "${CYAN}This demo showcases how the MCP server helps developers implement Searchspring APIs correctly.${NC}"
echo -e "${CYAN}Instead of making direct API calls, it provides implementation guidance and code validation.${NC}"
echo ""

# Check if the server is built
if [ ! -f "dist/index.js" ]; then
    echo -e "${YELLOW}Building the MCP server...${NC}"
    npm run build
    echo ""
fi

# Function to simulate MCP tool call
call_mcp_tool() {
    local tool_name="$1"
    local params="$2"

    echo -e "${GREEN}🔧 MCP Tool Call: ${tool_name}${NC}"
    echo -e "${PURPLE}Parameters: ${params}${NC}"
    echo ""

    # Create a temporary Node.js script to simulate the MCP call
    cat > temp_mcp_call.mjs << EOF
import { SearchspringClient } from './dist/searchspring-client.js';
import { validateConfig } from './dist/config.js';

async function demo() {
    try {
        const config = validateConfig();
        const client = new SearchspringClient(config);

        const params = ${params};
        const result = await client.${tool_name}(params);

        console.log(result.content[0].text);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

demo();
EOF

    node temp_mcp_call.mjs
    rm temp_mcp_call.mjs
    echo ""
    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────────────────────${NC}"
    echo ""
}

# Demo Scenario 1: Search API Implementation Guidance
echo -e "${YELLOW}📋 DEMO SCENARIO 1: Getting Search API Implementation Guidance${NC}"
echo -e "${CYAN}A developer wants to implement product search with filtering and pagination.${NC}"
echo ""

call_mcp_tool "search" '{
    "query": "running shoes",
    "page": 1,
    "resultsPerPage": 20,
    "filters": {"brand": ["Nike", "Adidas"], "color": "blue"},
    "sort": {"price": "asc"}
}'

# Demo Scenario 2: Platform-Specific Code Generation
echo -e "${YELLOW}📋 DEMO SCENARIO 2: Platform-Specific Implementation Code${NC}"
echo -e "${CYAN}A Shopify merchant needs IntelliSuggest product tracking code.${NC}"
echo ""

call_mcp_tool "getPlatformImplementation" '{
    "platform": "shopify",
    "eventType": "product",
    "sku": "DEMO-SHOE-123",
    "price": 99.99
}'

# Demo Scenario 3: Autocomplete Implementation
echo -e "${YELLOW}📋 DEMO SCENARIO 3: Autocomplete Implementation Guidance${NC}"
echo -e "${CYAN}A developer needs to add real-time search suggestions with proper debouncing.${NC}"
echo ""

call_mcp_tool "autocomplete" '{
    "query": "runn",
    "resultsPerPage": 8
}'

# Create sample code files for validation demo
echo -e "${YELLOW}📋 DEMO SCENARIO 4: Code Validation and Troubleshooting${NC}"
echo -e "${CYAN}A developer has implemented tracking but it's not working properly.${NC}"
echo ""

# Create sample implementation files
mkdir -p demo_files

# Good implementation
cat > demo_files/good_tracking.html << 'EOF'
<script src="//cdn.searchspring.net/intellisuggest/is.min.js"></script>
<script>
if (typeof ss != 'undefined') {
  ss.track.product.view({
    sku: 'PRODUCT-123',
    name: 'Running Shoes',
    price: 99.99,
    category: 'footwear'
  });
}
</script>
EOF

# Problematic implementation
cat > demo_files/problematic_tracking.html << 'EOF'
<script async src="//cdn.searchspring.net/intellisuggest/is.min.js"></script>
<script>
ss.track.product.view({
  name: 'Running Shoes',
  price: 99.99
});
</script>
EOF

echo -e "${GREEN}Created sample implementation files:${NC}"
echo -e "${CYAN}  - demo_files/good_tracking.html (proper implementation)${NC}"
echo -e "${CYAN}  - demo_files/problematic_tracking.html (has issues)${NC}"
echo ""

# Validate good implementation
echo -e "${GREEN}✅ Validating GOOD implementation:${NC}"
GOOD_CODE=$(cat demo_files/good_tracking.html)
call_mcp_tool "validateCode" "{
    \"code\": $(echo "$GOOD_CODE" | jq -Rs .),
    \"codeType\": \"tracking\",
    \"platform\": \"custom\"
}"

# Validate problematic implementation
echo -e "${RED}❌ Validating PROBLEMATIC implementation:${NC}"
BAD_CODE=$(cat demo_files/problematic_tracking.html)
call_mcp_tool "validateCode" "{
    \"code\": $(echo "$BAD_CODE" | jq -Rs .),
    \"codeType\": \"tracking\",
    \"platform\": \"custom\",
    \"issue\": \"Tracking events not appearing in analytics\"
}"

# Demo Scenario 5: Trending API Implementation
echo -e "${YELLOW}📋 DEMO SCENARIO 5: Trending Terms Implementation${NC}"
echo -e "${CYAN}A developer wants to display popular search terms on the homepage.${NC}"
echo ""

call_mcp_tool "trending" '{
    "limit": 6
}'

# Demo Scenario 6: IntelliSuggest Tracking Guidance
echo -e "${YELLOW}📋 DEMO SCENARIO 6: IntelliSuggest Event Tracking${NC}"
echo -e "${CYAN}A developer needs to track cart addition events for analytics.${NC}"
echo ""

call_mcp_tool "trackIntelliSuggestEvent" '{
    "type": "cart",
    "event": {
        "sku": "DEMO-PRODUCT-456",
        "name": "Athletic Shorts",
        "price": 29.99,
        "quantity": 2,
        "category": "apparel"
    }
}'

# Interactive demo section
echo -e "${BLUE}================================================================================================${NC}"
echo -e "${GREEN}🎉 Demo Complete! Interactive Testing Available${NC}"
echo -e "${BLUE}================================================================================================${NC}"
echo ""
echo -e "${YELLOW}Want to test the MCP server interactively?${NC}"
echo ""
echo -e "${CYAN}1. Start the MCP server:${NC}"
echo -e "   ${GREEN}npm start${NC}"
echo ""
echo -e "${CYAN}2. In another terminal, you can test individual tools:${NC}"
echo -e "   ${GREEN}echo '{\"tool\": \"searchspring_search\", \"params\": {\"query\": \"test\"}}' | node dist/index.js${NC}"
echo ""
echo -e "${CYAN}3. Or integrate with MCP-compatible clients like Claude Desktop:${NC}"
echo -e "   ${GREEN}Add this server to your claude_desktop_config.json${NC}"
echo ""
echo -e "${CYAN}4. Sample files created in demo_files/ for testing code validation.${NC}"
echo ""
echo -e "${PURPLE}Configuration used:${NC}"
echo -e "${PURPLE}  SEARCHSPRING_SITE_ID: $SITE_ID${NC}"
echo ""
echo -e "${BLUE}For more information, see README.md and CLAUDE.md${NC}"
echo ""

# Cleanup option
read -p "Remove demo files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf demo_files
    echo -e "${GREEN}Demo files cleaned up.${NC}"
else
    echo -e "${CYAN}Demo files kept in demo_files/ for further testing.${NC}"
fi

echo ""
echo -e "${GREEN}Thank you for trying the Searchspring Integration Assistant MCP Server! 🚀${NC}"