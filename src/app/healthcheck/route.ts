import { NextResponse } from "next/server";
import { performHealthCheck } from "@/services/healthCheckService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await performHealthCheck();

    const httpStatus = health.status === "unhealthy" ? 503 : 200;

    return NextResponse.json(health, {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno ao processar verificação de saúde";

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: typeof process !== "undefined" && typeof process.uptime === "function" ? process.uptime() : 0,
        environment: process.env.NODE_ENV || "development",
        version: "0.1.0",
        checks: {
          error: {
            status: "down",
            message: errorMessage,
          },
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
