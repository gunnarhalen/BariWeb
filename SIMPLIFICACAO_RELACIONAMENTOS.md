# 📋 **Documentação: Simplificação da Estrutura de Relacionamentos - BariWeb**

## 🎯 **Objetivo**

Simplificar a estrutura de relacionamentos entre usuários e nutricionistas no Firestore, eliminando duplicação e complexidade desnecessária.

---

## 🔍 **Problema Atual**

### **Estrutura Duplicada:**

Atualmente existem **duas estruturas** fazendo essencialmente a mesma coisa:

1. **`nutritionist_requests/`** (Coleção Global)
2. **`users/{userId}/relationships/`** (Subcoleção por Usuário)

### **Problemas Identificados:**

- ❌ **Duplicação de dados**
- ❌ **Complexidade desnecessária**
- ❌ **Possíveis inconsistências**
- ❌ **Mais consultas ao Firestore**
- ❌ **Dificuldade de manutenção**

---

## 📊 **Estrutura Atual**

```
nutribud-7a785/
├── nutritionists/                    # Perfis dos nutricionistas
├── nutritionist_requests/            # Solicitações globais
│   └── {requestId}/
│       ├── userId: string
│       ├── nutritionistId: string
│       ├── userName: string
│       ├── userEmail: string
│       ├── status: 'accepted'
│       ├── createdAt: Timestamp
│       └── acceptedAt: Timestamp
└── users/
    └── {userId}/
        ├── profile/data              # Perfil do usuário
        ├── meals/                    # Refeições por data
        │   └── {YYYY-MM-DD}/
        └── relationships/            # ❌ DUPLICAÇÃO
            └── {relationshipId}/
                ├── userId: string
                ├── nutritionistId: string
                ├── status: 'pending'  # ❌ Status diferente!
                ├── createdAt: Timestamp
                └── updatedAt: Timestamp
```

---

## 💡 **Solução Proposta**

### **Estrutura Simplificada:**

```
nutribud-7a785/
├── nutritionists/                    # Perfis dos nutricionistas
├── nutritionist_requests/            # ✅ ÚNICA fonte de relacionamentos
│   └── {requestId}/
│       ├── userId: string
│       ├── nutritionistId: string
│       ├── userName: string
│       ├── userEmail: string
│       ├── status: 'pending' | 'accepted' | 'rejected' | 'revoked'
│       ├── createdAt: Timestamp
│       ├── acceptedAt?: Timestamp
│       ├── rejectedAt?: Timestamp
│       ├── revokedAt?: Timestamp
│       └── revokedBy?: 'user' | 'nutritionist'  # ✅ Novo campo
└── users/
    └── {userId}/
        ├── profile/data              # Perfil do usuário
        └── meals/                    # Refeições por data
            └── {YYYY-MM-DD}/
```

---

## 🔄 **Fluxo Simplificado**

### **1. Usuário Adiciona Nutricionista**

```typescript
// Criar solicitação
const requestRef = await addDoc(collection(db, "nutritionist_requests"), {
  userId: currentUserId,
  nutritionistId: nutritionistId,
  userName: userProfile.fullName,
  userEmail: userProfile.email,
  status: "pending",
  createdAt: serverTimestamp(),
});
```

### **2. Nutricionista Recebe Pedido**

```typescript
// Buscar solicitações pendentes
const pendingRequests = await getDocs(
  query(
    collection(db, "nutritionist_requests"),
    where("nutritionistId", "==", nutritionistId),
    where("status", "==", "pending")
  )
);
```

### **3. Nutricionista Aceita/Recusa**

```typescript
// Aceitar solicitação
await updateDoc(doc(db, "nutritionist_requests", requestId), {
  status: "accepted",
  acceptedAt: serverTimestamp(),
});

// Recusar solicitação
await updateDoc(doc(db, "nutritionist_requests", requestId), {
  status: "rejected",
  rejectedAt: serverTimestamp(),
});
```

### **4. Usuário Revoga Nutricionista**

```typescript
// Revogar relacionamento
await updateDoc(doc(db, "nutritionist_requests", requestId), {
  status: "revoked",
  revokedAt: serverTimestamp(),
  revokedBy: "user",
});
```

---

## 📋 **Consultas Simplificadas**

### **Para Nutricionistas:**

```typescript
// Solicitações pendentes
const pendingRequests = query(
  collection(db, "nutritionist_requests"),
  where("nutritionistId", "==", nutritionistId),
  where("status", "==", "pending")
);

// Relacionamentos aceitos
const acceptedRelationships = query(
  collection(db, "nutritionist_requests"),
  where("nutritionistId", "==", nutritionistId),
  where("status", "==", "accepted")
);
```

### **Para Usuários:**

```typescript
// Todos os relacionamentos do usuário
const userRelationships = query(
  collection(db, "nutritionist_requests"),
  where("userId", "==", userId)
);

// Relacionamentos ativos
const activeRelationships = query(
  collection(db, "nutritionist_requests"),
  where("userId", "==", userId),
  where("status", "==", "accepted")
);
```

---

## 📝 **Tipos TypeScript Atualizados**

### **Interface NutritionistRequest:**

```typescript
export interface NutritionistRequest {
  id: string;
  userId: string;
  nutritionistId: string;
  userName: string;
  userEmail: string;
  status: "pending" | "accepted" | "rejected" | "revoked";
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  revokedAt?: Timestamp;
  revokedBy?: "user" | "nutritionist";
}
```

### **Funções de Serviço Atualizadas:**

