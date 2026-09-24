# 🎯 Bari Web

Central de Acompanhamento para Nutricionistas - Plataforma web para gerenciamento de pacientes e acompanhamento nutricional.

## 📋 Requisitos Mínimos

- **Node.js** 18 ou superior
- **Git** (para clonar o repositório)
- **Conta no Firebase Console** (para obter as credenciais)

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
# Clone o repositório
 git clone https://github.com/gunnarhalen/BariWeb.git

# Acesse a pasta do projeto
cd BariWeb

# Instale as dependências
 yarn install
```

### 2. Configurar Variáveis de Ambiente

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

### 3. Executar em Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
yarn dev

# Acesse em http://localhost:3000
```

### 4. Build para Produção

```bash
# Build para produção local
yarn build

# Inicie o servidor estático
yarn start
```

## 💡 Como Usar

### Exemplo: Acessando o Dashboard de Nutricionistas

Após a instalação e configuração das variáveis de ambiente:

1. **Inicie o aplicativo**:
   ```bash
   yarn dev
   ```

2. **Acesse em seu navegador**:
   - URL: `http://localhost:3000`
   - Credenciais: Use suas credenciais do Firebase (ou faça login com Google)

3. **Primeira vez?** Se for a primeira vez que acessa, pode ser necessário completar seu perfil:
   - URL: `http://localhost:3000/complete-profile`
   - Preencha suas informações profissionais (nome, CRM, especialidades)

4. **Navegue no dashboard**:
   - **Visão Geral**: Acompanhe estatísticas importantes de pacientes
   - **Pacientes**: Lista de pacientes com filtros e busca
   - **Detalhes**: Análise detalhada de dados nutricionais por paciente
   - **Relatórios**: Gere relatórios e análises

5. **Recursos principais do dia a dia**:
   - **Gerenciar pacientes**: Ver, filtrar e adicionar pacientes à sua lista
   - **Monitorar progresso**: Acompanhe as refeições e métricas nutricionais
   - **Configurações**: Gerencie suas preferências e segurança
   - **Solicitações**: Gerencie solicitações de pacientes para sua equipe

### Fluxo de Trabalho Típico

1. Nutricionista faz login usando autenticação Firebase
2. Acessa o dashboard principal com visão geral dos pacientes
3. Usa os filtros para encontrar pacientes específicos ou filtrar por status
4. Clica em um paciente para ver dados detalhados, gráficos e histórico
5. Verifica alertas e notas sobre cada paciente
6. Gera relatórios para compartilhar com os pacientes

## 📝 Contribuição

### Como Contribuir

Este projeto segue um fluxo de contribuição básico:

1. **Abra um issue** para relatar bugs, solicitar recursos ou discutir melhorias
2. **Fork** o repositório e crie uma branch para seu trabalho
3. **Faça commits** com mensagens descritivas e referências às issues
4. **Abra um Pull Request** para revisão da equipe

### Diretrizes de Código

- Mantenha o estilo TypeScript limpo e consistente
- Use componentes reutilizáveis sempre que possível
- Adicione comentários apenas quando necessário (explique o porquê)
- Escreva testes quando aplicável (ver scripts de teste no package.json)

### Contribuição de Arquivo README

Este arquivo README está em constante evolução. Sinta-se à vontade para:

- Adicionar exemplos de uso que ajudem novos contribuidores
- Atualizar as instruções de instalação quando necessário
- Compartilhar atalhos ou dicas úteis
- Melhorar a organização e clareza do conteúdo

### Para Detalhes Técnicas Específicas

Para informações mais detalhadas sobre contribuição, consulte o arquivo:
- [CONTRIBUTING.md](/CONTRIBUTING.md) (em desenvolvimento)

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

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitário
- **Tabler Icons** - Biblioteca de ícones

### **Backend & Dados**

- **Firebase Auth** - Autenticação
- **Firestore** - Banco de dados
- **Recharts** - Gráficos interativos

### **UI Components**

- **Radix UI** - Componentes primitivos acessíveis
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
