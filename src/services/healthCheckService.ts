import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import type {
  ComponentCheck,
  HealthCheckResponse,
  HealthStatus,
} from "@/types/health";

const REQUIRED_FIREBASE_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

/**
 * Verifica se as variáveis de ambiente essenciais do Firebase estão configuradas
 */
export function checkFirebaseConfig(): ComponentCheck {
  const missingVars: string[] = [];

  for (const envVar of REQUIRED_FIREBASE_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    return {
      status: "down",
      message: `Configuração incompleta. Variáveis ausentes: ${missingVars.join(", ")}`,
      details: {
        missing: missingVars,
        configured: false,
      },
    };
  }

  return {
    status: "up",
    message: "Configuração do Firebase validada com sucesso",
    details: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      configured: true,
    },
  };
}

/**
 * Verifica a conectividade com o Cloud Firestore com timeout configurável
 */
export async function checkDatabase(timeoutMs: number = 5000): Promise<ComponentCheck> {
  const startTime = Date.now();

  try {
    if (!db) {
      return {
        status: "down",
        latencyMs: Date.now() - startTime,
        message: "Instância do Firestore não inicializada",
      };
    }

    // Ping Firestore com timeout
    const checkPromise = (async () => {
      const pingDocRef = doc(db, "_healthcheck", "ping");
      await getDoc(pingDocRef);
      return true;
    })();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de conexão com o banco após ${timeoutMs}ms`)), timeoutMs)
    );

    await Promise.race([checkPromise, timeoutPromise]);

    const latencyMs = Date.now() - startTime;
    return {
      status: "up",
      latencyMs,
      message: "Conexão com Firestore estabelecida com sucesso",
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao conectar ao Firestore";

    return {
      status: "down",
      latencyMs,
      message: errorMessage,
    };
  }
}

/**
 * Executa todas as verificações e retorna o relatório completo de saúde
 */
export async function performHealthCheck(): Promise<HealthCheckResponse> {
  const firebaseConfigCheck = checkFirebaseConfig();
  const databaseCheck = await checkDatabase();

  let status: HealthStatus = "healthy";

  if (databaseCheck.status === "down" || firebaseConfigCheck.status === "down") {
    status = "unhealthy";
  } else if (databaseCheck.status === "degraded" || firebaseConfigCheck.status === "degraded") {
    status = "degraded";
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    uptime: typeof process !== "undefined" && typeof process.uptime === "function" ? process.uptime() : 0,
    environment: process.env.NODE_ENV || "development",
    version: "0.1.0",
    checks: {
      database: databaseCheck,
      firebaseConfig: firebaseConfigCheck,
    },
  };
}
