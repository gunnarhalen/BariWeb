"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  IconDashboard,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { name: "Pacientes", href: "/patients", icon: IconUsers },
    { name: "Relatórios", href: "/reports", icon: IconChartBar },
    { name: "Configurações", href: "/settings", icon: IconSettings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900">Bari Web</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <IconX className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Nutricionista</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <IconLogout className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Bari Web</h1>
          </div>
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">Nutricionista</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <IconLogout className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header Mobile */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 bg-white border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu2 className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Bari Web</h1>
            <div className="w-9" /> {/* Spacer */}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
