import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNutritionistRequests } from "@/services/nutritionistService";

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

export function usePendingRequests() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPendingRequests = useCallback(async () => {
    if (!user) {
      setPendingCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const requestsData = await getNutritionistRequests(user.uid);
      const pendingRequests = requestsData.filter(
        (r) => r.status === "pending"
      );
      setPendingCount(pendingRequests.length);
    } catch (error) {
      console.error("Erro ao buscar solicitações pendentes:", error);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPendingRequests();

    // Atualizar a cada 30 segundos para manter as notificações atualizadas
    const interval = setInterval(fetchPendingRequests, 30000);

    return () => clearInterval(interval);
  }, [fetchPendingRequests]);

  return {
    pendingCount,
    loading,
    refetch: fetchPendingRequests,
  };
}
