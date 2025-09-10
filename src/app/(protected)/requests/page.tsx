"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getNutritionistRequests,
  acceptNutritionistRequest,
  rejectNutritionistRequest,
  revokeNutritionistRequest,
} from "@/services/nutritionistService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SiteHeader } from "@/components/site-header";
import {
  IconUserPlus,
  IconCheck,
  IconX,
  IconClock,
  IconUserCheck,
  IconUserX,
  IconUserMinus,
} from "@tabler/icons-react";

interface RequestWithProfile {
  id: string;
  nutritionistId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: "pending" | "accepted" | "rejected" | "revoked";
  createdAt: Date | { seconds: number; nanoseconds: number } | string;
  acceptedAt?: Date | { seconds: number; nanoseconds: number } | string;
  rejectedAt?: Date | { seconds: number; nanoseconds: number } | string;
  revokedAt?: Date | { seconds: number; nanoseconds: number } | string;
  revokedBy?: "user" | "nutritionist";
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
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

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

  const handleRevoke = async (requestId: string) => {
    setConfirmRemove(requestId);
  };

  const confirmRevoke = async () => {
    if (!confirmRemove) return;

    try {
      setRemoving(true);
      const result = await revokeNutritionistRequest(confirmRemove);

      if (result.success) {
        await loadRequests(); // Recarregar a lista
        setConfirmRemove(null);
      } else {
        console.error("Erro ao remover solicitação:", result.error);
      }
    } catch (error) {
      console.error("Erro ao remover solicitação:", error);
    } finally {
      setRemoving(false);
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
      case "revoked":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            <IconUserMinus className="w-3 h-3 mr-1" />
            Revogada
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
  const revokedRequests = requests.filter((r) => r.status === "revoked");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
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
            <div className="flex items-center justify-between px-4 lg:px-6">
              <div>
                <p className="text-gray-600 mt-2">
                  Gerencie as solicitações de pacientes que querem se associar a
                  você
                </p>
              </div>
              <div className="flex items-center gap-2">
                <IconUserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Estatísticas */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Pendentes</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {pendingRequests.length}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconClock className="size-4" />
                      Pendentes
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Aguardando resposta <IconClock className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Solicitações pendentes de aprovação
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Aceitas</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {acceptedRequests.length}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconUserCheck className="size-4" />
                      Aceitas
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Pacientes associados <IconUserCheck className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Solicitações aprovadas com sucesso
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Rejeitadas</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {rejectedRequests.length}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconUserX className="size-4" />
                      Rejeitadas
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Solicitações recusadas <IconUserX className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Solicitações que foram rejeitadas
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Revogadas</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {revokedRequests.length}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconUserMinus className="size-4" />
                      Revogadas
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Relacionamentos cancelados{" "}
                    <IconUserMinus className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Solicitações que foram revogadas
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Lista de Solicitações */}
            <div className="space-y-4 px-4 lg:px-6">
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
                      Quando pacientes solicitarem sua associação, elas
                      aparecerão aqui.
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
                                {request.patientProfile?.email ||
                                  "Não disponível"}
                              </p>
                              {request.patientProfile?.age && (
                                <p>
                                  <strong>Idade:</strong>{" "}
                                  {request.patientProfile.age} anos
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
                              {request.acceptedAt && (
                                <p>
                                  <strong>Aceito em:</strong>{" "}
                                  {formatDate(request.acceptedAt)}
                                </p>
                              )}
                              {request.rejectedAt && (
                                <p>
                                  <strong>Rejeitado em:</strong>{" "}
                                  {formatDate(request.rejectedAt)}
                                </p>
                              )}
                              {request.revokedAt && (
                                <p>
                                  <strong>Revogado em:</strong>{" "}
                                  {formatDate(request.revokedAt)}
                                  {request.revokedBy && (
                                    <span className="text-gray-500">
                                      {" "}
                                      (por{" "}
                                      {request.revokedBy === "user"
                                        ? "usuário"
                                        : "nutricionista"}
                                      )
                                    </span>
                                  )}
                                </p>
                              )}
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

                          {request.status === "accepted" && (
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevoke(request.id)}
                                disabled={processing === request.id}
                                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                              >
                                <IconUserMinus className="w-4 h-4 mr-1" />
                                Remover
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
        </div>
      </div>

      {/* Diálogo de Confirmação para Remover */}
      <AlertDialog
        open={!!confirmRemove}
        onOpenChange={() => setConfirmRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta relação? Esta ação não pode
              ser desfeita. O paciente não terá mais acesso aos seus serviços de
              nutrição.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevoke}
              className="bg-red-600 hover:bg-red-700"
            >
              {removing ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Removendo...
                </>
              ) : (
                "Remover"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
