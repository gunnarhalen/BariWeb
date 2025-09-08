"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isNutritionist, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Se não estiver logado, redirecionar para login
        router.push("/login");
      } else if (!isNutritionist) {
        // Se estiver logado mas não for nutricionista, redirecionar para unauthorized
        router.push("/unauthorized");
      }
    }
  }, [user, isNutritionist, loading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Se não estiver logado ou não for nutricionista, não renderizar nada
  if (!user || !isNutritionist) {
    return null;
  }

  // Se estiver logado e for nutricionista, renderizar o conteúdo
  return <>{children}</>;
}
