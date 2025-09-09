// Utilitários de dados de gráfico (mock e conversões de dados reais)
import { DailyMealData } from "@/services/nutritionistService";

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface MealsDataPoint {
  date: string;
  meals: number;
}

export interface PatientGoals {
  dailyKcal: number;
  protein: number;
  carb: number;
  fat: number;
}

// Converter dados reais de refeições para formato dos gráficos (nutrientes)
export function convertRealDataToChartData(
  realData: DailyMealData[],
  nutrientType: "kcal" | "protein" | "carb" | "fat"
): ChartDataPoint[] {
  return realData.map((day) => ({
    date: day.date,
    value: day[nutrientType],
  }));
}

// Converter dados reais para gráfico de número de refeições por dia
export function convertRealDataToMealsData(
  realData: DailyMealData[]
): MealsDataPoint[] {
  return realData.map((day) => ({
    date: day.date,
    meals: day.mealsCount,
  }));
}

// Gerar dados mockados para gráficos de nutrientes
export function generateNutrientData(
  days: number,
  goalValue: number,
  baseValue: number = goalValue * 0.8
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simular variação realística (±20% da meta)
    const variation = (Math.random() - 0.5) * 0.4; // -20% a +20%
    const value = baseValue * (1 + variation);

    data.push({
      // Mantém o formato dd/mm para exibição simples em PT-BR
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      value: Math.max(0, value), // Não permitir valores negativos
    });
  }

  return data;
}

// Gerar dados mockados para gráfico de refeições
export function generateMealsData(days: number): MealsDataPoint[] {
  const data: MealsDataPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simular entre 2-6 refeições por dia
    const meals = Math.floor(Math.random() * 5) + 2;

    data.push({
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      meals,
    });
  }

  return data;
}

// Metas do paciente (mock por enquanto)
export function getPatientGoals(): PatientGoals {
  return {
    dailyKcal: 2000,
    protein: 150,
    carb: 250,
    fat: 67,
  };
}
