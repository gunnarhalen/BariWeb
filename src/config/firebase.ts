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

// Verificar se todas as variáveis de ambiente estão definidas
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_FIREBASE_API_KEY"
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_FIREBASE_APP_ID"
  );
}

// Inicializar Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase:", error);
  throw error;
}

// Exportar instâncias
export { auth, db };
export default app;
