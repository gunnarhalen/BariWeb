# 🎯 Bari Web - Central de Acompanhamento para Nutricionistas

## 🎯 **Visão Geral**

Aplicação web para nutricionistas acompanharem seus pacientes que usam o app mobile Bari.
**Não é um app para upload de fotos** - é uma central de acompanhamento e análise.

## 👥 **Público-Alvo**

- Nutricionistas com **muitos pacientes** (50+ pacientes)
- Profissionais que precisam de **eficiência** para gerenciar grandes volumes
- Usuários que precisam de **visão geral** e **análise detalhada**

## 🔄 **Fluxo Principal**

1. **Nutricionista faz login**
2. **Vê dashboard** com visão geral dos pacientes
3. **Navega para lista** de pacientes (com filtros/busca)
4. **Clica em paciente** → vê dados nutricionais completos
5. **Acompanha progresso** através de gráficos e análises

## 📊 **Dados Disponíveis (vindos do mobile)**

- ✅ Refeições registradas pelos pacientes
- ✅ Fotos analisadas pela IA (já processadas)
- ✅ Dados nutricionais calculados (calorias, macros)
- ✅ Metas estabelecidas para cada paciente
- ✅ Histórico de progresso ao longo do tempo
- ✅ Identificação de alimentos via IA

## 🛠️ **Stack Tecnológica**

### **Core:**

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Firebase** - Mesma configuração do mobile (Auth + Firestore)
- **Tailwind CSS** - Styling utilitário

### **UI/UX:**

- **Shadcn/ui** - Componentes baseados em Radix UI
- **Radix UI** - Componentes primitivos acessíveis
- **Tabler Icons** - Ícones consistentes (mesmo do mobile)
- **Recharts** - Gráficos interativos e responsivos
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas

### **Performance:**

- **React Query** - Cache inteligente e sincronização
- **Virtual scrolling** - Para listas grandes (se necessário)
- **Debounced search** - Busca otimizada

## 🏗️ **Estrutura do Projeto**

```
src/
├── components/
│   ├── ui/                    # Componentes Shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── chart.tsx
│   ├── common/                # Componentes customizados
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── dashboard/             # Componentes do dashboard
│   │   ├── StatsCards.tsx
│   │   ├── AlertsPanel.tsx
│   │   └── QuickActions.tsx
│   ├── charts/                 # Gráficos específicos
│   │   ├── MacrosChart.tsx
│   │   ├── ProgressChart.tsx
│   │   └── TimelineChart.tsx
│   └── layout/                # Layout da aplicação
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Patients.tsx
│   └── PatientDetail.tsx
├── services/
│   ├── firebase.ts            # Mesma configuração do mobile
│   ├── patientService.ts     # Busca/filtros otimizados
│   └── reportService.ts      # Geração de relatórios
├── hooks/
│   ├── useAuth.ts
│   ├── usePatients.ts         # Com paginação e filtros
│   ├── useSearch.ts           # Busca otimizada
│   └── useBulkActions.ts      # Ações em lote
├── types/
│   ├── patient.ts
│   ├── meal.ts
│   └── nutrition.ts
├── utils/
│   ├── formatters.ts
│   ├── calculations.ts
│   └── cn.ts                  # Utilitário para classes CSS
└── lib/
    ├── utils.ts
    └── validations.ts
```

## 📱 **Funcionalidades Detalhadas**

### **1. Dashboard Inteligente** ✅

**Objetivo:** Visão geral rápida para identificar pacientes que precisam atenção

**Cards de Métricas:**

- Total de pacientes ativos
- Pacientes que não registraram refeições hoje
- Pacientes com alertas (acima/abaixo das metas)
- Total de refeições registradas hoje
- Pacientes com progresso positivo/negativo

**Seções:**

- **Alerts Panel:** Lista de pacientes que precisam atenção
- **Quick Actions:** Ações frequentes (enviar lembretes, etc.)
- **Trends Chart:** Gráfico de evolução geral dos pacientes

### **2. Gestão de Pacientes** ✅

**Objetivo:** Encontrar e gerenciar pacientes eficientemente

**Funcionalidades:**

- **Busca instantânea** por nome do paciente
- **Filtros avançados:**
  - Status (ativo/inativo)
  - Última refeição (hoje, ontem, semana)
  - Alertas (acima/abaixo metas)
  - Objetivos (perda peso, ganho massa, etc.)
