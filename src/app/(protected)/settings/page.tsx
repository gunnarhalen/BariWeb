"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconUser,
  IconShield,
  IconBell,
  IconPalette,
  IconLogout,
  IconDeviceFloppy,
} from "@tabler/icons-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Estados do formulário
  const [profileData, setProfileData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    crn: "",
    specialization: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    patientUpdates: true,
    systemAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    autoSave: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Configurações salvas com sucesso!");
    } catch {
      alert("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: IconUser },
    { id: "notifications", label: "Notificações", icon: IconBell },
    { id: "preferences", label: "Preferências", icon: IconPalette },
    { id: "security", label: "Segurança", icon: IconShield },
  ];

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Header */}
            <div className="flex justify-between items-center px-4 lg:px-6">
              <div>
                <p className="text-gray-600">
                  Gerencie suas informações e preferências
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <IconDeviceFloppy className="h-4 w-4" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              activeTab === tab.id
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Conteúdo */}
              <div className="lg:col-span-3">
                {/* Perfil */}
                {activeTab === "profile" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Perfil</CardTitle>
                      <CardDescription>
                        Atualize suas informações pessoais e profissionais
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                name: e.target.value,
                              })
                            }
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            placeholder="seu@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                        <div>
                          <Label htmlFor="crn">CRN</Label>
                          <Input
                            id="crn"
                            value={profileData.crn}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                crn: e.target.value,
                              })
                            }
                            placeholder="12345"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: e.target.value,
                            })
                          }
                          placeholder="Rua, número, bairro, cidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialization">Especialização</Label>
                        <Select
                          value={profileData.specialization}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              specialization: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua especialização" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinical">
                              Nutrição Clínica
                            </SelectItem>
                            <SelectItem value="sports">
                              Nutrição Esportiva
                            </SelectItem>
                            <SelectItem value="pediatric">
                              Nutrição Pediátrica
                            </SelectItem>
                            <SelectItem value="geriatric">
                              Nutrição Geriátrica
                            </SelectItem>
                            <SelectItem value="functional">
                              Nutrição Funcional
                            </SelectItem>
                            <SelectItem value="other">Outras</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notificações */}
                {activeTab === "notifications" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notificações</CardTitle>
                      <CardDescription>
                        Configure como você deseja receber notificações
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Notificações por Email</Label>
                            <p className="text-sm text-gray-600">
                              Receber atualizações importantes por email
                            </p>
                          </div>
                          <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                emailNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Notificações Push</Label>
                            <p className="text-sm text-gray-600">
                              Receber notificações no navegador
                            </p>
                          </div>
                          <Switch
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                pushNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Relatórios Semanais</Label>
                            <p className="text-sm text-gray-600">
                              Receber resumo semanal de atividades
                            </p>
                          </div>
                          <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                weeklyReports: checked,
                              })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Atualizações de Pacientes</Label>
                            <p className="text-sm text-gray-600">
                              Notificar sobre mudanças nos pacientes
                            </p>
                          </div>
                          <Switch
                            checked={notifications.patientUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                patientUpdates: checked,
                              })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Alertas do Sistema</Label>
                            <p className="text-sm text-gray-600">
                              Receber alertas importantes do sistema
                            </p>
                          </div>
                          <Switch
                            checked={notifications.systemAlerts}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                systemAlerts: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Preferências */}
                {activeTab === "preferences" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências</CardTitle>
                      <CardDescription>
                        Personalize sua experiência na plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Tema</Label>
                          <Select
                            value={preferences.theme}
                            onValueChange={(value) =>
                              setPreferences({ ...preferences, theme: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Claro</SelectItem>
                              <SelectItem value="dark">Escuro</SelectItem>
                              <SelectItem value="auto">Automático</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Idioma</Label>
                          <Select
                            value={preferences.language}
                            onValueChange={(value) =>
                              setPreferences({
                                ...preferences,
                                language: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt-BR">
                                Português (Brasil)
                              </SelectItem>
                              <SelectItem value="en-US">
                                English (US)
                              </SelectItem>
                              <SelectItem value="es-ES">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Fuso Horário</Label>
                          <Select
                            value={preferences.timezone}
                            onValueChange={(value) =>
                              setPreferences({
                                ...preferences,
                                timezone: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">
                                São Paulo (GMT-3)
                              </SelectItem>
                              <SelectItem value="America/New_York">
                                Nova York (GMT-5)
                              </SelectItem>
                              <SelectItem value="Europe/London">
                                Londres (GMT+0)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Formato de Data</Label>
                          <Select
                            value={preferences.dateFormat}
                            onValueChange={(value) =>
                              setPreferences({
                                ...preferences,
                                dateFormat: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">
                                DD/MM/YYYY
                              </SelectItem>
                              <SelectItem value="MM/DD/YYYY">
                                MM/DD/YYYY
                              </SelectItem>
                              <SelectItem value="YYYY-MM-DD">
                                YYYY-MM-DD
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Salvamento Automático</Label>
                          <p className="text-sm text-gray-600">
                            Salvar alterações automaticamente
                          </p>
                        </div>
                        <Switch
                          checked={preferences.autoSave}
                          onCheckedChange={(checked) =>
                            setPreferences({
                              ...preferences,
                              autoSave: checked,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Segurança */}
                {activeTab === "security" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Segurança</CardTitle>
                      <CardDescription>
                        Gerencie a segurança da sua conta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Alterar Senha</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Para sua segurança, recomendamos alterar sua senha
                            regularmente
                          </p>
                          <Button variant="outline">Alterar Senha</Button>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">
                            Autenticação de Dois Fatores
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Adicione uma camada extra de segurança à sua conta
                          </p>
                          <Button variant="outline">Configurar 2FA</Button>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Sessões Ativas</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Gerencie os dispositivos conectados à sua conta
                          </p>
                          <Button variant="outline">Ver Sessões</Button>
                        </div>
                      </div>
                      <Separator />
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-800 mb-2">
                          Zona de Perigo
                        </h4>
                        <p className="text-sm text-red-600 mb-4">
                          Ações irreversíveis que afetam sua conta
                        </p>
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="flex items-center gap-2"
                        >
                          <IconLogout className="h-4 w-4" />
                          Sair da Conta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmação para Logout */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair da sua conta? Você precisará fazer
              login novamente para acessar o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              <IconLogout className="h-4 w-4 mr-2" />
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
