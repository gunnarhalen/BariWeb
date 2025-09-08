import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuração do Firebase (mesma do mobile)
const firebaseConfig = {
  apiKey: "AIzaSyBGGofFNwXPgiRNrcj3RYnJMDJpf6b5woY",
  authDomain: "nutribud-7a785.firebaseapp.com",
  projectId: "nutribud-7a785",
  storageBucket: "nutribud-7a785.firebasestorage.app",
  messagingSenderId: "583512611485",
  appId: "1:583512611485:web:4dd6f09ecd1b90a057d274",
};

console.log("🔥 Firebase Config:", firebaseConfig);

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
