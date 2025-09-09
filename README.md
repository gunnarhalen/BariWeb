# 🎯 Bari Web

Central de Acompanhamento para Nutricionistas - Plataforma web para gerenciamento de pacientes e acompanhamento nutricional.

## 🚀 Configuração

### 1. Instalar dependências

```bash
yarn install
```

### 2. Configurar variáveis de ambiente

**OBRIGATÓRIO**: Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

**Para produção no Vercel:**

1. Vá em **Settings** → **Environment Variables**
2. Adicione todas as 6 variáveis acima
3. Use os valores reais do seu projeto Firebase

**⚠️ IMPORTANTE**:

- Nunca commite o arquivo `.env.local` com suas chaves reais
- As chaves do Firebase são públicas por design e seguras para exposição
- A segurança real está nas regras do Firestore, não nas chaves

### 3. Executar em desenvolvimento

```bash
yarn dev
```

### 4. Build para produção

```bash
yarn build
```

## 🔐 Segurança

- As chaves do Firebase são configuradas via variáveis de ambiente
- O arquivo `.env.local` está no `.gitignore` para não ser commitado
- Use sempre variáveis de ambiente para dados sensíveis

## 📱 Funcionalidades

### 🏠 **Dashboard**

- ✅ Estatísticas de pacientes (Total, Ativos, Inativos, Alertas)
- ✅ Gráficos interativos de acompanhamento
- ✅ Visão geral do sistema

### 👥 **Gestão de Pacientes**

- ✅ Lista completa de pacientes
- ✅ Filtros por status (Ativo/Inativo)
- ✅ Busca por nome/email
- ✅ Dados detalhados (idade, peso, IMC, metas)
- ✅ Acompanhamento de última refeição

### 📊 **Detalhes do Paciente**

- ✅ Gráficos de nutrientes (Calorias, Proteínas, Carboidratos, Gorduras)
- ✅ Gráfico de refeições por dia
- ✅ Metas integradas nos gráficos
- ✅ Dados reais do Firebase
- ✅ Períodos personalizáveis (7, 15, 30 dias)

### 🔄 **Sistema de Solicitações**

- ✅ Gerenciamento de solicitações de pacientes
- ✅ Status de aprovação/rejeição
- ✅ Integração com perfil do paciente

### 🎨 **Interface**

- ✅ Design responsivo e moderno
- ✅ Sidebar colapsível
- ✅ Tema claro/escuro
- ✅ Componentes reutilizáveis
- ✅ Ícones Tabler

## 🛠️ Tecnologias

### **Frontend**

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Tabler Icons** - Biblioteca de ícones

### **Backend & Dados**

- **Firebase Auth** - Autenticação
- **Firestore** - Banco de dados
- **Recharts** - Gráficos interativos

### **UI Components**

- **Radix UI** - Componentes primitivos
- **Shadcn/ui** - Sistema de design
- **TanStack Table** - Tabelas avançadas

### **Ferramentas**

- **ESLint** - Linting
- **PostCSS** - Processamento CSS
- **Turbopack** - Build otimizado

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (protected)/        # Rotas protegidas
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── patients/       # Gestão de pacientes
│   │   │   └── [id]/      # Detalhes do paciente
│   │   ├── reports/        # Relatórios
│   │   ├── requests/       # Solicitações
│   │   └── settings/       # Configurações
│   ├── login/              # Página de login
│   └── unauthorized/       # Página não autorizada
├── components/             # Componentes React
│   ├── ui/                # Componentes base (Shadcn)
│   ├── chart-card.tsx     # Componente de gráfico
│   ├── app-sidebar.tsx    # Sidebar principal
│   └── site-header.tsx    # Cabeçalho
├── services/              # Serviços
│   └── nutritionistService.ts  # API Firebase
├── contexts/              # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── lib/                   # Utilitários
│   ├── utils.ts          # Funções utilitárias
│   └── chart-data.ts     # Processamento de dados
└── types/                 # Definições TypeScript
    └── index.ts          # Interfaces globais
```

## 🎯 Funcionalidades Principais

### **Dashboard Inteligente**

- Métricas em tempo real
- Gráficos de acompanhamento
- Alertas automáticos

### **Gestão Avançada de Pacientes**

- Status baseado em atividade (2 dias)
- Filtros inteligentes
- Dados calculados automaticamente (IMC, idade)

### **Visualização de Dados**

- Gráficos com dados reais do Firebase
- Metas integradas como linhas de referência
- Períodos personalizáveis
- Tratamento de dados ausentes

### **Interface Otimizada**

- Sidebar responsiva
- Tabelas com ordenação e filtros
- Componentes reutilizáveis
- Performance otimizada

### **Build Local**

```bash
yarn build
yarn start
```

## 📊 Status do Projeto

- ✅ **Autenticação** - Implementada
- ✅ **Dashboard** - Funcional
- ✅ **Gestão de Pacientes** - Completa
- ✅ **Gráficos** - Integrados com dados reais
- ✅ **Responsividade** - Otimizada
- ✅ **Performance** - Otimizada
- ✅ **Limpeza de Código** - Concluída

## 📄 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido para nutricionistas que acompanham pacientes com o app mobile Bari** 🎯
