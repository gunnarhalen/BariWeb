"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconShieldX, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <IconShieldX className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acesso Negado
          </CardTitle>
          <CardDescription className="text-gray-600">
            Você não tem permissão para acessar esta área
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            <p>
              Esta área é restrita apenas para nutricionistas cadastrados. Se
              você é um nutricionista e acredita que isso é um erro, entre em
              contato com o suporte.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleGoBack} className="w-full" variant="default">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>

            <Button
              onClick={() => router.push("/login")}
              className="w-full"
              variant="outline"
            >
              Tentar Login Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
