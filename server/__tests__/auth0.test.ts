import { describe, it, expect } from "vitest";

/**
 * Auth0 Credentials Validation Test
 * 
 * Validates that Auth0 Management API token is valid and has required permissions
 */

describe("Auth0 Configuration", () => {
  it("should have valid AUTH0_MANAGEMENT_API_TOKEN", async () => {
    const token = process.env.AUTH0_MANAGEMENT_API_TOKEN;
    const domain = process.env.VITE_AUTH0_DOMAIN;

    expect(token).toBeDefined();
    expect(token).toMatch(/^eyJ/); // JWT format
    expect(domain).toBeDefined();

    // Test API call to Auth0 Management API
    const response = await fetch(`https://${domain}/api/v2/users?per_page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBeLessThan(500); // Should not be server error
    
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Auth0 token is invalid or lacks permissions. Status: ${response.status}`);
    }

    expect(response.ok).toBe(true);
  }, 10000); // 10 second timeout for API call

  it("should have valid AUTH0_CLIENT_SECRET", () => {
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    expect(clientSecret).toBeDefined();
    expect(clientSecret.length).toBeGreaterThan(20);
  });

  it("should have valid ENCRYPTION_MASTER_KEY", () => {
    const encryptionKey = process.env.ENCRYPTION_MASTER_KEY;
    expect(encryptionKey).toBeDefined();
    expect(encryptionKey.length).toBeGreaterThan(40); // Base64 encoded 256-bit key
  });
});