```typescript
// Buscar solicitações pendentes do nutricionista
export const getPendingRequests = async (
  nutritionistId: string
): Promise<NutritionistRequest[]> => {
  const q = query(
    collection(db, "nutritionist_requests"),
    where("nutritionistId", "==", nutritionistId),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as NutritionistRequest)
  );
};

// Buscar relacionamentos aceitos do nutricionista
export const getAcceptedRelationships = async (
  nutritionistId: string
): Promise<NutritionistRequest[]> => {
  const q = query(
    collection(db, "nutritionist_requests"),
    where("nutritionistId", "==", nutritionistId),
    where("status", "==", "accepted")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as NutritionistRequest)
  );
};

// Buscar todos os relacionamentos do usuário
export const getUserRelationships = async (
  userId: string
): Promise<NutritionistRequest[]> => {
  const q = query(
    collection(db, "nutritionist_requests"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as NutritionistRequest)
  );
};
```

## 🚀 **Plano de Migração**

### **Fase 1: Preparação**

1. ✅ **Adicionar campo `revokedBy`** em `nutritionist_requests/`
2. ✅ **Atualizar tipos TypeScript** para incluir novos campos
3. ✅ **Criar funções auxiliares** para consultas

### **Fase 2: Migração de Dados**

```typescript
// Script de migração detalhado
const migrateRelationships = async () => {
  // 1. Buscar todos os usuários que têm subcoleção relationships/
  const usersSnapshot = await getDocs(collection(db, "users"));

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;

    // 2. Buscar documentos em users/{userId}/relationships/
    const relationshipsSnapshot = await getDocs(
      collection(db, "users", userId, "relationships")
    );

    // 3. Para cada relacionamento, criar documento em nutritionist_requests/
    for (const relDoc of relationshipsSnapshot.docs) {
      const relData = relDoc.data();

      // 4. Mapear status: 'pending' -> 'pending', outros mantém
      await addDoc(collection(db, "nutritionist_requests"), {
        userId: userId,
        nutritionistId: relData.nutritionistId,
        userName: relData.userName || "Nome não disponível",
        userEmail: relData.userEmail || "Email não disponível",
        status: relData.status, // Manter status original
        createdAt: relData.createdAt,
        updatedAt: relData.updatedAt,
      });
    }
  }

  console.log("Migração concluída com sucesso!");
};
```

### **Fase 3: Atualização do Código**

#### **Arquivos a Modificar:**

1. **Remover referências** a `users/{userId}/relationships/`
2. **Atualizar todas as consultas** para usar `nutritionist_requests/`
3. **Atualizar componentes** de UI
4. **Atualizar testes**

#### **Código a Remover:**

```typescript
// ❌ REMOVER: Consultas à subcoleção relationships/
const relationshipsRef = collection(db, "users", userId, "relationships");
const relationshipsSnapshot = await getDocs(relationshipsRef);

// ❌ REMOVER: Criação de documentos em relationships/
await addDoc(collection(db, "users", userId, "relationships"), {
  // dados do relacionamento
});

// ❌ REMOVER: Atualização de documentos em relationships/
await updateDoc(doc(db, "users", userId, "relationships", relationshipId), {
  // dados atualizados
});
```

#### **Código a Adicionar:**

```typescript
// ✅ ADICIONAR: Usar apenas nutritionist_requests/
const requestsRef = collection(db, "nutritionist_requests");
const requestsSnapshot = await getDocs(requestsRef);

// ✅ ADICIONAR: Criar documentos em nutritionist_requests/
await addDoc(collection(db, "nutritionist_requests"), {
  userId: userId,
  nutritionistId: nutritionistId,
  userName: userName,
  userEmail: userEmail,
  status: "pending",
  createdAt: serverTimestamp(),
});

// ✅ ADICIONAR: Atualizar documentos em nutritionist_requests/
await updateDoc(doc(db, "nutritionist_requests", requestId), {
  status: "accepted",
  acceptedAt: serverTimestamp(),
});
```

### **Fase 4: Limpeza**

1. ✅ **Remover subcoleção** `relationships/` após migração
2. ✅ **Limpar código** não utilizado
3. ✅ **Atualizar documentação**

---

## ✅ **Benefícios da Simplificação**

### **Técnicos:**

- 🎯 **Uma única fonte de verdade**
- 🚀 **Menos consultas ao Firestore**
- 🔧 **Código mais simples e limpo**
- 🛡️ **Menos chance de inconsistências**
- 📈 **Melhor performance**

### **Funcionais:**

- 👥 **Gestão unificada de relacionamentos**
- 📊 **Relatórios mais precisos**
- 🔄 **Sincronização automática**
- 🎨 **UI mais consistente**

---

## 🧪 **Testes Necessários**

### **Testes Funcionais:**

- [ ] Criação de solicitações
- [ ] Aceitação/recusa por nutricionistas
- [ ] Revogação por usuários
- [ ] Consultas de relacionamentos

### **Testes de Performance:**

- [ ] Tempo de resposta das consultas
- [ ] Uso de recursos do Firestore
- [ ] Escalabilidade

---

## 📝 **Checklist de Implementação**

### **Backend (Firestore):**

- [ ] Adicionar campo `revokedBy` em `nutritionist_requests/`
- [ ] Criar script de migração
- [ ] Executar migração e validação

### **Frontend (App Mobile):**

- [ ] Atualizar tipos TypeScript
- [ ] Modificar funções de consulta
- [ ] Atualizar componentes de UI
- [ ] Testar fluxos completos
- [ ] Atualizar testes unitários

### **Frontend (BariWeb):**

- [ ] Atualizar `nutritionistService.ts`
- [ ] Modificar consultas no dashboard
- [ ] Atualizar componentes de relacionamentos
- [ ] Testar funcionalidades
- [ ] Atualizar documentação

---

## 📚 **Referências**

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

_Este documento deve ser usado como guia para implementar a simplificação da estrutura de relacionamentos no projeto BariWeb._
