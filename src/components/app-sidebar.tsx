"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  IconLayoutDashboardFilled,
  IconHelp,
  IconSettings,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";

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
import { usePendingRequests } from "@/hooks/use-pending-requests";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, nutritionistProfile } = useAuth();
  const { pendingCount } = usePendingRequests();

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

  // Memoizar os dados de navegação com notificações
  const navigationWithNotifications = useMemo(
    () => ({
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
          notificationCount: pendingCount > 0 ? pendingCount : undefined,
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
    }),
    [pendingCount]
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
        <NavMain items={navigationWithNotifications.navMain} />
        <NavSecondary
          items={navigationWithNotifications.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
