import { z } from "zod";

// Configuration schema using Zod for validation
const SearchspringConfigSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
  secretKey: z.string().min(1, "Secret key is required for bulk indexing").optional(),
  timeout: z.number().positive().optional().default(10000),
});

export type SearchspringConfig = z.infer<typeof SearchspringConfigSchema>;

export function validateConfig(): SearchspringConfig {
  const config = {
    siteId: process.env.SEARCHSPRING_SITE_ID,
    secretKey: process.env.SEARCHSPRING_SECRET_KEY,
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
        "- SEARCHSPRING_SITE_ID: Your Searchspring site ID\n" +
        "- SEARCHSPRING_SECRET_KEY: (optional) Your Searchspring secret key for bulk indexing\n" +
        "- SEARCHSPRING_TIMEOUT: (optional) Request timeout in milliseconds"
      );
    }
    throw error;
  }
}

export const DEFAULT_CONFIG: Partial<SearchspringConfig> = {
  timeout: 10000,
};