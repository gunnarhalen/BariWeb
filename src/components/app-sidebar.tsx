"use client";

import Link from "next/link";
import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconClipboardList,
  IconUserPlus,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
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
      icon: IconDashboard,
    },
    {
      title: "Pacientes",
      url: "/patients",
      icon: IconUsers,
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: IconChartBar,
    },
    {
      title: "Solicitações",
      url: "/requests",
      icon: IconClipboardList,
    },
  ],
  navClouds: [
    {
      title: "Gestão de Pacientes",
      icon: IconUsers,
      isActive: true,
      url: "/patients",
      items: [
        {
          title: "Todos os Pacientes",
          url: "/patients",
        },
        {
          title: "Novos Pacientes",
          url: "/patients?filter=new",
        },
      ],
    },
    {
      title: "Relatórios",
      icon: IconReport,
      url: "/reports",
      items: [
        {
          title: "Relatório Mensal",
          url: "/reports/monthly",
        },
        {
          title: "Relatório de Progresso",
          url: "/reports/progress",
        },
      ],
    },
    {
      title: "Solicitações",
      icon: IconUserPlus,
      url: "/requests",
      items: [
        {
          title: "Novas Solicitações",
          url: "/requests/new",
        },
        {
          title: "Solicitações Pendentes",
          url: "/requests/pending",
        },
      ],
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
  documents: [
    {
      name: "Biblioteca Nutricional",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Relatórios",
      url: "/reports",
      icon: IconReport,
    },
    {
      name: "Planos Alimentares",
      url: "#",
      icon: IconClipboardList,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = {
    name: user?.displayName || "Dr. Nutricionista",
    email: user?.email || "nutricionista@bari.com",
    avatar: "/avatars/nutritionist.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Bari Web</span>
              </Link>
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
