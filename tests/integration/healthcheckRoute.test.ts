import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/healthcheck/route";
import * as healthService from "@/services/healthCheckService";
import type { HealthCheckResponse } from "@/types/health";

describe("GET /healthcheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar HTTP 200 e payload de status quando o sistema estiver saudável", async () => {
    const mockHealthResponse: HealthCheckResponse = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: 120,
      environment: "test",
      version: "0.1.0",
      checks: {
        database: {
          status: "up",
          latencyMs: 15,
          message: "Conexão com Firestore estabelecida com sucesso",
        },
        firebaseConfig: {
          status: "up",
          message: "Configuração do Firebase validada com sucesso",
          details: { configured: true, projectId: "test-project" },
        },
      },
    };

    vi.spyOn(healthService, "performHealthCheck").mockResolvedValue(mockHealthResponse);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");
    expect(data.status).toBe("healthy");
    expect(data.checks.database.status).toBe("up");
    expect(data.checks.firebaseConfig.status).toBe("up");
  });

  it("deve retornar HTTP 503 quando um serviço essencial estiver com status 'unhealthy'", async () => {
    const mockHealthResponse: HealthCheckResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: 120,
      environment: "test",
      version: "0.1.0",
      checks: {
        database: {
          status: "down",
          latencyMs: 5000,
          message: "Timeout de conexão com o banco",
        },
        firebaseConfig: {
          status: "up",
          message: "Configuração do Firebase validada com sucesso",
        },
      },
    };

    vi.spyOn(healthService, "performHealthCheck").mockResolvedValue(mockHealthResponse);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate");
    expect(data.status).toBe("unhealthy");
    expect(data.checks.database.status).toBe("down");
  });

  it("deve tratar erros não tratados e retornar HTTP 503 com payload de erro", async () => {
    vi.spyOn(healthService, "performHealthCheck").mockRejectedValue(new Error("Falha catastrófica"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("unhealthy");
    expect(data.checks.error.status).toBe("down");
    expect(data.checks.error.message).toBe("Falha catastrófica");
  });
});
