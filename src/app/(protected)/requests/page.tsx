"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getNutritionistRequests,
  acceptNutritionistRequest,
  rejectNutritionistRequest,
} from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconUserPlus,
  IconCheck,
  IconX,
  IconClock,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";

interface RequestWithProfile {
  id: string;
  nutritionistId: string;
  userId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date | { seconds: number; nanoseconds: number } | string;
  patientProfile: {
    fullName: string;
    email: string;
    age?: number;
    gender?: string;
    goals?: unknown;
  } | null;
}

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const requestsData = await getNutritionistRequests(user.uid);
      setRequests(requestsData);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user, loadRequests]);

  const handleAccept = async (requestId: string) => {
    try {
      setProcessing(requestId);
      const result = await acceptNutritionistRequest(requestId);

      if (result.success) {
        await loadRequests(); // Recarregar a lista
      } else {
        console.error("Erro ao aceitar solicitação:", result.error);
      }
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessing(requestId);
      const result = await rejectNutritionistRequest(requestId);

      if (result.success) {
        await loadRequests(); // Recarregar a lista
      } else {
        console.error("Erro ao rejeitar solicitação:", result.error);
      }
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <IconClock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <IconUserCheck className="w-3 h-3 mr-1" />
            Aceita
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <IconUserX className="w-3 h-3 mr-1" />
            Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (
    timestamp: Date | { seconds: number; nanoseconds: number } | string
  ) => {
    if (!timestamp) return "Data não disponível";

    try {
      let date: Date;
      if (typeof timestamp === "object" && "toDate" in timestamp) {
        date = (timestamp as { toDate: () => Date }).toDate();
      } else if (typeof timestamp === "object" && "seconds" in timestamp) {
        date = new Date((timestamp as { seconds: number }).seconds * 1000);
      } else {
        date = new Date(timestamp as string);
      }

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const acceptedRequests = requests.filter((r) => r.status === "accepted");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as solicitações de pacientes que querem se associar a você
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconUserPlus className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <IconClock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando sua resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aceitas</CardTitle>
            <IconUserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {acceptedRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pacientes associados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <IconUserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Solicitações recusadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Solicitações */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Todas as Solicitações
        </h2>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <IconUserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma solicitação encontrada
              </h3>
              <p className="text-gray-500">
                Quando pacientes solicitarem sua associação, elas aparecerão
                aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.patientProfile?.fullName ||
                            "Nome não disponível"}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Email:</strong>{" "}
                          {request.patientProfile?.email || "Não disponível"}
                        </p>
                        {request.patientProfile?.age && (
                          <p>
                            <strong>Idade:</strong> {request.patientProfile.age}{" "}
                            anos
                          </p>
                        )}
                        {request.patientProfile?.gender && (
                          <p>
                            <strong>Gênero:</strong>{" "}
                            {request.patientProfile.gender}
                          </p>
                        )}
                        <p>
                          <strong>Solicitado em:</strong>{" "}
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.id)}
                          disabled={processing === request.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <IconCheck className="w-4 h-4 mr-1" />
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                          disabled={processing === request.id}
                        >
                          <IconX className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
