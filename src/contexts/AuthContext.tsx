"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import {
  isNutritionist,
  getNutritionistProfile,
} from "@/services/nutritionistService";

interface NutritionistProfile {
  id: string;
  fullName?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isNutritionist: boolean;
  loading: boolean;
  nutritionistProfile: NutritionistProfile | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isNutritionistUser, setIsNutritionistUser] = useState(false);
  const [nutritionistProfile, setNutritionistProfile] =
    useState<NutritionistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Verificar se é nutricionista
        const isNutri = await isNutritionist(user.uid);
        setIsNutritionistUser(isNutri);

        if (isNutri) {
          // Buscar perfil do nutricionista
          const profile = await getNutritionistProfile(user.uid);
          setNutritionistProfile(profile);
        } else {
          setNutritionistProfile(null);
          // Se o usuário está logado mas não é nutricionista, redirecionar
          router.push("/unauthorized");
        }
      } else {
        setIsNutritionistUser(false);
        setNutritionistProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Verificar se é nutricionista
      const isNutri = await isNutritionist(userCredential.user.uid);

      if (!isNutri) {
        // Se não for nutricionista, fazer logout e redirecionar
        await signOut(auth);
        router.push("/unauthorized");
        return false;
      }

      // Se for nutricionista, redirecionar para o dashboard
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Não fazer redirecionamento manual aqui - deixar o ProtectedRoute gerenciar
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const value = {
    user,
    isNutritionist: isNutritionistUser,
    loading,
    nutritionistProfile,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
