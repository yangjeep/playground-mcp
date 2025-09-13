import { z } from "zod";

// Configuration schema using Zod for validation
const SearchspringConfigSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  siteId: z.string().min(1, "Site ID is required"),
  baseUrl: z.string().url().optional().default("https://api.searchspring.net"),
  timeout: z.number().positive().optional().default(10000),
});

export type SearchspringConfig = z.infer<typeof SearchspringConfigSchema>;

export function validateConfig(): SearchspringConfig {
  const config = {
    apiKey: process.env.SEARCHSPRING_API_KEY,
    siteId: process.env.SEARCHSPRING_SITE_ID,
    baseUrl: process.env.SEARCHSPRING_BASE_URL,
    timeout: process.env.SEARCHSPRING_TIMEOUT ? parseInt(process.env.SEARCHSPRING_TIMEOUT) : undefined,
  };

  try {
    return SearchspringConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors.map(err => err.path.join(".")).join(", ");
      throw new Error(
        `Invalid Searchspring configuration. Missing or invalid fields: ${missingFields}\n\n` +
        "Please ensure the following environment variables are set:\n" +
        "- SEARCHSPRING_API_KEY: Your Searchspring API key\n" +
        "- SEARCHSPRING_SITE_ID: Your Searchspring site ID\n" +
        "- SEARCHSPRING_BASE_URL: (optional) Custom API base URL\n" +
        "- SEARCHSPRING_TIMEOUT: (optional) Request timeout in milliseconds"
      );
    }
    throw error;
  }
}

export const DEFAULT_CONFIG: Partial<SearchspringConfig> = {
  baseUrl: "https://api.searchspring.net",
  timeout: 10000,
};