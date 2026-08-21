# Contexto de Entrada - Bari Web

## Fluxo de Inicialização da Aplicação

### 1. Ponto de Entrada - `RootLayout` (`src/app/layout.tsx:21`)

A aplicação começa com o `RootLayout`, que é o componente raiz definido pelo Next.js App Router.

**Principais responsabilidades:**
- Configuração de metadados (título, descrição)
- Renderização do `AuthProvider` que envolve toda a aplicação
- Importação de fontes Google Fonts (Geist e Geist Mono)

```tsx
<AuthProvider>{children}</AuthProvider>
```

---

### 2. Provedor de Autenticação - `AuthProvider` (`src/contexts/AuthContext.tsx:40`)

O `AuthProvider` é o primeiro componente a ser executado no fluxo de inicialização.

**Principais funções/classes envolvidas:**
- `onAuthStateChanged` (Firebase) - Observador de estado de autenticação
- `isNutritionist` (`src/services/nutritionistService.ts:611`) - Verifica se usuário é nutricionista
- `getNutritionistProfile` (`src/services/nutritionistService.ts:431`) - Busca perfil do nutricionista

**Fluxo de inicialização:**
1. O `AuthProvider` inicializa com `loading = true`
2. O `onAuthStateChanged` detecta o estado do usuário no Firebase
3. Se usuário existe:
   - Aguarda 500ms (simulação de carregamento)
   - Verifica se é nutricionista chamando `isNutritionist(user.uid)`
   - Se for nutricionista, busca perfil com `getNutritionistProfile(user.uid)`
   - Redireciona para `/patients`
   - Se não for nutricionista, redireciona para `/complete-profile`
4. Se usuário não existe, mantém `loading = false` e permite acesso à landing page

---

### 3. Roteamento da Landing Page - `LandingPage` (`src/app/page.tsx:34`)

Quando o usuário não está logado ou não é nutricionista, a aplicação renderiza a landing page.

**Principais funções/classes:**
- `useAuth()` - Hook para acessar contexto de autenticação
- `router.push("/patients")` - Redirecionamento condicional
- `PublicHeader` - Componente de cabeçalho público
- `PublicFooter` - Componente de rodapé público

**Comportamento:**
- Se usuário logado é nutricionista → redireciona para `/patients`
- Se usuário não logado ou não nutricionista → mostra landing page com:
  - Seção Hero
  - Funcionalidades para usuários
  - Funcionalidades para nutricionistas
  - Estatísticas
  - Botões de download (App Store e Google Play)

---

### 4. Roteamento Protegido - `ProtectedRoute` (`src/components/ProtectedRoute.tsx:12`)

Para acessar áreas protegidas, o `ProtectedRoute` é utilizado no `ProtectedLayout`.

**Principais funções/classes:**
- `useAuth()` - Verifica estado de autenticação
- `router.replace("/login")` - Redireciona para login se não autenticado
- `router.replace("/unauthorized")` - Redireciona se não for nutricionista

**Fluxo de verificação:**
1. Se `loading = true` → exibe spinner de carregamento
2. Se `!user` → redireciona para `/login`
3. Se `user` mas `!isNutritionist` → redireciona para `/unauthorized`
4. Se `user` e `isNutritionist` → renderiza children

---

### 5. Layout Protegido - `ProtectedLayout` (`src/app/(protected)/layout.tsx:7`)

Este layout envolve todas as rotas protegidas (dentro da pasta `(protected)`).

**Principais funções/classes:**
- `SidebarProvider` - Provedor do sistema de sidebar (vaul)
- `AppSidebar` - Componente do menu lateral principal
- `SidebarInset` - Container principal do conteúdo
- `ProtectedRoute` - Proteção de rota

**Estrutura:**
```tsx
<ProtectedRoute>
  <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset>{children}</SidebarInset>
  </SidebarProvider>
</ProtectedRoute>
```

---

### 6. Menu Lateral - `AppSidebar` (`src/components/app-sidebar.tsx:28`)

Componente que renderiza o menu lateral de navegação para nutricionistas.

