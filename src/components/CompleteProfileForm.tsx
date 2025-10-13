"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconAlertTriangle,
  IconCheck,
  IconStethoscope,
} from "@tabler/icons-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface CompleteProfileFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function CompleteProfileForm({
  className,
  ...props
}: CompleteProfileFormProps) {
  const [crnRegion, setCrnRegion] = useState("");
  const [crnNumber, setCrnNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      // Erro silencioso no logout
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!crnRegion || !crnNumber) {
      setError("Preencha região e número do CRN");
      setLoading(false);
      return;
    }

    const crnNumberRegex = /^(T|PJ)?(\d{4,})([PS])?$/;
    if (!crnNumberRegex.test(crnNumber)) {
      setError("CRN inválido");
      setLoading(false);
      return;
    }

    const fullCrn = `CRN-${crnRegion}/${crnNumber}`;

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Usuário não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      // Criar documento em nutritionists/
      await setDoc(doc(db, "nutritionists", user.uid), {
        email: user.email,
        fullName: user.displayName,
        cfnCrn: fullCrn,
        createdAt: new Date(),
        verified: false,
      });

      // Criar perfil em users/{uid}/profile/data
      await setDoc(doc(db, "users", user.uid, "profile", "data"), {
        email: user.email,
        fullName: user.displayName,
        cfnCrn: fullCrn,
        isNutritionist: true,
      });

      const nutritionistDoc = await getDoc(doc(db, "nutritionists", user.uid));

      if (nutritionistDoc.exists()) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/patients";
        }, 2000);
      } else {
        throw new Error("Erro ao verificar criação do perfil");
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "code" in error) {
        switch ((error as { code: string }).code) {
          case "permission-denied":
            setError("Erro ao salvar dados profissionais. Contate o suporte.");
            break;
          default:
            setError("Erro ao completar perfil. Tente novamente");
        }
      } else {
        setError("Erro ao completar perfil. Tente novamente");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tela de sucesso
  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-4 bg-green-100 rounded-full mb-2">
            <IconCheck className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Perfil Completo!</h1>
          <p className="text-sm text-muted-foreground">
            Seu CRN foi cadastrado com sucesso
          </p>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <p className="text-green-800">
              Perfil completado com sucesso! Você será redirecionado para a área
              de pacientes.
            </p>
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-muted-foreground">
            Redirecionando...
          </span>
        </div>
      </div>
    );
  }

  // Formulário de completar perfil
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-3 bg-blue-100 rounded-full mb-2">
          <IconStethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Complete seu Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Informe seu CRN para acessar a área do nutricionista
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <IconStethoscope className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <p className="text-blue-800 text-sm">
            <strong>Área exclusiva para nutricionistas.</strong> Informe seu
            registro profissional para continuar.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="crnRegion">CRN - Conselho Regional de Nutrição</Label>
          <div className="flex gap-2">
            <Select value={crnRegion} onValueChange={setCrnRegion} required>
              <SelectTrigger size="xl" className="w-[140px]">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">CRN-1</SelectItem>
                <SelectItem value="2">CRN-2</SelectItem>
                <SelectItem value="3">CRN-3</SelectItem>
                <SelectItem value="4">CRN-4</SelectItem>
                <SelectItem value="5">CRN-5</SelectItem>
                <SelectItem value="6">CRN-6</SelectItem>
                <SelectItem value="7">CRN-7</SelectItem>
                <SelectItem value="8">CRN-8</SelectItem>
                <SelectItem value="9">CRN-9</SelectItem>
                <SelectItem value="10">CRN-10</SelectItem>
                <SelectItem value="11">CRN-11</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="crnNumber"
              type="text"
              placeholder="Ex: 12345, T12345, PJ12345"
              value={crnNumber}
              onChange={(e) => setCrnNumber(e.target.value.toUpperCase())}
              className="flex-1"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Exemplos: 12345, 12345P, T12345, PJ12345
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <IconAlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          size="xl"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              Salvando...
            </div>
          ) : (
            "Completar Perfil"
          )}
        </Button>

        <div className="text-center text-sm space-y-2">
          <div>
            <span className="text-muted-foreground">Não é nutricionista? </span>
            <Button
              type="button"
              onClick={() => router.push("/")}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:underline hover:bg-transparent p-0 h-auto cursor-pointer"
            >
              Voltar ao início
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:underline hover:bg-transparent p-0 h-auto cursor-pointer"
            >
              Fazer logout
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
