# SIGA — Sistema de Gerenciamento de Acolhidos
**Associação Beneficente Renascer em Cristo (ABREC)**
Projeto Extensionista — Análise e Desenvolvimento de Sistemas

---

## Stack

| Camada       | Tecnologia                       |
|--------------|----------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS 3 |
| Backend      | Node.js 18 + Express.js          |
| Autenticação | JWT + bcryptjs                   |
| Banco        | MySQL 8 (Aiven)                  |
| Fotos        | Cloudinary                       |
| Deploy       | Vercel (frontend) + Render (API) |

---

## Início Rápido

### Pré-requisitos
- Node.js 18+
- Banco MySQL acessível

### Backend
```bash
cd backend
cp .env.example .env   # preencher variáveis de ambiente
npm install
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env   # ajustar VITE_API_URL se necessário
npm install
npm run dev            # http://localhost:5173
```

### Banco de Dados
Configure as variáveis `DB_*` no `.env` do backend e execute a migração:
```bash
RUN_MIGRATIONS=true node server.js
```

> As credenciais de acesso inicial são definidas na migração e devem ser alteradas no primeiro acesso.

---

## Testes

```bash
# Unitários (validações de CPF, RG, email, senha, formatação, idade)
node backend/tests/unit.test.js

# Segurança (autenticação, SQL injection, proteção de rotas, JWT, RBAC)
node backend/tests/security.js
```

---

## Variáveis de Ambiente

Crie `backend/.env` com base no arquivo `.env.example`:

```
PORT=5000
NODE_ENV=development

DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=...

JWT_SECRET=...
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Estrutura

```
abrecvidas/
├── backend/
│   ├── src/
│   │   ├── config/       # database, env, migrate
│   │   ├── controllers/  # auth, acolhidos, users
│   │   ├── middleware/   # auth, errorHandler
│   │   ├── routes/       # auth, acolhidos, users
│   │   └── utils/        # validators, cloudinary
│   └── tests/
│       ├── unit.test.js  # testes unitários
│       └── security.js   # testes de segurança
├── frontend/
│   └── src/
│       ├── components/   # Layout, FormAcolhido, Toast, Modal
│       ├── context/      # AuthContext
│       ├── hooks/        # useToast
│       ├── pages/        # Login, Dashboard, Acolhidos, ...
│       └── services/     # api.js (Axios)
└── docs/
    └── banco_de_dados.sql
```

---

## Sprints

| Sprint | Objetivo                        | Status       |
|--------|---------------------------------|--------------|
| 1      | Requisitos + Protótipos + ER    | ✅ Concluído |
| 2      | Infraestrutura + Autenticação   | ✅ Concluído |
| 3      | CRUD de Acolhidos               | ✅ Concluído |
| 4      | Dados de Saúde e Família        | ⏳ Pendente  |
| 5      | Evolução / Timeline             | ⏳ Pendente  |
| 6      | Busca e Filtros                 | ⏳ Pendente  |
| 7      | Relatórios PDF                  | ⏳ Pendente  |
| 8      | Testes + Refinamento + Deploy   | ⏳ Pendente  |
