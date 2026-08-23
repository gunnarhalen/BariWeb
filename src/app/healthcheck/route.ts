import { NextResponse } from "next/server";
import { getApps } from "firebase/app";
import app, { db } from "@/config/firebase";

export const dynamic = "force-dynamic";

interface HealthcheckResponse {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  environment: string;
  checks: {
    environmentVariables: {
      status: "ok" | "error";
      missing?: string[];
    };
    firebase: {
      status: "ok" | "error";
      appName?: string;
      databaseReady: boolean;
      error?: string;
    };
  };
}

export async function GET() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  const envCheckPassed = missingEnvVars.length === 0;

  let firebaseCheckPassed = false;
  let firebaseError: string | undefined;
  let appName: string | undefined;
  let databaseReady = false;

  try {
    const apps = getApps();
    if (apps.length > 0 || app) {
      appName = app?.name || (apps[0] && apps[0].name) || "[DEFAULT]";
      databaseReady = Boolean(db);
      firebaseCheckPassed = true;
    } else {
      firebaseError = "No Firebase app instances found";
    }
  } catch (err) {
    firebaseCheckPassed = false;
    firebaseError =
      err instanceof Error ? err.message : "Failed to verify Firebase instance";
  }

  const isHealthy = envCheckPassed && firebaseCheckPassed;

  const responseBody: HealthcheckResponse = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    checks: {
      environmentVariables: {
        status: envCheckPassed ? "ok" : "error",
        ...(missingEnvVars.length > 0 ? { missing: missingEnvVars } : {}),
      },
      firebase: {
        status: firebaseCheckPassed ? "ok" : "error",
        appName,
        databaseReady,
        ...(firebaseError ? { error: firebaseError } : {}),
      },
    },
  };

  return NextResponse.json(responseBody, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
