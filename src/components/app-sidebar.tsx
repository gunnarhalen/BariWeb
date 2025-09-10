"use client";

import * as React from "react";
import {
  IconLayoutDashboardFilled,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
  IconFileAnalytics,
  IconClipboardList,
  IconUserPlus,
  IconBook2,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import Logo from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboardFilled,
    },
    {
      title: "Pacientes",
      url: "/patients",
      icon: IconUsers,
    },
    {
      title: "Solicitações",
      url: "/requests",
      icon: IconUserPlus,
    },
  ],
  documents: [
    {
      name: "Biblioteca Nutricional",
      url: "#",
      icon: IconBook2,
    },
    {
      name: "Relatórios",
      url: "/reports",
      icon: IconFileAnalytics,
    },
    {
      name: "Planos Alimentares",
      url: "#",
      icon: IconClipboardList,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, nutritionistProfile } = useAuth();

  // Função para extrair os dois primeiros nomes do usuário
  const getUserDisplayName = () => {
    // Priorizar o nome do perfil do nutricionista
    const displayName = nutritionistProfile?.fullName || user?.displayName;

    if (!displayName) return "Nutricionista";

    // Remove "Dr." se presente e extrai os dois primeiros nomes
    const cleanName = displayName.replace(/^Dr\.?\s*/i, "");
    const nameParts = cleanName.trim().split(" ");

    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[1]}`;
    }

    return nameParts[0] || "Nutricionista";
  };

  const userData = {
    name: getUserDisplayName(),
    email: user?.email || "nutricionista@bari.com",
    avatar: "/avatars/nutritionist.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent hover:text-current">
              <Logo width={84} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
