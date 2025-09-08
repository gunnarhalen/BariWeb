# Bari Web

Central de Acompanhamento para Nutricionistas - Plataforma web para gerenciamento de pacientes e acompanhamento nutricional.

## 🚀 Configuração

### 1. Instalar dependências

```bash
yarn install
```

### 2. Configurar variáveis de ambiente (Opcional)

As variáveis de ambiente são opcionais. Se não configuradas, a aplicação usará valores padrão seguros.

Para configurar no Vercel, adicione estas variáveis em **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBGGofFNwXPgiRNrcj3RYnJMDJpf6b5woY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nutribud-7a785.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nutribud-7a785
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nutribud-7a785.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=583512611485
NEXT_PUBLIC_FIREBASE_APP_ID=1:583512611485:web:4dd6f09ecd1b90a057d274
```

**⚠️ IMPORTANTE**: As chaves do Firebase são públicas por design e seguras para exposição.

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
