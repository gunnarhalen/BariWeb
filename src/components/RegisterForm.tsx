"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  IconAlertTriangle,
  IconCheck,
  IconStethoscope,
  IconBrandGoogle,
} from "@tabler/icons-react";

interface RegisterFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || "Erro ao fazer cadastro com Google");
      }
    } catch (error) {
      setError("Erro ao fazer cadastro com Google");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/complete-profile");
      }, 1500);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "code" in error) {
        switch ((error as { code: string }).code) {
          case "auth/email-already-in-use":
            setError("Este email já está cadastrado");
            break;
          case "auth/invalid-email":
            setError("Email inválido");
            break;
          case "auth/operation-not-allowed":
            setError("Operação não permitida");
            break;
          case "auth/weak-password":
            setError("Senha muito fraca. Use pelo menos 6 caracteres");
            break;
          case "permission-denied":
            setError("Erro ao salvar dados profissionais. Contate o suporte.");
            break;
          default:
            setError("Erro ao criar conta. Tente novamente");
        }
      } else {
        setError("Erro ao criar conta. Tente novamente");
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
          <h1 className="text-2xl font-bold">Conta criada com sucesso!</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo(a) à plataforma Bari para nutricionistas
          </p>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <p className="text-green-800">
              Conta criada com sucesso! Redirecionando...
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

  // Formulário de registro
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleRegister}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-3 bg-blue-100 rounded-full mb-2">
          <IconStethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Criar Conta</h1>
        <p className="text-muted-foreground text-sm">
          Cadastre-se para acessar a plataforma
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <IconStethoscope className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <p className="text-blue-800 text-sm">
            <strong>Área exclusiva para profissionais.</strong> Esta plataforma
            é destinada a nutricionistas para gestão de pacientes.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Dr(a). Seu nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <IconAlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              Criando conta...
            </div>
          ) : (
            "Criar Conta"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <IconBrandGoogle className="mr-2 h-4 w-4" />
              Continuar com Google
            </>
          )}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:underline hover:bg-transparent p-0 h-auto cursor-pointer"
          >
            Fazer login
          </Button>
        </div>
      </div>
    </form>
  );
}