**Principais funções/classes:**
- `useAuth()` - Obtém usuário e perfil do nutricionista
- `usePendingRequests()` - Hook personalizado (`src/hooks/use-pending-requests.ts`) para contar solicitações pendentes
- `NavMain` - Navegação principal (Pacientes, Solicitações)
- `NavSecondary` - Navegação secundária (Conta, Ajuda)
- `NavUser` - Menu de usuário e logout
- `Logo` - Componente do logo da aplicação

**Dados de navegação memoizados:**
- `navMain`: Pacientes (`/patients`), Solicitações (`/requests`)
- `navSecondary`: Conta (`/settings`), Ajuda (`#`)

---

### 7. Página de Pacientes - `PatientsPage` (`src/app/(protected)/patients/page.tsx:30`)

Esta é a página inicial para nutricionistas após o login.

**Principais funções/classes:**
- `useAuth()` - Obtém usuário autenticado
- `getNutritionistPatients` (`src/services/nutritionistService.ts:448`) - Busca pacientes do nutricionista
- `convertPatientsToTableData` - Converte dados para formato da tabela
- `PatientsTableNavigation` - Componente de navegação da tabela
- `SiteHeader` - Cabeçalho da página

**Fluxo de carregamento:**
1. Verifica se usuário existe
2. Carrega pacientes chamando `getNutritionistPatients(user.uid)`
3. Processa dados dos pacientes:
   - Calcula IMC
   - Determina status (Ativo/Inativo) baseado na última refeição
   - Calcula idade a partir da data de nascimento
4. Exibe cards de estatísticas:
   - Total de pacientes
   - Pacientes ativos
   - Pacientes inativos
   - Alertas
5. Renderiza tabela de pacientes com `PatientsTableNavigation`

---

### 8. Serviços de Dados - `nutritionistService`

**Principais funções:**
- `getNutritionistPatients` (`src/services/nutritionistService.ts:448`) - Busca pacientes through Firestore
- `getNutritionistProfile` (`src/services/nutritionistService.ts:431`) - Busca perfil do nutricionista
- `isNutritionist` (`src/services/nutritionistService.ts:611`) - Verifica coleção `nutritionists`
- `getPatientWaterData` (`src/services/nutritionistService.ts:106`) - Dados de hidratação
- `getPatientMealData` (`src/services/nutritionistService.ts:200`) - Dados de refeições
- `getLastMealDate` (`src/services/nutritionistService.ts:321`) - Última refeição registrada
- `getPatientIndividualMeals` (`src/services/nutritionistService.ts:684`) - Lista de refeições individuais

---

### 9. Configuração Firebase - `firebaseConfig` (`src/config/firebase.ts:6`)

**Principais funções/classes:**
- `initializeApp` - Inicializa Firebase
- `getAuth` - Configura autenticação
- `getFirestore` - Configura Firestore Database
- Variáveis de ambiente: `NEXT_PUBLIC_FIREBASE_*`

**Instâncias exportadas:**
- `auth` - Firebase Authentication
- `db` - Firestore Database

---

## Resumo do Fluxo

```
1. RootLayout (layout.tsx:21)
   ↓
2. AuthProvider (AuthContext.tsx:40)
   ↓
3. onAuthStateChanged detecta usuário
   ↓
4. Se usuário é nutricionista → /patients
   ↓
5. ProtectedRoute verifica autenticação
   ↓
6. ProtectedLayout renderiza AppSidebar + conteúdo
   ↓
7. PatientsPage carrega dados com getNutritionistPatients
   ↓
8. Exibe dashboard com estatísticas e tabela de pacientes
```

## Componentes Principais

| Componente | Arquivo | Responsabilidade |
|------------|---------|------------------|
| `RootLayout` | `src/app/layout.tsx:21` | Layout raiz, envolve AuthProvider |
| `AuthProvider` | `src/contexts/AuthContext.tsx:40` | Gerencia autenticação Firebase |
| `ProtectedRoute` | `src/components/ProtectedRoute.tsx:12` | Protege rotas de acesso |
| `AppSidebar` | `src/components/app-sidebar.tsx:28` | Menu lateral de navegação |
| `PatientsPage` | `src/app/(protected)/patients/page.tsx:30` | Dashboard principal |
| `getNutritionistPatients` | `src/services/nutritionistService.ts:448` | Busca pacientes do nutricionista |
| `isNutritionist` | `src/services/nutritionistService.ts:611` | Verifica tipo de usuário |
