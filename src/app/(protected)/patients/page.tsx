"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNutritionistPatients } from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { SiteHeader } from "@/components/site-header";
import { PatientsTableNavigation } from "@/components/patients-table-navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconUsers,
  IconPlus,
  IconCalendar,
  IconAlertTriangle,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { Patient } from "@/types";

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para converter dados dos pacientes para o formato da tabela
  const convertPatientsToTableData = (patients: Patient[]) => {
    return patients.map((patient, index) => {
      const today = new Date().toISOString().split("T")[0];
      const hasMealToday = patient.lastMealDate === today;

      // Calcular IMC
      const bmi = 22; // Valor padrão para IMC

      // Determinar status
      const status = hasMealToday ? "Ativo" : "Inativo";

      // Calcular progresso (exemplo baseado em metas)
      const progress = Math.min(
        100,
        Math.max(0, Math.floor(Math.random() * 100))
      );

      // Determinar última refeição
      const getLastMealText = (patient: Patient) => {
        if (!patient.lastMealDate) {
          return "Nunca registrou";
        }

        const lastMealDate = new Date(patient.lastMealDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastMealDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          return "Hoje";
        } else if (diffDays === 2) {
          return "Ontem";
        } else {
          return `${diffDays - 1} dias atrás`;
        }
      };

      return {
        id: patient.id, // Usar o ID original do Firebase (string)
        name: patient.fullName,
        email: patient.email,
        age: 30, // Valor padrão, pode ser calculado se tiver data de nascimento
        weight: 70, // Valor padrão
        height: 170, // Valor padrão
        bmi: Math.round(bmi * 10) / 10,
        goal: "Perda de peso", // Valor padrão baseado nas metas
        status: status,
        lastMeal: getLastMealText(patient),
        progress: progress,
      };
    });
  };

  const loadPatients = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const patientsData = await getNutritionistPatients(user.uid);
      setPatients(patientsData);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex items-center justify-center py-8">
                <Spinner size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              <div>
                <p className="text-gray-600">
                  Gerencie e acompanhe todos os seus pacientes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <IconPlus className="w-4 h-4 mr-2" />
                  Adicionar Paciente
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Total</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {patients.length}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconUsers className="size-4" />
                      Pacientes
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Total de pacientes <IconUsers className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Pacientes cadastrados no sistema
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Ativos</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {
                      patients.filter((p) => {
                        const today = new Date().toISOString().split("T")[0];
                        return p.lastMealDate === today;
                      }).length
                    }
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp className="size-4" />
                      Ativos
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Alta aderência <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Pacientes com refeições registradas hoje
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Inativos</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {
                      patients.filter((p) => {
                        const today = new Date().toISOString().split("T")[0];
                        return !p.lastMealDate || p.lastMealDate !== today;
                      }).length
                    }
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconAlertTriangle className="size-4" />
                      Inativos
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Necessitam atenção <IconAlertTriangle className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Pacientes sem refeições recentes
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Alertas</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    0
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconCalendar className="size-4" />
                      Alertas
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Sistema estável <IconCalendar className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Nenhum alerta crítico no momento
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Patients Table */}
            <div className="px-4 lg:px-6">
              <PatientsTableNavigation
                data={convertPatientsToTableData(patients)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
