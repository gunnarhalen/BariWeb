"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNutritionistPatients } from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconUsers,
  IconSearch,
  IconFilter,
  IconPlus,
  IconEye,
  IconCalendar,
  IconAlertTriangle,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { Patient } from "@/types";

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "alerts"
  >("all");

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

  const filterPatients = useCallback(() => {
    let filtered = [...patients];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    switch (filterStatus) {
      case "active":
        filtered = filtered.filter((patient) => {
          const today = new Date().toISOString().split("T")[0];
          return patient.lastMealDate === today;
        });
        break;
      case "inactive":
        filtered = filtered.filter((patient) => {
          const today = new Date().toISOString().split("T")[0];
          return !patient.lastMealDate || patient.lastMealDate !== today;
        });
        break;
      case "alerts":
        filtered = filtered.filter(() => {
          // Lógica para detectar alertas (exemplo: metas não atingidas)
          return false; // Implementar lógica real
        });
        break;
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, filterStatus]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    filterPatients();
  }, [filterPatients]);

  const getStatusBadge = (patient: Patient) => {
    const today = new Date().toISOString().split("T")[0];
    const hasMealToday = patient.lastMealDate === today;

    if (hasMealToday) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <IconTrendingUp className="w-3 h-3 mr-1" />
          Ativo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <IconAlertTriangle className="w-3 h-3 mr-1" />
          Inativo
        </span>
      );
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <IconTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    patients.filter((p) => {
                      const today = new Date().toISOString().split("T")[0];
                      return p.lastMealDate === today;
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <IconAlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    patients.filter((p) => {
                      const today = new Date().toISOString().split("T")[0];
                      return !p.lastMealDate || p.lastMealDate !== today;
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <IconCalendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFilter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Ativos
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("inactive")}
              >
                Inativos
              </Button>
              <Button
                variant={filterStatus === "alerts" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("alerts")}
              >
                Alertas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} de {patients.length} pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <IconUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum paciente encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Os pacientes aparecerão aqui quando se associarem ao seu acompanhamento"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Refeição</TableHead>
                    <TableHead>Metas Diárias</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.fullName}
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{getStatusBadge(patient)}</TableCell>
                      <TableCell>{getLastMealText(patient)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          <div>{patient.goals.dailyKcal} kcal</div>
                          <div className="text-xs">
                            P: {patient.goals.protein}g | C:{" "}
                            {patient.goals.carb}g | G: {patient.goals.fat}g
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <IconEye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
