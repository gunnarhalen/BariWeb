"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPatientProfile,
  getLastMealDate,
} from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const getStatusBadge = () => {
    const today = new Date().toISOString().split("T")[0];
    const hasMealToday = lastMealDate === today;

    if (hasMealToday) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <IconTrendingUp className="w-4 h-4 mr-1" />
          Ativo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <IconAlertTriangle className="w-4 h-4 mr-1" />
          Inativo
        </span>
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (error || !patientProfile) {
    return (
      <div className="text-center py-8">
        <IconAlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Erro ao carregar paciente
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || "Paciente não encontrado"}
        </p>
        <Button
          onClick={() => router.back()}
          className="mt-4"
          variant="outline"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patientProfile.fullName}
            </h1>
            <p className="text-gray-600 mt-1">
              Detalhes e acompanhamento do paciente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button variant="outline" size="sm">
            <IconEdit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconUser className="w-5 h-5 mr-2" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IconMail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{patientProfile.email}</p>
                <p className="text-xs text-gray-500">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconCalendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {calculateAge(patientProfile.birthDate)} anos
                </p>
                <p className="text-xs text-gray-500">Idade</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconWeight className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {patientProfile.weight} kg
                </p>
                <p className="text-xs text-gray-500">Peso atual</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconRuler className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {patientProfile.height} cm
                </p>
                <p className="text-xs text-gray-500">Altura</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconTarget className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  IMC:{" "}
                  {calculateBMI(patientProfile.weight, patientProfile.height)}
                </p>
                <p className="text-xs text-gray-500">
                  Índice de Massa Corporal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metas Nutricionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTarget className="w-5 h-5 mr-2" />
              Metas Diárias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">
                  Calorias
                </span>
                <span className="text-lg font-bold text-blue-900">
                  {patientProfile.goals.dailyKcal}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">kcal/dia</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900">
                  Proteínas
                </span>
                <span className="text-lg font-bold text-green-900">
                  {patientProfile.goals.protein}g
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">gramas/dia</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-900">
                  Carboidratos
                </span>
                <span className="text-lg font-bold text-yellow-900">
                  {patientProfile.goals.carb}g
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">gramas/dia</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-900">
                  Gorduras
                </span>
                <span className="text-lg font-bold text-red-900">
                  {patientProfile.goals.fat}g
                </span>
              </div>
              <p className="text-xs text-red-700 mt-1">gramas/dia</p>
            </div>
          </CardContent>
        </Card>

        {/* Status e Atividade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTrendingUp className="w-5 h-5 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">{getStatusBadge()}</div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Última Refeição
                </p>
                <p className="text-sm text-gray-600">{getLastMealText()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Objetivo</p>
                <p className="text-sm text-gray-600 capitalize">
                  {patientProfile.goal.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Tipo de Dieta
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {patientProfile.dietType}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Nível de Atividade
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {patientProfile.activityLevel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restrições Alimentares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconAlertTriangle className="w-5 h-5 mr-2" />
              Restrições Alimentares
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientProfile.intolerances.length > 0 ||
            patientProfile.allergies.length > 0 ? (
              <div className="space-y-3">
                {patientProfile.intolerances.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Intolerâncias:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {patientProfile.intolerances.map((intolerance, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                        >
                          {intolerance}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {patientProfile.allergies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Alergias:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {patientProfile.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma restrição alimentar registrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconNotes className="w-5 h-5 mr-2" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <IconChartBar className="w-4 h-4 mr-2" />
              Ver Relatório de Progresso
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <IconNotes className="w-4 h-4 mr-2" />
              Adicionar Nota
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <IconEdit className="w-4 h-4 mr-2" />
              Editar Metas
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <IconCalendar className="w-4 h-4 mr-2" />
              Agendar Consulta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
