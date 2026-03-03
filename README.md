# Sistema de Gerenciamento de Acolhidos
**Associação Beneficente Renascer em Cristo**
Projeto Extensionista — Análise e Desenvolvimento de Sistemas

---

## Stack

| Camada       | Tecnologia                        |
|--------------|-----------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS 3  |
| Backend      | Node.js 18 + Express.js           |
| Autenticação | JWT + bcryptjs                    |
| Banco        | MySQL 8 (Planetscale / Aiven)     |
| Deploy       | Vercel (frontend) + Render (API)  |

---

## Início Rápido

### Pré-requisitos
- Node.js 18+
- Banco MySQL acessível (Planetscale recomendado)

### Backend
```bash
cd backend
cp .env.example .env     # preencher variáveis
npm install
npm run dev              # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env     # ajustar VITE_API_URL se necessário
npm install
npm run dev              # http://localhost:5173
```

### Banco de Dados
Execute o script `docs/banco_de_dados.sql` no seu MySQL:
```bash
mysql -u usuario -p < docs/banco_de_dados.sql
```

**Credenciais iniciais:**
- Email: `admin@renascersc.org`
- Senha: `Admin@1234` — **alterar no primeiro acesso!**

---

## Estrutura
```
abrecvidas/
├── backend/          # API REST Node.js + Express
├── frontend/         # App React + Vite
└── docs/             # Scripts SQL e documentação
```

---

## Sprints

| Sprint | Objetivo                        | Status    |
|--------|---------------------------------|-----------|
| 1      | Requisitos + Protótipos + ER    | ✅ Concluído |
| 2      | Infraestrutura + Autenticação   | 🔄 Em andamento |
| 3      | CRUD de Acolhidos               | ⏳ Pendente |
| 4      | Dados de Saúde e Família        | ⏳ Pendente |
| 5      | Evolução / Timeline             | ⏳ Pendente |
| 6      | Busca e Filtros                 | ⏳ Pendente |
| 7      | Relatórios PDF                  | ⏳ Pendente |
| 8      | Testes + Refinamento + Deploy   | ⏳ Pendente |
