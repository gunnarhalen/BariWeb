import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /healthcheck", () => {
  it("should return status 200 with healthy status message", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      status: "ok",
      message: "Service is healthy",
    });
    expect(data.timestamp).toBeDefined();
    expect(typeof data.timestamp).toBe("string");
  });
});
