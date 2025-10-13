"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { RegisterForm } from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const router = useRouter();
  const { user, isNutritionist, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && isNutritionist) {
        // Usuário já logado e é nutricionista - ir para área logada
        router.push("/patients");
      } else if (user && !isNutritionist) {
        // Usuário já logado mas não é nutricionista - ir para completar perfil
        router.push("/complete-profile");
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

  // Se usuário já estiver logado, não mostrar o formulário
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="cursor-pointer hover:bg-transparent"
            >
              <Logo width={120} />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/login_background.png')",
            backgroundSize: "70%",
            backgroundRepeat: "repeat",
            opacity: 0.3,
          }}
        />
      </div>
    </div>
  );
}
