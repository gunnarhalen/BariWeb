"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPatientProfile,
  getLastMealDate,
  getPatientMealData,
  getPatientWaterData,
} from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { SiteHeader } from "@/components/site-header";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import {
  generateNutrientData,
  generateMealsData,
  convertRealDataToChartData,
  convertRealDataToMealsData,
  convertRealDataToWaterData,
  type ChartDataPoint,
  type MealsDataPoint,
} from "@/lib/chart-data";
import {
  IconArrowLeft,
  IconCalendar,
  IconWeight,
  IconRuler,
  IconTarget,
  IconTrendingUp,
  IconAlertTriangle,
  IconEdit,
  IconNotes,
  IconChartBar,
  IconFlag,
  IconLeaf,
} from "@tabler/icons-react";
import { ChartCard } from "@/components/chart-card";
import type { UserProfile } from "@/types";
import type { Timestamp } from "firebase/firestore";

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(null);
  const [lastMealDate, setLastMealDate] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"7" | "15" | "30">("7");
  const [chartData, setChartData] = useState<{
    calories: ChartDataPoint[];
    protein: ChartDataPoint[];
    carb: ChartDataPoint[];
    fat: ChartDataPoint[];
    fiber: ChartDataPoint[];
    sugar: ChartDataPoint[];
    sodium: ChartDataPoint[];
    water: ChartDataPoint[];
    meals: MealsDataPoint[];
  } | null>(null);

  const patientId = params.id as string;

  useEffect(() => {
    const loadPatientData = async () => {
      if (!user || !patientId) return;

      try {
        setLoading(true);
        setError(null);

        // Buscar dados reais do paciente
        const profileData = await getPatientProfile(patientId);
        const mealDate = await getLastMealDate(patientId);

        if (!profileData) {
          setError("Paciente não encontrado");
          return;
        }

        // Converter para UserProfile
        const userProfile: UserProfile = {
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          birthDate: profileData.birthDate ? String(profileData.birthDate) : "",
          gender: (profileData.gender as "male" | "female") || "male",
          weight: Number(profileData.weight) || 0,
          height: Number(profileData.height) || 0,
          activityLevel: String(profileData.activityLevel) || "",
          goal: String(profileData.goal) || "",
          dietType: String(profileData.dietType) || "",
          religiousDiet: String(profileData.religiousDiet) || "",
          intolerances: Array.isArray(profileData.intolerances) ? profileData.intolerances : [],
          allergies: Array.isArray(profileData.allergies) ? profileData.allergies : [],
          goals: (profileData.goals as {
            dailyKcal: number;
            protein: number;
            carb: number;
            fat: number;
            fiber: number;
            sugar: number;
            sodium: number;
            water: number;
          }) || {
            dailyKcal: 2000,
            protein: 120,
            carb: 220,
            fat: 60,
            fiber: 25,
            sugar: 50,
            sodium: 2300,
            water: 2000,
          },
          notifications: Boolean(profileData.notifications) || true,
          privacyMode: Boolean(profileData.privacyMode) || false,
          isNutritionist: Boolean(profileData.isNutritionist) || false,
          cfnCrn: String(profileData.cfnCrn) || "",
          associatedNutritionistId: String(profileData.associatedNutritionistId) || "",
          createdAt: profileData.createdAt as Timestamp,
          updatedAt: profileData.updatedAt as Timestamp,
        };

        setPatientProfile(userProfile);
        setLastMealDate(mealDate);
      } catch (err) {
        console.error("Erro ao carregar dados do paciente:", err);
        setError("Erro ao carregar dados do paciente");
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [user, patientId]);

  // Buscar dados reais dos gráficos quando o range de datas mudar
  useEffect(() => {
    const fetchRealChartData = async () => {
      if (patientProfile && patientId) {
        const days = parseInt(dateRange);

        try {
          // Buscar dados reais das refeições e água
          const realMealData = await getPatientMealData(patientId, days);
          const realWaterData = await getPatientWaterData(patientId, days);

          // Converter para formato dos gráficos
          const chartDataConverted = {
            calories: convertRealDataToChartData(realMealData, "kcal"),
            protein: convertRealDataToChartData(realMealData, "protein"),
            carb: convertRealDataToChartData(realMealData, "carb"),
            fat: convertRealDataToChartData(realMealData, "fat"),
            fiber: convertRealDataToChartData(realMealData, "fiber"),
            sugar: convertRealDataToChartData(realMealData, "sugar"),
            sodium: convertRealDataToChartData(realMealData, "sodium"),
            water: convertRealDataToWaterData(realWaterData),
            meals: convertRealDataToMealsData(realMealData),
          };

          setChartData(chartDataConverted);
        } catch (error) {
          console.error("Erro ao buscar dados reais dos gráficos:", error);
          // Fallback para dados mockados em caso de erro
          setChartData({
            calories: generateNutrientData(days, patientProfile.goals.dailyKcal),
            protein: generateNutrientData(days, patientProfile.goals.protein),
            carb: generateNutrientData(days, patientProfile.goals.carb),
            fat: generateNutrientData(days, patientProfile.goals.fat),
            fiber: generateNutrientData(days, patientProfile.goals.fiber || 25),
            sugar: generateNutrientData(days, patientProfile.goals.sugar || 50),
            sodium: generateNutrientData(days, patientProfile.goals.sodium || 2300),
            water: generateNutrientData(days, patientProfile.goals.water || 2000),
            meals: generateMealsData(days),
          });
        }
      }
    };

    fetchRealChartData();
  }, [patientProfile, dateRange, patientId]);

  const getStatusBadge = () => {
    const today = new Date().toISOString().split("T")[0];
    const hasMealToday = lastMealDate === today;

    if (hasMealToday) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconTrendingUp className="w-4 h-4 mr-1" />
          Ativo
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <IconAlertTriangle className="w-4 h-4 mr-1" />
          Inativo
        </Badge>
      );
    }
  };

  const getLastMealText = () => {
    if (!lastMealDate) {
      return "Nunca registrou";
    }

    const lastMealDateObj = new Date(lastMealDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastMealDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Hoje";
    } else if (diffDays === 2) {
      return "Ontem";
    } else {
      return `${diffDays - 1} dias atrás`;
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !patientProfile) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Paciente não encontrado"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline">
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Header com informações principais */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Informações principais - Layout horizontal compacto */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
                      <IconArrowLeft className="w-4 h-4" />
                      Voltar
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Nome e Status */}
                    <div className="lg:col-span-2">
                      <div className="mb-2">
                        <h1 className="text-xl font-semibold">{patientProfile.fullName}</h1>
                        <p className="text-sm text-muted-foreground">{patientProfile.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge()}
                        <span className="text-sm text-muted-foreground">{getLastMealText()}</span>
                      </div>
                    </div>

                    {/* Dados físicos compactos */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{calculateAge(patientProfile.birthDate)} anos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconWeight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{patientProfile.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconRuler className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{patientProfile.height} cm</span>
                      </div>
                    </div>

                    {/* IMC e Metas compactas */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconTarget className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          IMC: {calculateBMI(patientProfile.weight, patientProfile.height)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <IconFlag className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{patientProfile.goal.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconLeaf className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{patientProfile.dietType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <IconEdit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <IconNotes className="w-4 h-4" />
                    Notas
                  </Button>
                </div>
              </div>
            </div>

            {/* Restrições Alimentares - Horizontal compacto */}
            {(patientProfile.intolerances.length > 0 || patientProfile.allergies.length > 0) && (
              <div className="px-4 lg:px-6">
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconAlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Restrições:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {patientProfile.intolerances.map((intolerance, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {intolerance}
                      </Badge>
                    ))}
                    {patientProfile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gráficos de Acompanhamento */}
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <IconChartBar className="w-5 h-5" />
                  Acompanhamento Nutricional
                </h2>
                <DateRangeSelector selectedRange={dateRange} onRangeChange={setDateRange} />
              </div>
              {chartData ? (
                <div className="space-y-4">
                  {/* Primeira linha: Refeições e Calorias */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Gráfico de Refeições */}
                    <ChartCard
                      title="Refeições por Dia"
                      data={chartData.meals || []}
                      goal={0}
                      color="#3b82f6"
                      gradientId="fillMeals"
                      dataKey="meals"
                      showGoal={false}
                    />

                    {/* Gráfico de Calorias */}
                    <ChartCard
                      title="Calorias Diárias"
                      data={chartData.calories || []}
                      goal={patientProfile.goals.dailyKcal}
                      color="#3b82f6"
                      gradientId="fillCalories"
                      unit="kcal"
                    />
                  </div>

                  {/* Segunda linha: Proteína, Carboidratos e Gorduras */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Gráfico de Proteína */}
                    <ChartCard
                      title="Proteína"
                      data={chartData.protein || []}
                      goal={patientProfile.goals.protein}
                      color="#10b981"
                      gradientId="fillProtein"
                      unit="g"
                    />

                    {/* Gráfico de Carboidratos */}
                    <ChartCard
                      title="Carboidratos"
                      data={chartData.carb || []}
                      goal={patientProfile.goals.carb}
                      color="#f59e0b"
                      gradientId="fillCarb"
                      unit="g"
                    />

                    {/* Gráfico de Gorduras */}
                    <ChartCard
                      title="Gorduras"
                      data={chartData.fat || []}
                      goal={patientProfile.goals.fat}
                      color="#ef4444"
                      gradientId="fillFat"
                      unit="g"
                    />
                  </div>

                  {/* Terceira linha: Fibras, Açúcar, Sódio e Água */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Gráfico de Fibras */}
                    <ChartCard
                      title="Fibras"
                      data={chartData.fiber || []}
                      goal={patientProfile.goals.fiber || 25}
                      color="#8b5cf6"
                      gradientId="fillFiber"
                      unit="g"
                    />

                    {/* Gráfico de Açúcar */}
                    <ChartCard
                      title="Açúcar"
                      data={chartData.sugar || []}
                      goal={patientProfile.goals.sugar || 50}
                      color="#f97316"
                      gradientId="fillSugar"
                      unit="g"
                    />

                    {/* Gráfico de Sódio */}
                    <ChartCard
                      title="Sódio"
                      data={chartData.sodium || []}
                      goal={patientProfile.goals.sodium || 2300}
                      color="#06b6d4"
                      gradientId="fillSodium"
                      unit="mg"
                    />

                    {/* Gráfico de Água */}
                    <ChartCard
                      title="Água"
                      data={chartData.water || []}
                      goal={patientProfile.goals.water || 2000}
                      color="#0ea5e9"
                      gradientId="fillWater"
                      unit="ml"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <Spinner size="lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
