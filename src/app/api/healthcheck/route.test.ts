import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/healthcheck", () => {
  it("should return 200 OK with status ok and timestamp", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(typeof data.uptime).toBe("number");
    expect(typeof data.timestamp).toBe("string");
    expect(new Date(data.timestamp).getTime()).not.toBeNaN();
  });
});
