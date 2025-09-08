# Bari Web

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

- ✅ Autenticação de nutricionistas
- ✅ Dashboard com estatísticas
- ✅ Gestão de pacientes
- ✅ Sistema de solicitações
- ✅ Interface responsiva
- ✅ Integração com Firebase

## 🛠️ Tecnologias

- Next.js 15
- TypeScript
- Tailwind CSS
- Firebase (Auth + Firestore)
- Tabler Icons
