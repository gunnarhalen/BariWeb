import { db } from "../config/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";

// Interfaces
export interface Nutritionist {
  id: string;
  email: string;
  name: string;
}

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  lastMealDate?: string;
  goals: {
    dailyKcal: number;
    protein: number;
    carb: number;
    fat: number;
  };
  associatedNutritionistId: string;
}

export interface NutritionistRequest {
  id: string;
  nutritionistId: string;
  userId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
}

// Função auxiliar para obter a data da última refeição
export const getLastMealDate = async (
  patientId: string
): Promise<string | undefined> => {
  try {
    // Buscar documentos de data na subcoleção meals
    const mealsRef = collection(db, "users", patientId, "meals");
    const allDocsSnapshot = await getDocs(mealsRef);

    if (allDocsSnapshot.empty) {
      return undefined;
    }

    // Encontrar o documento de data mais recente
    let latestDateDoc = null;
    let latestDate: Date | null = null;

    for (const doc of allDocsSnapshot.docs) {
      const docId = doc.id;

      if (docId === "data") {
        continue;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(docId)) {
        try {
          const docDate = new Date(docId);
          if (!latestDate || docDate > latestDate) {
            latestDate = docDate;
            latestDateDoc = doc;
          }
        } catch {
          // Erro ao parsear data, ignorar este documento
        }
      }
    }

    if (!latestDateDoc) {
      return undefined;
    }

    const dateDocData = latestDateDoc.data();

    // Verificar se tem campo 'meals' com array de refeições
    if (
      !dateDocData.meals ||
      !Array.isArray(dateDocData.meals) ||
      dateDocData.meals.length === 0
    ) {
      return undefined;
    }

    // Encontrar a refeição mais recente no array
    let latestMeal = null;
    let latestMealDate: Date | null = null;

    for (const meal of dateDocData.meals) {
      if (meal.createdAt) {
        try {
          let mealDate: Date;
          const createdAt = meal.createdAt;

          if (createdAt.toDate) {
            mealDate = createdAt.toDate();
          } else if (createdAt.seconds) {
            mealDate = new Date(createdAt.seconds * 1000);
          } else if (typeof createdAt === "string") {
            mealDate = new Date(createdAt);
          } else {
            mealDate = new Date(createdAt);
          }

          if (!latestMealDate || mealDate > latestMealDate) {
            latestMealDate = mealDate;
            latestMeal = meal;
          }
        } catch {
          // Erro ao processar data da refeição, ignorar esta refeição
        }
      }
    }

    if (latestMeal && latestMeal.createdAt) {
      try {
        let date: Date;
        const createdAt = latestMeal.createdAt;

        if (createdAt.toDate) {
          date = createdAt.toDate();
        } else if (createdAt.seconds) {
          date = new Date(createdAt.seconds * 1000);
        } else if (typeof createdAt === "string") {
          date = new Date(createdAt);
        } else {
          date = new Date(createdAt);
        }

        const lastMealDate = date.toISOString().split("T")[0];
        return lastMealDate;
      } catch {
        return undefined;
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
};

// Obter perfil do nutricionista
export const getNutritionistProfile = async (nutritionistId: string) => {
  try {
    const nutritionistRef = doc(db, "nutritionists", nutritionistId);
    const nutritionistDoc = await getDoc(nutritionistRef);

    if (nutritionistDoc.exists()) {
      return { id: nutritionistDoc.id, ...nutritionistDoc.data() };
    }

    return null;
  } catch (error) {
    console.error("Erro ao obter perfil do nutricionista:", error);
    return null;
  }
};

// Obter pacientes do nutricionista
export const getNutritionistPatients = async (
  nutritionistId: string
): Promise<Patient[]> => {
  try {
    // Buscar solicitações aceitas
    const requestsRef = collection(db, "nutritionist_requests");
    const acceptedRequestsQuery = query(
      requestsRef,
      where("nutritionistId", "==", nutritionistId),
      where("status", "==", "accepted")
    );

    const requestsSnapshot = await getDocs(acceptedRequestsQuery);
    const patientIds = requestsSnapshot.docs.map((doc) => doc.data().userId);

    // Buscar perfis dos pacientes
    const patients: Patient[] = [];

    for (const patientId of patientIds) {
      try {
        const patientRef = doc(db, "users", patientId, "profile", "data");
        const patientDoc = await getDoc(patientRef);

        if (patientDoc.exists()) {
          const patientData = patientDoc.data();

          // Buscar a última refeição do paciente usando a função auxiliar
          const lastMealDate = await getLastMealDate(patientId);

          patients.push({
            id: patientId,
            fullName: patientData.fullName || "",
            email: patientData.email || "",
            lastMealDate,
            goals: patientData.goals || {
              dailyKcal: 2000,
              protein: 120,
              carb: 220,
              fat: 60,
            },
            associatedNutritionistId: nutritionistId,
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar paciente ${patientId}:`, error);
      }
    }

    return patients;
  } catch (error) {
    console.error("Erro ao buscar pacientes do nutricionista:", error);
    return [];
  }
};

// Interface para o perfil do paciente
interface PatientProfile {
  id: string;
  fullName?: string;
  email?: string;
  age?: number;
  gender?: string;
  goals?: unknown;
  [key: string]: unknown;
}

// Obter perfil completo do paciente
export const getPatientProfile = async (
  patientId: string
): Promise<PatientProfile | null> => {
  try {
    const patientRef = doc(db, "users", patientId, "profile", "data");
    const patientDoc = await getDoc(patientRef);

    if (patientDoc.exists()) {
      return { id: patientDoc.id, ...patientDoc.data() } as PatientProfile;
    }

    return null;
  } catch (error) {
    console.error("Erro ao obter perfil do paciente:", error);
    return null;
  }
};

// Aceitar solicitação de nutricionista
export const acceptNutritionistRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, "nutritionist_requests", requestId);
    await updateDoc(requestRef, { status: "accepted" });
    return { success: true };
  } catch (error) {
    console.error("Erro ao aceitar solicitação:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Rejeitar solicitação de nutricionista
export const rejectNutritionistRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, "nutritionist_requests", requestId);
    await updateDoc(requestRef, { status: "rejected" });
    return { success: true };
  } catch (error) {
    console.error("Erro ao rejeitar solicitação:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Verificar se um usuário é nutricionista
export const isNutritionist = async (userId: string): Promise<boolean> => {
  try {
    const nutritionistRef = doc(db, "nutritionists", userId);
    const nutritionistDoc = await getDoc(nutritionistRef);
    return nutritionistDoc.exists();
  } catch (error) {
    console.error("Erro ao verificar se é nutricionista:", error);
    return false;
  }
};

// Buscar solicitações do nutricionista
export const getNutritionistRequests = async (nutritionistId: string) => {
  try {
    const requestsRef = collection(db, "nutritionist_requests");
    const requestsQuery = query(
      requestsRef,
      where("nutritionistId", "==", nutritionistId),
      orderBy("createdAt", "desc")
    );

    const requestsSnapshot = await getDocs(requestsQuery);
    const requests = [];

    for (const doc of requestsSnapshot.docs) {
      const requestData = doc.data() as NutritionistRequest;
      const patientProfile = await getPatientProfile(requestData.userId);

      requests.push({
        ...requestData,
        id: doc.id,
        patientProfile: patientProfile
          ? {
              fullName: patientProfile.fullName || "Nome não disponível",
              email: patientProfile.email || "Email não disponível",
              age: patientProfile.age,
              gender: patientProfile.gender,
              goals: patientProfile.goals,
            }
          : null,
      });
    }

    return requests;
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    return [];
  }
};
