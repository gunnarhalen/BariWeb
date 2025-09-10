"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  IconLayoutDashboardFilled,
  IconHelp,
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

// Configuração da navegação
const navigationData = {
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
      title: "Conta",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, nutritionistProfile } = useAuth();

  // Memoizar o nome do usuário para evitar recálculos desnecessários
  const userDisplayName = useMemo(() => {
    const displayName = nutritionistProfile?.fullName || user?.displayName;

    if (!displayName) return "Nutricionista";

    // Remove "Dr." se presente e extrai os dois primeiros nomes
    const cleanName = displayName.replace(/^Dr\.?\s*/i, "").trim();
    const nameParts = cleanName.split(/\s+/);

    return nameParts.length >= 2
      ? `${nameParts[0]} ${nameParts[1]}`
      : nameParts[0] || "Nutricionista";
  }, [nutritionistProfile?.fullName, user?.displayName]);

  // Memoizar os dados do usuário
  const userData = useMemo(
    () => ({
      name: userDisplayName,
      email: user?.email || "nutricionista@bari.com",
    }),
    [userDisplayName, user?.email]
  );

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
        <NavMain items={navigationData.navMain} />
        <NavDocuments items={navigationData.documents} />
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
