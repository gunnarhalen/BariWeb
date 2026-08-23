import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, HEAD } from "../route";
import * as healthcheckService from "@/services/healthcheckService";

vi.mock("@/services/healthcheckService", () => ({
  getHealthStatus: vi.fn(),
}));

describe("/healthcheck route handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("returns 200 OK with no-cache headers when healthy", async () => {
      const mockHealthyResponse: healthcheckService.HealthCheckResponse = {
        status: "healthy",
        timestamp: "2026-08-23T12:00:00.000Z",
        uptime: 120,
        environment: "test",
        version: "0.1.0",
        services: {
          database: {
            status: "healthy",
            latencyMs: 15,
          },
        },
      };

      vi.mocked(healthcheckService.getHealthStatus).mockResolvedValueOnce(mockHealthyResponse);

      const response = await GET();
      expect(response.status).toBe(200);
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");

      const body = await response.json();
      expect(body).toEqual(mockHealthyResponse);
      expect(body.status).toBe("healthy");
    });

    it("returns 503 Service Unavailable when unhealthy", async () => {
      const mockUnhealthyResponse: healthcheckService.HealthCheckResponse = {
        status: "unhealthy",
        timestamp: "2026-08-23T12:00:00.000Z",
        uptime: 120,
        environment: "test",
        version: "0.1.0",
        services: {
          database: {
            status: "unhealthy",
            message: "Database check failed",
          },
        },
      };

      vi.mocked(healthcheckService.getHealthStatus).mockResolvedValueOnce(mockUnhealthyResponse);

      const response = await GET();
      expect(response.status).toBe(503);
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");

      const body = await response.json();
      expect(body).toEqual(mockUnhealthyResponse);
      expect(body.status).toBe("unhealthy");
    });

    it("returns 500 Internal Server Error if unexpected exception occurs", async () => {
      vi.mocked(healthcheckService.getHealthStatus).mockRejectedValueOnce(
        new Error("Unexpected failure")
      );

      const response = await GET();
      expect(response.status).toBe(500);
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");

      const body = await response.json();
      expect(body.status).toBe("unhealthy");
      expect(body.message).toBe("Health check encountered an unexpected error");
    });
  });

  describe("HEAD", () => {
    it("returns 200 OK for HEAD request when healthy", async () => {
      vi.mocked(healthcheckService.getHealthStatus).mockResolvedValueOnce({
        status: "healthy",
        timestamp: "2026-08-23T12:00:00.000Z",
        uptime: 100,
        environment: "test",
        version: "0.1.0",
        services: {
          database: { status: "healthy" },
        },
      });

      const response = await HEAD();
      expect(response.status).toBe(200);
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");
      expect(response.body).toBeNull();
    });

    it("returns 503 Service Unavailable for HEAD request when unhealthy", async () => {
      vi.mocked(healthcheckService.getHealthStatus).mockResolvedValueOnce({
        status: "unhealthy",
        timestamp: "2026-08-23T12:00:00.000Z",
        uptime: 100,
        environment: "test",
        version: "0.1.0",
        services: {
          database: { status: "unhealthy" },
        },
      });

      const response = await HEAD();
      expect(response.status).toBe(503);
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");
      expect(response.body).toBeNull();
    });
  });
});
