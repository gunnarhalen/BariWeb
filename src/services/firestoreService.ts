import { db, auth } from "../config/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

// Função para obter o ID do usuário atual
const getCurrentUserId = async () => {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  // Aguardar autenticação
  return new Promise<string | null>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();

      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
    });

    // Timeout para evitar travamentos
    setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 3000);
  });
};

// Função para criar/atualizar documento
export const setDocument = async (
  collectionName: string,
  data: Record<string, unknown>,
  docId?: string
) => {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "Usuário não autenticado - não foi possível obter userId",
      };
    }

    const docRef = doc(
      db,
      `users/${userId}/${collectionName}`,
      docId || "data"
    );

    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
      userId,
    });
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Função para obter documento
export const getDocument = async (collectionName: string, docId?: string) => {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "Usuário não autenticado",
        code: "UNAUTHENTICATED",
      };
    }

    const docRef = doc(
      db,
      `users/${userId}/${collectionName}`,
      docId || "data"
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, data: null };
    }
  } catch (error: unknown) {
    console.error("Erro ao obter documento:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Função para obter documentos de uma coleção
export const getDocuments = async (collectionName: string, limitCount = 50) => {
  try {
    const userId = await getCurrentUserId();
    const collectionRef = collection(db, `users/${userId}/${collectionName}`);
    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: documents };
  } catch (error: unknown) {
    console.error("Erro ao obter documentos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Função para obter documento de outro usuário (para nutricionistas)
export const getOtherUserDocument = async (
  userId: string,
  collectionName: string,
  docId?: string
) => {
  try {
    const docRef = doc(
      db,
      `users/${userId}/${collectionName}`,
      docId || "data"
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, data: null };
    }
  } catch (error: unknown) {
    console.error("Erro ao obter documento de outro usuário:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Função para obter documentos de outro usuário (para nutricionistas)
export const getOtherUserDocuments = async (
  userId: string,
  collectionName: string,
  limitCount = 50
) => {
  try {
    const collectionRef = collection(db, `users/${userId}/${collectionName}`);
    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: documents };
  } catch (error: unknown) {
    console.error("Erro ao obter documentos de outro usuário:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};
