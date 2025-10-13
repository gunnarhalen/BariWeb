"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  IconAlertTriangle,
  IconMail,
  IconArrowLeft,
  IconStethoscope,
} from "@tabler/icons-react";
import { GoogleIcon } from "@/components/ui/google-icon";

interface LoginFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || "Erro ao fazer login. Tente novamente.");
      }
    } catch (error: unknown) {
      console.error("Erro no login:", error);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || "Erro ao fazer login com Google");
      }
    } catch (error) {
      setError("Erro ao fazer login com Google");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simular envio de email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } catch {
      setError("Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Tela de confirmação de email enviado
  if (isEmailSent) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Email Enviado!</h1>
        </div>

        <Alert className="border-gray-200 bg-gray-50">
          <IconMail className="h-4 w-4" />
          <AlertDescription>
            <p>
              <strong>Enviamos um link de recuperação para seu email.</strong>
            </p>
            <p>Verifique sua caixa de entrada e siga as instruções.</p>
            <p>
              Não recebeu o email? Verifique sua pasta de spam ou tente
              novamente.
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          <Button
            onClick={() => setIsEmailSent(false)}
            variant="outline"
            size="xl"
            className="w-full"
          >
            Tentar Novamente
          </Button>
          <Button
            onClick={() => {
              setIsEmailSent(false);
              setIsForgotPassword(false);
            }}
            variant="ghost"
            size="xl"
            className="w-full"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

  // Formulário de recuperação de senha
  if (isForgotPassword) {
    return (
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleForgotPassword}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          <p className="text-muted-foreground text-sm">
            Digite seu email para receber um link de recuperação
          </p>
        </div>

        <div className="grid gap-6">
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

          {error && (
            <Alert variant="destructive">
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="xl" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                Enviando...
              </div>
            ) : (
              "Enviar Link de Recuperação"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:underline hover:bg-transparent p-0 h-auto cursor-pointer"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Login
            </Button>
          </div>
        </div>
      </form>
    );
  }

  // Formulário de login padrão
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-3 bg-blue-100 rounded-full mb-2">
          <IconStethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Área do Nutricionista</h1>
        <p className="text-muted-foreground text-sm">
          Acesse sua conta para acompanhar seus pacientes
        </p>
      </div>

      <div className="grid gap-6">
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
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-center">
            <Button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:underline hover:bg-transparent p-0 h-auto cursor-pointer"
            >
              Esqueceu sua senha?
            </Button>
          </div>
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
              Entrando...
            </div>
          ) : (
            "Entrar"
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
          size="xl"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full cursor-pointer"
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continuar com Google
            </>
          )}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Não tem uma conta? </span>
          <Button
            type="button"
            onClick={() => (window.location.href = "/register")}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:underline hover:bg-transparent p-0 h-auto cursor-pointer"
          >
            Criar conta
          </Button>
        </div>
      </div>
    </form>
  );
}
