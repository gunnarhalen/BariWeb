import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkDatabaseHealth,
  getHealthStatus,
} from "../healthcheckService";
import { Firestore } from "firebase/firestore";

vi.mock("@/config/firebase", () => ({
  db: {} as Firestore,
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
}));

import { getDocs } from "firebase/firestore";

describe("healthcheckService", () => {
  const mockDb = {} as Firestore;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkDatabaseHealth", () => {
    it("returns healthy status with latency when Firestore query succeeds", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        empty: true,
        docs: [],
      } as unknown as Awaited<ReturnType<typeof getDocs>>);

      const result = await checkDatabaseHealth(mockDb);

      expect(result.status).toBe("healthy");
      expect(typeof result.latencyMs).toBe("number");
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
      expect(result.message).toBeUndefined();
    });

    it("returns unhealthy status when Firestore query fails", async () => {
      vi.mocked(getDocs).mockRejectedValueOnce(new Error("Firebase unavailable"));

      const result = await checkDatabaseHealth(mockDb);

      expect(result.status).toBe("unhealthy");
      expect(result.message).toBe("Database check failed");
      expect(typeof result.latencyMs).toBe("number");
    });

    it("returns unhealthy status when database client is not initialized", async () => {
      const result = await checkDatabaseHealth(null as unknown as Firestore);

      expect(result.status).toBe("unhealthy");
      expect(result.message).toBe("Database client is not initialized");
    });

    it("returns unhealthy status on timeout", async () => {
      vi.mocked(getDocs).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      );

      const result = await checkDatabaseHealth(mockDb, 10);

      expect(result.status).toBe("unhealthy");
      expect(result.message).toBe("Database response timed out");
    });
  });

  describe("getHealthStatus", () => {
    it("returns aggregated healthy status when all services are healthy", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        empty: true,
        docs: [],
      } as unknown as Awaited<ReturnType<typeof getDocs>>);

      const result = await getHealthStatus({ firestoreInstance: mockDb });

      expect(result.status).toBe("healthy");
      expect(result.services.database.status).toBe("healthy");
      expect(result.timestamp).toBeDefined();
      expect(typeof result.uptime).toBe("number");
      expect(result.environment).toBeDefined();
      expect(result.version).toBeDefined();
    });

    it("returns aggregated unhealthy status when database check fails", async () => {
      vi.mocked(getDocs).mockRejectedValueOnce(new Error("Connection refused"));

      const result = await getHealthStatus({ firestoreInstance: mockDb });

      expect(result.status).toBe("unhealthy");
      expect(result.services.database.status).toBe("unhealthy");
    });
  });
});
