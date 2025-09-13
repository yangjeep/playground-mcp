#!/usr/bin/env node

// Simple test to validate the server can be imported and configured
import { validateConfig } from "../dist/config.js";
import { SearchspringClient } from "../dist/searchspring-client.js";

console.log("Testing Searchspring MCP Server...");

// Test 1: Configuration validation with missing required fields
console.log("\n1. Testing configuration validation (should fail with missing credentials):");
try {
  validateConfig();
  console.log("❌ Config validation should have failed");
  process.exit(1);
} catch (error) {
  console.log("✅ Config validation correctly failed:", error.message.split('\n')[0]);
}

// Test 2: Configuration validation with provided credentials
console.log("\n2. Testing configuration with mock credentials:");
process.env.SEARCHSPRING_SITE_ID = "test123";

try {
  const config = validateConfig();
  console.log("✅ Config validation passed with mock credentials");
  console.log("   - Site ID:", config.siteId);
  console.log("   - Timeout:", config.timeout);
  if (config.secretKey) {
    console.log("   - Secret Key:", config.secretKey.substring(0, 4) + "...");
  }
} catch (error) {
  console.log("❌ Config validation failed:", error.message);
  process.exit(1);
}

// Test 3: SearchspringClient instantiation
console.log("\n3. Testing SearchspringClient instantiation:");
try {
  const config = validateConfig();
  const client = new SearchspringClient(config);
  console.log("✅ SearchspringClient instantiated successfully");
} catch (error) {
  console.log("❌ SearchspringClient instantiation failed:", error.message);
  process.exit(1);
}

console.log("\n✅ All tests passed! Server is ready to use.");
console.log("\nTo use the server, set your actual Searchspring credentials:");
console.log("- SEARCHSPRING_SITE_ID=your_actual_site_id");
console.log("- SEARCHSPRING_SECRET_KEY=your_secret_key (optional, for bulk indexing)");