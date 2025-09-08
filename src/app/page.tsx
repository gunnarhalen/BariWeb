"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/Logo";
import {
  IconUsers,
  IconChartBar,
  IconShield,
  IconTrendingUp,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";

export default function LandingPage() {
  const { user, isNutritionist, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && isNutritionist) {
        router.push("/dashboard");
      }
    }
  }, [user, isNutritionist, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se já estiver logado como nutricionista, não mostra a landing
  if (user && isNutritionist) {
    return null;
  }

  const features = [
    {
      icon: IconUsers,
      title: "Gestão de Pacientes",
      description:
        "Acompanhe todos os seus pacientes em um só lugar com dados organizados e atualizados.",
    },
    {
      icon: IconChartBar,
      title: "Análise de Dados",
      description:
        "Visualize gráficos detalhados dos macros e progresso nutricional dos seus pacientes.",
    },
    {
      icon: IconShield,
      title: "Segurança Total",
      description:
        "Dados protegidos com criptografia e acesso restrito apenas para nutricionistas.",
    },
    {
      icon: IconTrendingUp,
      title: "Relatórios Avançados",
      description:
        "Gere relatórios profissionais para acompanhamento e documentação.",
    },
  ];

  const benefits = [
    "Acesso exclusivo para nutricionistas",
    "Interface intuitiva e responsiva",
    "Sincronização em tempo real",
    "Relatórios exportáveis",
    "Suporte técnico especializado",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Logo width={120} height={30} />
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Central de Acompanhamento
            <span className="text-blue-600 block">para Nutricionistas</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie seus pacientes, acompanhe o progresso nutricional e gere
            relatórios profissionais com a plataforma mais completa do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Acessar Plataforma
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para acompanhar seus pacientes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa desenvolvida especificamente para
              nutricionistas profissionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Por que escolher o Bari Web?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desenvolvido por especialistas em nutrição e tecnologia,
                oferecemos a melhor experiência para profissionais da área.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <IconCheck className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Pronto para começar?
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Acesse sua conta de nutricionista e comece a acompanhar seus
                pacientes hoje mesmo.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              >
                Fazer Login
                <IconArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Logo width={120} height={30} className="text-white" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Central de Acompanhamento para Nutricionistas
              </p>
              <p className="text-sm text-gray-500">
                © 2024 Bari Web. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
