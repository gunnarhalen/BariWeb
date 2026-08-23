export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type ComponentStatus = "up" | "down" | "degraded";

export interface ComponentCheck {
  status: ComponentStatus;
  latencyMs?: number;
  message?: string;
  details?: Record<string, unknown>;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: ComponentCheck;
    firebaseConfig: ComponentCheck;
    [key: string]: ComponentCheck;
  };
}
