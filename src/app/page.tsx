"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  IconUsers,
  IconChartBar,
  IconShield,
  IconTrendingUp,
  IconArrowRight,
  IconCheck,
  IconHeart,
  IconTarget,
  IconSparkles,
  IconBolt,
  IconBrandApple,
  IconBrandGooglePlay,
  IconDeviceMobile,
  IconUserCheck,
  IconBrain,
} from "@tabler/icons-react";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // Se já estiver logado como nutricionista, não mostra a landing
  if (user && isNutritionist) {
    return null;
  }

  const userFeatures = [
    {
      icon: IconDeviceMobile,
      title: "App Intuitivo",
      description: "Interface simples e fácil de usar para acompanhar sua alimentação diária.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: IconChartBar,
      title: "Insights Personalizados",
      description: "Receba análises automáticas dos seus hábitos alimentares e sugestões.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: IconHeart,
      title: "Saúde em Primeiro",
      description: "Foque no seu bem-estar com acompanhamento nutricional completo.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: IconShield,
      title: "Privacidade Total",
      description: "Seus dados são seus. Controle total sobre suas informações pessoais.",
      color: "from-purple-500 to-violet-500",
    },
  ];

  const nutritionistFeatures = [
    {
      icon: IconUsers,
      title: "Gestão de Pacientes",
      description: "Acompanhe todos os seus pacientes em uma plataforma centralizada.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: IconTrendingUp,
      title: "Relatórios Profissionais",
      description: "Gere relatórios detalhados para acompanhamento clínico.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: IconUserCheck,
      title: "Acompanhamento Remoto",
      description: "Monitore o progresso dos seus pacientes em tempo real.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: IconBrain,
      title: "Insights Avançados",
      description: "Análises inteligentes para melhorar seus atendimentos.",
      color: "from-purple-500 to-violet-500",
    },
  ];

  const stats = [
    { number: "50K+", label: "Usuários Ativos" },
    { number: "500+", label: "Nutricionistas" },
    { number: "1M+", label: "Refeições Registradas" },
    { number: "4.8★", label: "Avaliação App Store" },
  ];

  const benefits = [
    "Registro fácil de refeições",
    "Lembretes personalizados",
    "Metas adaptáveis",
    "Histórico completo",
    "Integração com wearables",
    "Suporte nutricional opcional",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <PublicHeader showHomeLink={true} />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:bg-transparent">
        <div
          className="absolute inset-0 bg-contain bg-right bg-no-repeat hidden md:block"
          style={{ backgroundImage: "url('/home-header-bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-white/0 hidden md:block"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="max-w-full md:max-w-[50%]">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
              <IconSparkles className="w-4 h-4 mr-2" />
              Sua jornada para uma vida mais saudável
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Transforme sua
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Alimentação
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              O app mais completo para acompanhar sua alimentação e alcançar seus objetivos de saúde. Use sozinho ou
              conecte-se com seu nutricionista.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-16">
              <Button
                variant="outline"
                size="lg"
                className="bg-black text-white hover:bg-gray-800 border-black px-6 py-3"
              >
                <IconBrandApple className="mr-2 h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs">Baixar na</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-black text-white hover:bg-gray-800 border-black px-6 py-3"
              >
                <IconBrandGooglePlay className="mr-2 h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs">Disponível no</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
              <IconBolt className="w-4 h-4 mr-2" />
              Para Você
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Tudo que você precisa para
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {" "}
                uma vida mais saudável
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Um app completo para registrar refeições, acompanhar metas e receber insights personalizados sobre sua
              alimentação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-6 p-4 bg-gradient-to-r ${feature.color} rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200">
                <IconHeart className="w-4 h-4 mr-2" />
                Por que escolher o Bari?
              </Badge>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Desenvolvido para
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {" "}
                  sua jornada
                </span>
              </h2>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Nosso app combina tecnologia avançada com simplicidade, oferecendo a melhor experiência para quem busca
                uma vida mais saudável.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1">
                      <IconCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl w-fit mx-auto mb-6">
                      <IconTarget className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Pronto para começar?</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Baixe o app gratuitamente e comece sua jornada para uma alimentação mais saudável hoje mesmo.
                    </p>
                  </div>

                  {/* App Store Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800 border-black px-6 py-3"
                    >
                      <IconBrandApple className="mr-2 h-6 w-6" />
                      <div className="text-left">
                        <div className="text-xs">Baixar na</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800 border-black px-6 py-3"
                    >
                      <IconBrandGooglePlay className="mr-2 h-6 w-6" />
                      <div className="text-left">
                        <div className="text-xs">Disponível no</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-slate-500 mt-4">✨ Sem custos ocultos • Sem compromisso</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritionist Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200">
              <IconUserCheck className="w-4 h-4 mr-2" />
              Para Nutricionistas
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Plataforma profissional para
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {" "}
                acompanhamento clínico
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Gerencie seus pacientes, acompanhe progressos e gere relatórios profissionais com nossa plataforma web
              especializada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {nutritionistFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-6 p-4 bg-gradient-to-r ${feature.color} rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Acessar Plataforma Web
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
