"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";
import {
  IconUsers,
  IconChartBar,
  IconFileAnalytics,
  IconShield,
  IconCheck,
  IconX,
  IconStar,
  IconCrown,
  IconRocket,
} from "@tabler/icons-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const plans = [
    {
      name: "Iniciante",
      description: "Perfeito para estudantes e profissionais que querem começar a usar a plataforma",
      price: { monthly: 0, annual: 0 },
      icon: IconRocket,
      color: "from-blue-500 to-cyan-500",
      popular: false,
      features: [
        { name: "Até 3 pacientes", included: true },
        { name: "Dashboard básico", included: true },
        { name: "Visualização de refeições", included: true },
        { name: "Dados básicos do paciente", included: true },
        { name: "Suporte por email", included: true },
        { name: "Análise de macros", included: false },
        { name: "Exportação de dados", included: false },
        { name: "Suporte prioritário", included: false },
      ],
      cta: "Começar Grátis",
      ctaVariant: "outline" as const,
    },
    {
      name: "Profissional",
      description: "Ideal para nutricionistas estabelecidos com um número razoável de pacientes",
      price: { monthly: 29, annual: 290 },
      icon: IconStar,
      color: "from-emerald-500 to-teal-500",
      popular: true,
      features: [
        { name: "Até 20 pacientes", included: true },
        { name: "Dashboard completo", included: true },
        { name: "Visualização completa de refeições", included: true },
        { name: "Dados completos do paciente", included: true },
        { name: "Análise de macros", included: true },
        { name: "Histórico de progresso", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "Exportação de dados", included: true },
      ],
      cta: "Quero este plano",
      ctaVariant: "default" as const,
    },
    {
      name: "Premium",
      description: "Para nutricionistas com um grande volume de pacientes e que precisam de mais recursos",
      price: { monthly: 59, annual: 590 },
      icon: IconCrown,
      color: "from-purple-500 to-violet-500",
      popular: false,
      features: [
        { name: "Até 50 pacientes", included: true },
        { name: "Dashboard avançado", included: true },
        { name: "Visualização completa de refeições", included: true },
        { name: "Dados completos do paciente", included: true },
        { name: "Análise de macros avançada", included: true },
        { name: "Histórico completo de progresso", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "Exportação avançada", included: true },
      ],
      cta: "Quero este plano",
      ctaVariant: "default" as const,
    },
  ];

  const features = [
    {
      icon: IconUsers,
      title: "Gestão de Pacientes",
      description: "Organize e acompanhe todos os seus pacientes em uma plataforma centralizada",
    },
    {
      icon: IconChartBar,
      title: "Análise Avançada",
      description: "Insights inteligentes sobre hábitos alimentares e progresso nutricional",
    },
    {
      icon: IconFileAnalytics,
      title: "Relatórios Profissionais",
      description: "Gere relatórios personalizados para documentação clínica",
    },
    {
      icon: IconShield,
      title: "Segurança Total",
      description: "Dados protegidos com criptografia e conformidade LGPD",
    },
  ];

  const faqs = [
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer:
        "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente.",
    },
    {
      question: "Há período de teste gratuito?",
      answer: "Sim! Todos os planos pagos incluem 14 dias de teste gratuito. Não é necessário cartão de crédito.",
    },
    {
      question: "Meus dados estão seguros?",
      answer:
        "Absolutamente! Utilizamos criptografia de nível bancário e seguimos todas as normas de proteção de dados.",
    },
    {
      question: "Posso cancelar quando quiser?",
      answer: "Sim! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento sem taxas.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader showHomeLink={true} />

      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Escolha o plano ideal para
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                sua prática clínica
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Planos flexíveis que crescem com seu consultório. Comece grátis e evolua conforme sua necessidade.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
          <Badge className="bg-green-100 text-green-700 border-green-200">Economize 17% no plano anual</Badge>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>Mensal</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-blue-600" />
            <span className={`text-lg font-medium ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>Anual</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 hover:-translate-y-2 ${
                  plan.popular ? "ring-2 ring-emerald-500 shadow-xl" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1">
                      <IconStar className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-6 p-4 bg-gradient-to-r ${plan.color} rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-600 mb-6">{plan.description}</CardDescription>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-slate-900">
                        R$ {isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-slate-500 ml-2">
                        {plan.price.monthly === 0 ? "" : isAnnual ? "/ano" : "/mês"}
                      </span>
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-sm text-slate-500 mt-1">
                        Equivale a R$ {Math.round(plan.price.annual / 12)}/mês
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                          <IconCheck className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="p-1 bg-slate-200 rounded-full">
                          <IconX className="h-4 w-4 text-slate-400" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? "text-slate-700" : "text-slate-400"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}

                  <div className="pt-6">
                    <Button
                      onClick={() => router.push("/login")}
                      className={`w-full text-lg py-4 ${
                        plan.popular
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                          : plan.price.monthly === 0
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Tudo que você precisa para
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {" "}
                excelência clínica
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Recursos profissionais desenvolvidos especificamente para nutricionistas, com tecnologia de ponta e
              interface intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
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
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Dúvidas sobre nossos
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {" "}
                planos?
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para revolucionar sua
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}
              prática clínica?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de nutricionistas que já transformaram seu consultório com nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Começar Teste Grátis
              <IconRocket className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-6">✨ 14 dias grátis • Sem compromisso • Suporte especializado</p>
        </div>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