- **Paginação** (20-50 pacientes por página)
- **Ordenação** por qualquer coluna
- **Ações em lote:** Selecionar múltiplos pacientes
- **Status visual:** Indicadores de atividade/alerta

### **3. Detalhes do Paciente** ✅

**Objetivo:** Análise completa dos dados nutricionais

**Seções:**

- **Visão Geral:** Metas vs. consumo atual do dia
- **Gráficos de Macros:** Proteína, carboidrato, gordura (dia/semana/mês)
- **Timeline do Dia:** Refeições registradas (café, almoço, jantar)
- **Histórico:** Evolução ao longo do tempo
- **Dados da IA:** Alimentos identificados nas fotos
- **Notas:** Campo para observações do nutricionista

### **4. Relatórios e Exportação** ✅

**Objetivo:** Documentar progresso e compartilhar dados

**Funcionalidades:**

- **Relatório Individual:** PDF com progresso do paciente
- **Relatório em Lote:** Múltiplos pacientes
- **Exportação Excel:** Para análises mais complexas
- **Templates:** Relatórios pré-formatados
- **Agendamento:** Relatórios automáticos

## 🎨 **Design System**

### **Cores (mesmas do mobile):**

- **Primary:** Azul (#3b82f6) - elementos principais
- **Success:** Verde (#22c55e) - proteína, progresso positivo
- **Warning:** Amarelo (#f59e0b) - carboidrato, atenção
- **Danger:** Vermelho (#ef4444) - gordura, alertas
- **Gray:** Escala 50-950 - elementos neutros

### **Componentes Shadcn/ui:**

- **Button** - Variants: primary, secondary, ghost, outline
- **Card** - Variants: default, section, alert
- **Table** - Com hover states e zebra striping
- **Input** - Com estados de loading e error
- **Modal** - Com backdrop blur e animações
- **Chart** - Gráficos responsivos e interativos

### **Layout:**

- **Sidebar** com navegação principal
- **Header** com busca global e perfil
- **Content** responsivo para desktop/tablet
- **Modo escuro/claro** com persistência

## 🔥 **Configuração Firebase**

### **Estrutura de Dados Atual (do mobile):**

```
# Coleções Globais
nutritionists/
├── {nutritionistId}/
│   ├── email: string
│   ├── fullName: string
│   ├── cfnCrn: string
│   └── isActive: boolean

nutritionist_requests/
├── {requestId}/
│   ├── userId: string
│   ├── nutritionistId: string
│   ├── userName: string
│   ├── userEmail: string
│   ├── status: 'pending' | 'accepted' | 'rejected' | 'revoked'
│   ├── createdAt: Timestamp
│   ├── acceptedAt?: Timestamp
│   ├── rejectedAt?: Timestamp
│   └── revokedAt?: Timestamp

# Dados por Usuário (Paciente)
users/{userId}/
├── profile/data
│   ├── fullName: string
│   ├── email: string
│   ├── birthDate: string
│   ├── gender: 'male' | 'female'
│   ├── weight: number
│   ├── height: number
│   ├── activityLevel: string
│   ├── goal: string
│   ├── dietType: string
│   ├── religiousDiet: string
│   ├── intolerances: string[]
│   ├── allergies: string[]
│   ├── goals: {
│   │   ├── dailyKcal: number
│   │   ├── protein: number
│   │   ├── carb: number
│   │   └── fat: number
│   │ }
│   ├── notifications: boolean
│   ├── privacyMode: boolean
│   ├── isNutritionist: boolean
│   ├── cfnCrn: string
│   ├── associatedNutritionistId: string
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── meals/
│   └── {mealId}/
│       ├── id: string
│       ├── name: string
│       ├── kcal: number
│       ├── protein: number
│       ├── carb: number
│       ├── fat: number
│       ├── quantity: number
│       ├── unit: string
│       ├── mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
│       ├── date: string (ISO format)
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
```

### **Como Funciona o Sistema Atual:**

1. **Pacientes** registram refeições em `users/{userId}/meals/`
2. **Nutricionistas** são registrados em `nutritionists/{nutritionistId}/`
3. **Relacionamentos** são gerenciados via `nutritionist_requests/`
4. **Perfil do paciente** inclui `associatedNutritionistId` quando aceito

### **Para o Web App:**

**O nutricionista precisará:**

- Buscar seus pacientes através de `nutritionist_requests` (status: 'accepted')
- Acessar dados dos pacientes em `users/{patientId}/profile/data`
- Ver refeições dos pacientes em `users/{patientId}/meals/`
- Adicionar notas/observações (nova funcionalidade)

### **Regras de Segurança:**

- Nutricionista só acessa pacientes com `associatedNutritionistId` = seu ID
- Validação de perfil de nutricionista via `nutritionists/` collection
- Pacientes só acessam seus próprios dados

### **Adaptação dos Serviços Existentes:**

**Reutilizar do mobile:**

- ✅ `firebase.ts` - Mesma configuração
- ✅ `firestoreService.ts` - Funções base (getDocument, setDocument, etc.)
- ✅ Estrutura de dados - Não precisa mudar

**Adaptar para web:**

- 🔄 **Buscar pacientes do nutricionista** - Nova função baseada em `nutritionist_requests`
- 🔄 **Acessar dados de outros usuários** - Adaptar `getDocument` para acessar `users/{patientId}/`
- 🔄 **Validação de nutricionista** - Verificar se usuário está em `nutritionists/` collection

**Novos serviços necessários:**

- 📝 **patientService.ts** - Buscar e gerenciar pacientes do nutricionista
- 📝 **nutritionistService.ts** - Validação e perfil do nutricionista
- 📝 **notesService.ts** - Sistema de notas/observações (nova funcionalidade)

## 🚀 **Setup Inicial**

### **1. Instalar Shadcn/ui:**

```bash
npx shadcn-ui@latest init
```

### **2. Adicionar Componentes Necessários:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add modal
```

### **3. Configurar Tailwind:**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## 🚀 **Roadmap de Desenvolvimento**

### **Fase 1 - MVP (2-3 semanas):**

- [ ] Setup do projeto Next.js + Shadcn/ui
- [ ] Configuração Firebase
- [ ] Autenticação do nutricionista
- [ ] Dashboard básico com métricas
- [ ] Lista de pacientes com busca simples
- [ ] Página de detalhes do paciente
- [ ] Gráficos básicos de macros

### **Fase 2 - Funcionalidades Avançadas (2-3 semanas):**

- [ ] Filtros avançados na lista de pacientes
- [ ] Paginação e ordenação
- [ ] Ações em lote
- [ ] Relatórios básicos (PDF)
- [ ] Notas do nutricionista
- [ ] Modo escuro/claro

### **Fase 3 - Otimizações (1-2 semanas):**

- [ ] Performance para muitos pacientes
- [ ] Cache inteligente
- [ ] Exportação Excel
- [ ] Relatórios automáticos
- [ ] Notificações do navegador

## ❓ **Perguntas para Iteração**

### **Funcionalidades:**

1. **Dashboard:** Quais métricas são mais importantes?
2. **Filtros:** Que filtros são essenciais vs. nice-to-have?
3. **Relatórios:** Que tipo de relatório o nutricionista realmente usa?
4. **Notas:** Campo de texto simples ou sistema mais complexo?

### **UX/UI:**

1. **Layout:** Sidebar fixa ou colapsível?
2. **Gráficos:** Que tipos de visualização são mais úteis?
3. **Cores:** Manter exatamente as mesmas do mobile?
4. **Responsividade:** Prioridade para desktop ou mobile-first?

### **Performance:**

1. **Paginação:** Quantos pacientes por página?
2. **Cache:** Quanto tempo manter dados em cache?
3. **Busca:** Busca em tempo real ou com debounce?

## 📝 **Notas de Iteração**

### **Versão 2.0 - Stack Atualizada**

- ✅ Shadcn/ui + Radix UI escolhido
- ✅ Stack minimalista definida
- ✅ Estrutura de projeto atualizada
- ✅ Setup inicial documentado

### **Próximas Iterações:**

- [ ] Refinar funcionalidades baseado em feedback
- [ ] Definir detalhes de UX/UI
- [ ] Priorizar features por importância
- [ ] Estimar esforço de desenvolvimento
- [ ] Definir critérios de sucesso

---

**💡 Este documento será iterado até chegarmos na versão final perfeita antes de começar o desenvolvimento!**
