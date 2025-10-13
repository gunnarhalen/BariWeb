"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
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
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Atualizar o perfil com o nome
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro ao criar conta:", error);

      // Tratar erros do Firebase
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
        </div>

        <Alert className="border-green-200 bg-green-50">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <p className="text-green-800">
              Sua conta foi criada. Você será redirecionado para fazer login.
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
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Seu nome completo"
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
