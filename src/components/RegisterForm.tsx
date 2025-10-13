"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "@/config/firebase";
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
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface RegisterFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [crnRegion, setCrnRegion] = useState("");
  const [crnNumber, setCrnNumber] = useState("");
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

    // Validar CRN
    if (!crnRegion || !crnNumber) {
      setError("Preencha região e número do CRN");
      setLoading(false);
      return;
    }

    // Validar número do CRN (aceita vários formatos)
    // Formatos: 12345, 12345P, 12345S, T12345, T12345P, PJ12345
    const crnNumberRegex = /^(T|PJ)?(\d{4,})([PS])?$/;
    if (!crnNumberRegex.test(crnNumber)) {
      setError("CRN inválido");
      setLoading(false);
      return;
    }

    // Montar CRN completo
    const fullCrn = `CRN-${crnRegion}/${crnNumber}`;

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

      // Criar documento em nutritionists/
      await setDoc(doc(db, "nutritionists", userCredential.user.uid), {
        email: email,
        fullName: fullName,
        crn: fullCrn,
        createdAt: new Date(),
        verified: false,
      });

      // Criar perfil em users/{uid}/profile/data
      await setDoc(
        doc(db, "users", userCredential.user.uid, "profile", "data"),
        {
          email: email,
          fullName: fullName,
          crn: fullCrn,
          isNutritionist: true,
        }
      );

      // Fazer logout para evitar que o AuthContext redirecione antes dos dados estarem prontos
      await signOut(auth);

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
              Sua conta de nutricionista foi criada. Você será redirecionado
              para fazer login e começar a gerenciar seus pacientes.
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
        <h1 className="text-2xl font-bold">Criar Conta de Nutricionista</h1>
        <p className="text-muted-foreground text-sm">
          Cadastre-se para gerenciar seus pacientes e acompanhamentos
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
          <Label htmlFor="email">Email profissional</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu.email@profissional.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="crnRegion">CRN - Conselho Regional de Nutrição</Label>
          <div className="flex gap-2">
            <Select value={crnRegion} onValueChange={setCrnRegion} required>
              <SelectTrigger className="w-[140px]">
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
