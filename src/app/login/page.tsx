"use client";

import Logo from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Logo width={24} height={24} />
            </div>
            Bari Web
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <Logo width={200} height={50} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Central de Acompanhamento
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Gerencie seus pacientes de forma eficiente com nossa plataforma
              especializada para nutricionistas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
