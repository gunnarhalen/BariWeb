import { Timestamp } from "firebase/firestore";

// Tipos de usuário
export interface UserProfile {
  fullName: string;
  email: string;
  birthDate: string;
  gender: "male" | "female";
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  dietType: string;
  religiousDiet: string;
  intolerances: string[];
  allergies: string[];
  goals: {
    dailyKcal: number;
    protein: number;
    carb: number;
    fat: number;
  };
  notifications: boolean;
  privacyMode: boolean;
  isNutritionist: boolean;
  cfnCrn: string;
  associatedNutritionistId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipos de refeição
export interface Meal {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
  quantity: number;
  unit: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: string; // ISO format
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipos de nutricionista
export interface Nutritionist {
  id: string;
  email: string;
  fullName: string;
  cfnCrn: string;
  isActive: boolean;
}

// Tipos de paciente (para nutricionistas)
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

// Tipos de solicitação
export interface NutritionistRequest {
  id: string;
  userId: string;
  nutritionistId: string;
  userName: string;
  userEmail: string;
  status: "pending" | "accepted" | "rejected" | "revoked";
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  revokedAt?: Timestamp;
}
