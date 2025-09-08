"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPatientProfile,
  getLastMealDate,
} from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { BarChartComponent } from "@/components/ui/bar-chart";
import {
  generateNutrientData,
  generateMealsData,
  getPatientGoals,
  type ChartDataPoint,
  type MealsDataPoint,
} from "@/lib/chart-data";
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconCalendar,
  IconWeight,
  IconRuler,
  IconTarget,
  IconTrendingUp,
  IconAlertTriangle,
  IconEdit,
  IconNotes,
  IconChartBar,
} from "@tabler/icons-react";
import type { UserProfile } from "@/types";
import type { Timestamp } from "firebase/firestore";

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(
    null
  );
  const [lastMealDate, setLastMealDate] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"7" | "15" | "30">("7");
  const [chartData, setChartData] = useState<{
    calories: ChartDataPoint[];
    protein: ChartDataPoint[];
    carb: ChartDataPoint[];
    fat: ChartDataPoint[];
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
          intolerances: Array.isArray(profileData.intolerances)
            ? profileData.intolerances
            : [],
          allergies: Array.isArray(profileData.allergies)
            ? profileData.allergies
            : [],
          goals: (profileData.goals as {
            dailyKcal: number;
            protein: number;
            carb: number;
            fat: number;
          }) || {
            dailyKcal: 2000,
            protein: 120,
            carb: 220,
            fat: 60,
          },
          notifications: Boolean(profileData.notifications) || true,
          privacyMode: Boolean(profileData.privacyMode) || false,
          isNutritionist: Boolean(profileData.isNutritionist) || false,
          cfnCrn: String(profileData.cfnCrn) || "",
          associatedNutritionistId:
            String(profileData.associatedNutritionistId) || "",
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

  // Gerar dados dos gráficos quando o range de datas mudar
  useEffect(() => {
    if (patientProfile) {
      const goals = getPatientGoals();
      const days = parseInt(dateRange);

      setChartData({
        calories: generateNutrientData(days, goals.dailyKcal),
        protein: generateNutrientData(days, goals.protein),
        carb: generateNutrientData(days, goals.carb),
        fat: generateNutrientData(days, goals.fat),
        meals: generateMealsData(days),
      });
    }
  }, [patientProfile, dateRange]);

  const getStatusBadge = () => {
    const today = new Date().toISOString().split("T")[0];
    const hasMealToday = lastMealDate === today;

    if (hasMealToday) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          <IconTrendingUp className="w-4 h-4 mr-1" />
          Ativo
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
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

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
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
          <AlertDescription>
            {error || "Paciente não encontrado"}
          </AlertDescription>
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <IconEdit className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <IconNotes className="w-4 h-4" />
                  Notas
                </Button>
              </div>
            </div>

            {/* Cards principais - Layout horizontal compacto */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6">
              {/* Dados Pessoais */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconUser className="w-4 h-4" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconUser className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg font-semibold truncate">
                        {patientProfile.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Nome Completo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconMail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {patientProfile.email}
                      </p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconCalendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {calculateAge(patientProfile.birthDate)} anos
                      </p>
                      <p className="text-xs text-muted-foreground">Idade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconWeight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {patientProfile.weight} kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Peso Atual
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconRuler className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {patientProfile.height} cm
                      </p>
                      <p className="text-xs text-muted-foreground">Altura</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconTarget className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {calculateBMI(
                          patientProfile.weight,
                          patientProfile.height
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">IMC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metas Diárias */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconTarget className="w-4 h-4" />
                    Metas Diárias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {patientProfile.goals.dailyKcal}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Calorias
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-950 rounded-md">
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {patientProfile.goals.protein}g
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Proteínas
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                      <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                        {patientProfile.goals.carb}g
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Carboidratos
                      </p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-950 rounded-md">
                      <p className="text-lg font-bold text-red-700 dark:text-red-300">
                        {patientProfile.goals.fat}g
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Gorduras
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <IconTrendingUp className="w-4 h-4" />
                      Status
                    </CardTitle>
                    {getStatusBadge()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconCalendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{getLastMealText()}</p>
                      <p className="text-xs text-muted-foreground">
                        Última Refeição
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconTarget className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {patientProfile.goal.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">Objetivo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconUser className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {patientProfile.dietType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tipo de Dieta
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconTrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {patientProfile.activityLevel}
                      </p>
                      <p className="text-xs text-muted-foreground">Atividade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Restrições Alimentares - Compacto */}
            {(patientProfile.intolerances.length > 0 ||
              patientProfile.allergies.length > 0) && (
              <Card className="px-4 lg:px-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconAlertTriangle className="w-4 h-4" />
                    Restrições Alimentares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {patientProfile.intolerances.map((intolerance, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {intolerance}
                      </Badge>
                    ))}
                    {patientProfile.allergies.map((allergy, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="text-xs"
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gráficos de Acompanhamento */}
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <IconChartBar className="w-5 h-5" />
                  Acompanhamento Nutricional
                </h2>
                <DateRangeSelector
                  selectedRange={dateRange}
                  onRangeChange={setDateRange}
                />
              </div>
              {chartData ? (
                <div className="space-y-4">
                  {/* Primeira linha: Refeições e Calorias */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <BarChartComponent
                      title="Refeições por Dia"
                      data={
                        chartData.meals as unknown as Array<
                          Record<string, string | number>
                        >
                      }
                      dataKey="meals"
                      color="#3b82f6"
                    />
                    <BarChartComponent
                      title="Calorias Diárias"
                      data={
                        chartData.calories as unknown as Array<
                          Record<string, string | number>
                        >
                      }
                      dataKey="value"
                      color="#3b82f6"
                    />
                  </div>

                  {/* Segunda linha: Proteína, Carboidratos e Gorduras */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <BarChartComponent
                      title="Proteína"
                      data={
                        chartData.protein as unknown as Array<
                          Record<string, string | number>
                        >
                      }
                      dataKey="value"
                      color="#10b981"
                    />
                    <BarChartComponent
                      title="Carboidratos"
                      data={
                        chartData.carb as unknown as Array<
                          Record<string, string | number>
                        >
                      }
                      dataKey="value"
                      color="#f59e0b"
                    />
                    <BarChartComponent
                      title="Gorduras"
                      data={
                        chartData.fat as unknown as Array<
                          Record<string, string | number>
                        >
                      }
                      dataKey="value"
                      color="#ef4444"
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
