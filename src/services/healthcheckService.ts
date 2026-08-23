import { db } from "@/config/firebase";
import { collection, getDocs, limit, query, Firestore } from "firebase/firestore";

export type HealthStatus = "healthy" | "unhealthy" | "degraded";

export interface ComponentHealth {
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: ComponentHealth;
  };
}

const DEFAULT_TIMEOUT_MS = 3000;

/**
 * Checks Firebase Firestore connectivity with a timeout safety net.
 * Never leaks credentials or sensitive internal error messages.
 */
export async function checkDatabaseHealth(
  firestoreInstance: Firestore = db,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ComponentHealth> {
  const startTime = Date.now();

  try {
    if (!firestoreInstance) {
      return {
        status: "unhealthy",
        message: "Database client is not initialized",
      };
    }

    const checkPromise = (async () => {
      // Query 1 document to verify connectivity
      const pingQuery = query(collection(firestoreInstance, "health_checks"), limit(1));
      await getDocs(pingQuery);
    })();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database check timeout")), timeoutMs)
    );

    await Promise.race([checkPromise, timeoutPromise]);

    const latencyMs = Date.now() - startTime;
    return {
      status: "healthy",
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const isTimeout = error instanceof Error && error.message.includes("timeout");

    return {
      status: "unhealthy",
      latencyMs,
      message: isTimeout ? "Database response timed out" : "Database check failed",
    };
  }
}

/**
 * Aggregates health status of the application and all critical dependencies.
 */
export async function getHealthStatus(
  options?: {
    firestoreInstance?: Firestore;
    timeoutMs?: number;
  }
): Promise<HealthCheckResponse> {
  const dbHealth = await checkDatabaseHealth(
    options?.firestoreInstance,
    options?.timeoutMs
  );

  const isHealthy = dbHealth.status === "healthy";
  const overallStatus: HealthStatus = isHealthy ? "healthy" : "unhealthy";

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "0.1.0",
    services: {
      database: dbHealth,
    },
  };
}
