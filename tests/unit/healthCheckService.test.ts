import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  checkFirebaseConfig,
  checkDatabase,
  performHealthCheck,
} from "@/services/healthCheckService";
import * as firestore from "firebase/firestore";

// Mock do Firestore
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock("@/config/firebase", () => ({
  db: {},
}));

describe("HealthCheckService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("checkFirebaseConfig", () => {
    it("deve retornar status 'up' quando todas as variáveis de ambiente necessárias estiverem definidas", () => {
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test.firebaseapp.com";
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project";
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "test.appspot.com";
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456";
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:123456:web:abcdef";

      const result = checkFirebaseConfig();

      expect(result.status).toBe("up");
      expect(result.message).toContain("validada com sucesso");
      expect(result.details?.configured).toBe(true);
      expect(result.details?.projectId).toBe("test-project");
    });

    it("deve retornar status 'down' e listar as variáveis ausentes", () => {
      delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

      const result = checkFirebaseConfig();

      expect(result.status).toBe("down");
      expect(result.message).toContain("NEXT_PUBLIC_FIREBASE_API_KEY");
      expect(result.message).toContain("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
      expect(result.details?.configured).toBe(false);
    });
  });

  describe("checkDatabase", () => {
    it("deve retornar status 'up' quando a consulta ao Firestore for bem-sucedida", async () => {
      vi.mocked(firestore.doc).mockReturnValue({} as unknown as firestore.DocumentReference);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => false,
      } as unknown as firestore.DocumentSnapshot);

      const result = await checkDatabase();

      expect(result.status).toBe("up");
      expect(result.message).toContain("sucesso");
      expect(typeof result.latencyMs).toBe("number");
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it("deve retornar status 'down' quando a consulta ao Firestore falhar", async () => {
      vi.mocked(firestore.doc).mockReturnValue({} as unknown as firestore.DocumentReference);
      vi.mocked(firestore.getDoc).mockRejectedValue(new Error("Connection refused"));

      const result = await checkDatabase();

      expect(result.status).toBe("down");
      expect(result.message).toBe("Connection refused");
      expect(typeof result.latencyMs).toBe("number");
    });
  });

  describe("performHealthCheck", () => {
    it("deve retornar status geral 'healthy' quando todos os serviços estiverem 'up'", async () => {
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test.firebaseapp.com";
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project";
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "test.appspot.com";
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456";
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:123456:web:abcdef";

      vi.mocked(firestore.doc).mockReturnValue({} as unknown as firestore.DocumentReference);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => false,
      } as unknown as firestore.DocumentSnapshot);

      const result = await performHealthCheck();

      expect(result.status).toBe("healthy");
      expect(result.checks.database.status).toBe("up");
      expect(result.checks.firebaseConfig.status).toBe("up");
      expect(result.version).toBe("0.1.0");
      expect(result.timestamp).toBeDefined();
      expect(typeof result.uptime).toBe("number");
    });

    it("deve retornar status geral 'unhealthy' quando o banco de dados falhar", async () => {
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test.firebaseapp.com";
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project";
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "test.appspot.com";
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456";
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:123456:web:abcdef";

      vi.mocked(firestore.doc).mockReturnValue({} as unknown as firestore.DocumentReference);
      vi.mocked(firestore.getDoc).mockRejectedValue(new Error("Database timeout"));

      const result = await performHealthCheck();

      expect(result.status).toBe("unhealthy");
      expect(result.checks.database.status).toBe("down");
      expect(result.checks.firebaseConfig.status).toBe("up");
    });

    it("deve retornar status geral 'unhealthy' quando a configuração do Firebase estiver incompleta", async () => {
      delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      vi.mocked(firestore.doc).mockReturnValue({} as unknown as firestore.DocumentReference);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => false,
      } as unknown as firestore.DocumentSnapshot);

      const result = await performHealthCheck();

      expect(result.status).toBe("unhealthy");
      expect(result.checks.firebaseConfig.status).toBe("down");
    });
  });
});
