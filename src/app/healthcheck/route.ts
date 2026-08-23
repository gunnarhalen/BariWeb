import { NextResponse } from "next/server";
import { getHealthStatus } from "@/services/healthcheckService";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const health = await getHealthStatus();
    const statusCode = health.status === "healthy" ? 200 : 503;

    return NextResponse.json(health, {
      status: statusCode,
      headers: NO_CACHE_HEADERS,
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        message: "Health check encountered an unexpected error",
      },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}

export async function HEAD() {
  try {
    const health = await getHealthStatus();
    const statusCode = health.status === "healthy" ? 200 : 503;

    return new Response(null, {
      status: statusCode,
      headers: NO_CACHE_HEADERS,
    });
  } catch {
    return new Response(null, {
      status: 500,
      headers: NO_CACHE_HEADERS,
    });
  }
}
