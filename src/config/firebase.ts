import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Listar variáveis disponíveis (sem expor valores)
const availableVars = Object.keys(process.env).filter((key) =>
  key.startsWith("NEXT_PUBLIC_")
);
console.log("🔍 Variáveis NEXT_PUBLIC_ disponíveis:", availableVars);

// Verificar se todas as variáveis de ambiente estão definidas
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error("❌ Variáveis ausentes:", missingVars);
  console.error("🔍 Variáveis disponíveis:", availableVars);
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

// Log da configuração (sem expor chaves sensíveis)
if (process.env.NODE_ENV === "development") {
  console.log("🔥 Firebase Config:", {
    apiKey: firebaseConfig.apiKey ? "***configured***" : "missing",
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId ? "***configured***" : "missing",
  });
}

// Inicializar Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase inicializado com sucesso");

  // Configurar instâncias
  auth = getAuth(app);
  console.log("✅ Auth configurado (persistência padrão)");

  db = getFirestore(app);
  console.log("✅ Firestore configurado:", db);

  // Testar se auth está funcionando
  console.log("✅ Auth config:", auth.config);
  console.log("✅ Auth app:", auth.app);
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase:", error);
  throw error;
}

// Exportar instâncias
export { auth, db };
export default app;
