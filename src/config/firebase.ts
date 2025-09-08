import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuração do Firebase usando variáveis de ambiente com fallback
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBGGofFNwXPgiRNrcj3RYnJMDJpf6b5woY",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "nutribud-7a785.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nutribud-7a785",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "nutribud-7a785.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "583512611485",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:583512611485:web:4dd6f09ecd1b90a057d274",
};

// Log da configuração (sem expor chaves sensíveis)
console.log("🔥 Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "***configured***" : "missing",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? "***configured***" : "missing",
});

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
