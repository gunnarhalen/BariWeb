import { NextRequest, NextResponse } from "next/server";
import { checkHealth } from "@/services/healthcheckService";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const healthData = await checkHealth();

    if (healthData.status === "error") {
      return NextResponse.json(healthData, { status: 503 });
    }

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    const errorResult = {
      status: "error" as const,
      timestamp: new Date().toISOString(),
      checks: {
        firebase: {
          status: "error" as const,
          auth: {
            status: "error" as const,
            message: error instanceof Error ? error.message : "Erro desconhecido",
          },
          firestore: {
            status: "error" as const,
            message: error instanceof Error ? error.message : "Erro desconhecido",
          },
        },
      },
    };

    return NextResponse.json(errorResult, { status: 503 });
  }
}
