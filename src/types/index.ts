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

// Tipos de resposta da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Tipos de autenticação
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Tipos de dashboard
export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  patientsWithoutMealsToday: number;
  totalMealsToday: number;
  patientsWithAlerts: number;
}

// Tipos de gráficos
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MacrosData {
  protein: number;
  carb: number;
  fat: number;
  calories: number;
}

// Tipos de filtros
export interface PatientFilters {
  status?: "active" | "inactive";
  lastMeal?: "today" | "yesterday" | "week";
  alerts?: "above_goals" | "below_goals" | "none";
  goals?: "weight_loss" | "weight_gain" | "maintain";
}

// Tipos de notas
export interface PatientNote {
  id: string;
  patientId: string;
  nutritionistId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
