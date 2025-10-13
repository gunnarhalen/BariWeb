"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Função para determinar o título baseado na rota
  const getPageTitle = () => {
    switch (pathname) {
      case "/patients":
        return "Pacientes";
      case "/reports":
        return "Relatórios";
      case "/requests":
        return "Solicitações";
      case "/settings":
        return "Configurações";
      default:
        if (pathname.startsWith("/patients/")) {
          return "Detalhes do Paciente";
        }
        return "Pacientes";
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Bem-vindo, {user?.displayName || user?.email || "Nutricionista"}
          </span>
        </div>
      </div>
    </header>
  );
}
