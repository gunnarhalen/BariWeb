"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNutritionistPatients } from "@/services/nutritionistService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconUsers,
  IconUserCheck,
  IconAlertTriangle,
  IconChartBar,
  IconTrendingDown,
  IconSettings,
} from "@tabler/icons-react";
import type { Patient, DashboardStats } from "@/types";

function DashboardContent() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    patientsWithoutMealsToday: 0,
    totalMealsToday: 0,
    patientsWithAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const patientsData = await getNutritionistPatients(user!.uid);
      setPatients(patientsData);

      // Calcular estatísticas
      const today = new Date().toISOString().split("T")[0];
      const patientsWithoutMealsToday = patientsData.filter(
        (patient) => !patient.lastMealDate || patient.lastMealDate !== today
      ).length;

      const patientsWithAlerts = patientsData.filter((patient) => {
        // Lógica para detectar alertas (exemplo: metas não atingidas)
        return false; // Implementar lógica real
      }).length;

      setStats({
        totalPatients: patientsData.length,
        activePatients: patientsData.length, // Todos os pacientes aceitos são ativos
        patientsWithoutMealsToday,
        totalMealsToday: 0, // Implementar contagem real
        patientsWithAlerts,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total de Pacientes",
      value: stats.totalPatients,
      icon: IconUsers,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pacientes Ativos",
      value: stats.activePatients,
      icon: IconUserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sem Refeições Hoje",
      value: stats.patientsWithoutMealsToday,
      icon: IconAlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Com Alertas",
      value: stats.patientsWithAlerts,
      icon: IconTrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral dos seus pacientes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Patients */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Recentes</CardTitle>
          <CardDescription>
            Últimos pacientes que se associaram ao seu acompanhamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-8">
              <IconUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum paciente encontrado</p>
              <p className="text-sm text-gray-500">
                Os pacientes aparecerão aqui quando se associarem ao seu
                acompanhamento
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.fullName}
                    </p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Meta: {patient.goals.dailyKcal} kcal
                    </p>
                    <p className="text-xs text-gray-500">
                      Proteína: {patient.goals.protein}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às funcionalidades mais usadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/patients"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IconUsers className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  Ver Todos os Pacientes
                </p>
                <p className="text-sm text-gray-600">
                  Gerenciar lista completa
                </p>
              </div>
            </a>

            <a
              href="/reports"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IconChartBar className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Gerar Relatórios</p>
                <p className="text-sm text-gray-600">
                  Exportar dados dos pacientes
                </p>
              </div>
            </a>

            <a
              href="/settings"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IconSettings className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Configurações</p>
                <p className="text-sm text-gray-600">Personalizar sua conta</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
