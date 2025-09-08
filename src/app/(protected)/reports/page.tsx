"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconDownload,
  IconCalendar,
  IconChartBar,
  IconUsers,
  IconTrendingUp,
  IconFileText,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dados mockados para demonstração
const mockData = {
  weightProgress: [
    { name: "Jan", peso: 75, meta: 70 },
    { name: "Fev", peso: 73, meta: 70 },
    { name: "Mar", peso: 71, meta: 70 },
    { name: "Abr", peso: 70, meta: 70 },
    { name: "Mai", peso: 69, meta: 70 },
    { name: "Jun", peso: 68, meta: 70 },
  ],
  patientsByMonth: [
    { name: "Jan", pacientes: 12 },
    { name: "Fev", pacientes: 18 },
    { name: "Mar", pacientes: 15 },
    { name: "Abr", pacientes: 22 },
    { name: "Mai", pacientes: 25 },
    { name: "Jun", pacientes: 28 },
  ],
  dietDistribution: [
    { name: "Low Carb", value: 35, color: "#8884d8" },
    { name: "Mediterrânea", value: 25, color: "#82ca9d" },
    { name: "Vegetariana", value: 20, color: "#ffc658" },
    { name: "Cetogênica", value: 15, color: "#ff7300" },
    { name: "Outras", value: 5, color: "#00ff00" },
  ],
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedReport, setSelectedReport] = useState("overview");

  const handleExport = (format: string) => {
    // Simular exportação
    console.log(`Exportando relatório em ${format}`);
    alert(`Relatório exportado em ${format.toUpperCase()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">
            Análises e insights sobre seus pacientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport("pdf")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <IconDownload className="h-4 w-4" />
            PDF
          </Button>
          <Button
            onClick={() => handleExport("excel")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <IconDownload className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Último mês</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="1year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Relatório
              </label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="patients">Pacientes</SelectItem>
                  <SelectItem value="progress">Progresso</SelectItem>
                  <SelectItem value="nutrition">Nutrição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IconUsers className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Pacientes
                </p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IconTrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Novos este Mês
                </p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IconChartBar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Meta Alcançada
                </p>
                <p className="text-2xl font-bold text-gray-900">73%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IconFileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Relatórios Gerados
                </p>
                <p className="text-2xl font-bold text-gray-900">342</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progresso de Peso */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso Médio de Peso</CardTitle>
            <CardDescription>
              Evolução do peso dos pacientes vs. meta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.weightProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Peso Atual"
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Meta"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Novos Pacientes por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Novos Pacientes por Mês</CardTitle>
            <CardDescription>Crescimento da base de pacientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.patientsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pacientes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Dietas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição de Tipos de Dieta</CardTitle>
            <CardDescription>
              Preferências dos pacientes por tipo de dieta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={mockData.dietDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.dietDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Detalhado</CardTitle>
          <CardDescription>
            Métricas principais dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Mês</th>
                  <th className="text-right py-3 px-4">Novos Pacientes</th>
                  <th className="text-right py-3 px-4">Meta Alcançada</th>
                  <th className="text-right py-3 px-4">Peso Médio</th>
                  <th className="text-right py-3 px-4">Satisfação</th>
                </tr>
              </thead>
              <tbody>
                {mockData.weightProgress.map((item, index) => (
                  <tr key={item.name} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-right">
                      {mockData.patientsByMonth[index]?.pacientes || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {Math.round((item.peso / item.meta) * 100)}%
                    </td>
                    <td className="py-3 px-4 text-right">{item.peso}kg</td>
                    <td className="py-3 px-4 text-right">
                      {Math.floor(Math.random() * 20) + 80}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
