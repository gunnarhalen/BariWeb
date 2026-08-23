import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/config/firebase", () => ({
  default: { name: "[DEFAULT]" },
  db: { type: "firestore" },
  auth: {},
}));

vi.mock("firebase/app", () => ({
  getApps: vi.fn(() => [{ name: "[DEFAULT]" }]),
  initializeApp: vi.fn(),
  getApp: vi.fn(),
}));

import { GET } from "./route";

describe("GET /healthcheck", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FIREBASE_API_KEY: "fake-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "fake.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "fake-project-id",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "fake.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abcdef",
      NODE_ENV: "test",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it("should return status 200 and healthy status when all checks pass", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("healthy");
    expect(body.environment).toBe("test");
    expect(typeof body.uptime).toBe("number");
    expect(typeof body.timestamp).toBe("string");
    expect(body.checks.environmentVariables.status).toBe("ok");
    expect(body.checks.firebase.status).toBe("ok");
    expect(body.checks.firebase.databaseReady).toBe(true);
  });

  it("should return status 503 and list missing variables when required env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("unhealthy");
    expect(body.checks.environmentVariables.status).toBe("error");
    expect(body.checks.environmentVariables.missing).toContain(
      "NEXT_PUBLIC_FIREBASE_API_KEY"
    );
    expect(body.checks.environmentVariables.missing).toContain(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    );
  });

  it("should include cache control headers preventing caching", async () => {
    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe(
      "no-store, no-cache, must-revalidate"
    );
  });
});
