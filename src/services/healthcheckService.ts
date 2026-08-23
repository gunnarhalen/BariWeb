import { auth } from "@/config/firebase";
import { getAuth } from "firebase/auth";
import { db } from "@/config/firebase";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

export interface HealthCheckResult {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  checks: {
    firebase: {
      status: "ok" | "error";
      auth: {
        status: "ok" | "error";
        message?: string;
      };
      firestore: {
        status: "ok" | "error";
        message?: string;
      };
    };
  };
}

export async function checkHealth(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      firebase: {
        status: "ok",
        auth: { status: "ok" },
        firestore: { status: "ok" },
      },
    },
  };

  try {
    const authInstance = getAuth(auth.app);
    await authInstance.currentUser?.getIdToken();
    result.checks.firebase.auth = { status: "ok" };
  } catch (error) {
    result.checks.firebase.auth = {
      status: "error",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
    result.checks.firebase.status = "error";
    result.status = "error";
  }

  try {
    const firestoreInstance = getFirestore(db.app);
    const testQuery = query(collection(firestoreInstance, "nutritionists"), limit(1));
    await getDocs(testQuery);
    result.checks.firebase.firestore = { status: "ok" };
  } catch (error) {
    result.checks.firebase.firestore = {
      status: "error",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
    result.checks.firebase.status = "error";
    result.status = "error";
  }

  if (result.checks.firebase.auth.status === "error" || result.checks.firebase.firestore.status === "error") {
    result.status = "error";
  } else if (result.checks.firebase.auth.status === "ok" || result.checks.firebase.firestore.status === "ok") {
    result.status = "ok";
  }

  return result;
}
