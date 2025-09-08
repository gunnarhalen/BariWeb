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
import { isNutritionist } from "@/services/nutritionistService";

interface AuthContextType {
  user: User | null;
  isNutritionist: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isNutritionistUser, setIsNutritionistUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Verificar se é nutricionista
        const isNutri = await isNutritionist(user.uid);
        setIsNutritionistUser(isNutri);

        // Se o usuário está logado mas não é nutricionista, redirecionar
        if (!isNutri) {
          router.push("/unauthorized");
        }
      } else {
        setIsNutritionistUser(false);
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
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const value = {
    user,
    isNutritionist: isNutritionistUser,
    loading,
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
