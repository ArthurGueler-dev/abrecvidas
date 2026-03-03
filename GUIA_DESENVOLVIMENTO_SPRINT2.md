# 🏥 Sistema de Gerenciamento de Fichas de Acolhidos - Guia Completo para Implementação

**Projeto Extensionista** - Análise e Desenvolvimento de Sistemas  
**Instituição:** Associação Beneficente Renascer em Cristo  
**Período:** 8 semanas (Sprint 2: Infraestrutura + Autenticação)  
**Data Início Desenvolvimento:** 24/02/2025

---

## 📋 Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Requisitos Funcionales (RF)](#requisitos-funcionais)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Hospedagem e Banco de Dados Gratuitos](#hospedagem-e-banco-de-dados-gratuitos)
6. [Design System Autoral](#design-system-autoral)
7. [Guia de Implementação Sprint 2](#guia-de-implementação-sprint-2)
8. [Estrutura de Pastas](#estrutura-de-pastas)
9. [Variáveis de Ambiente](#variáveis-de-ambiente)
10. [Próximos Passos](#próximos-passos)

---

## 📊 Resumo Executivo

Sistema web para substituir fichas em papel da instituição Renascer em Cristo. Permite:
- ✅ Cadastro completo de acolhidos
- ✅ Histórico de saúde e uso de substâncias
- ✅ Acompanhamento multiprofissional (timeline)
- ✅ Geração de relatórios em PDF
- ✅ Controle de acesso (3 perfis)
- ✅ Conformidade LGPD

**Status Atual:**
- Sprint 1 ✅ (Requisitos + Protótipos + Diagrama ER)
- Sprint 2 🔄 (Infraestrutura + Autenticação - COMEÇANDO AGORA)

---

## 🎯 Requisitos Funcionais (RF)

### RF1 - Autenticação e Controle de Acesso
- Login com email e senha
- Recuperação de senha por email
- 3 perfis: Admin, Profissional, Visualizador
- Logout seguro com encerramento de sessão
- **Status:** Implementar em Sprint 2

### RF2 - Cadastro de Acolhido
- Formulário com dados pessoais (nome, CPF, RG, data nascimento, sexo, estado civil)
- Validações de CPF/RG
- Endereço completo
- Telefones de contato
- Upload de foto
- CRUD completo
- **Status:** Implementar em Sprint 3

### RF3 - Informações Complementares
- Dados familiares
- Histórico de saúde
- Histórico de uso de substâncias
- Avaliação multiprofissional
- **Status:** Implementar em Sprint 4

### RF4 - Acompanhamento e Evolução
- Registro de evolução com timeline
- Data, hora e profissional responsável
- Editor de relatório técnico
- Histórico navegável
- **Status:** Implementar em Sprint 5

### RF5 - Busca e Filtros
- Busca avançada (nome, CPF, data, status)
- Filtros por status (ativo, inativo, alta)
- Paginação de resultados
- **Status:** Implementar em Sprint 5

### RF6 - Relatórios
- Gerar relatório individual em PDF
- Relatórios consolidados com estatísticas
- Exportação de dados
- **Status:** Implementar em Sprint 7

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  - Componentes modulares                               │
│  - Estado com Context API/Redux                        │
│  - Tailwind CSS (design autoral)                       │
│  - Hospedado em Vercel/Netlify                         │
└────────────────────────┬────────────────────────────────┘
                         │ API REST (JSON)
                         │
┌────────────────────────▼────────────────────────────────┐
│                  BACKEND (Express.js)                    │
│  - Rotas e controllers                                 │
│  - Autenticação JWT                                    │
│  - Validação de dados                                  │
│  - Hospedado em Render/Railway                         │
└────────────────────────┬────────────────────────────────┘
                         │ SQL Queries
                         │
┌────────────────────────▼────────────────────────────────┐
│              BANCO DE DADOS (MySQL)                      │
│  - Hospedado em Planetscale/Aiven                      │
│  - 8 tabelas normalizadas                              │
│  - Backup automático                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico (100% Gratuito)

### Backend
```
- Node.js v18+
- Express.js 4.x
- JWT para autenticação
- bcryptjs para senha
- mysql2/promise para conexão
- dotenv para variáveis
- CORS habilitado
```

### Frontend
```
- React 18
- React Router v6
- Tailwind CSS 3
- Axios para API calls
- Context API para estado
- React Hook Form para formulários
- Date-fns para datas
```

### Banco de Dados
```
- MySQL 8
- Suportado por Planetscale/Aiven
- Backups automáticos
- SSL/TLS obrigatório
```

### Hospedagem & DevOps
```
Backend:
- Render.com (FREE tier)
- ou Railway.app (FREE tier)
- Redeploy automático via git

Frontend:
- Vercel (FREE tier) - recomendado
- ou Netlify (FREE tier)
- Deploy automático via git

Banco de Dados:
- Planetscale (FREE tier, 1 BD grátis)
- ou Aiven (FREE tier com limite)
```

---

## 🌐 Hospedagem e Banco de Dados Gratuitos

### Opção 1: Planetscale (RECOMENDADO) ⭐

**Planetscale** é MySQL 100% compatível na nuvem

**Setup:**
```bash
# 1. Criar conta em https://planetscale.com (gratuito)
# 2. Criar banco de dados "renascer_em_cristo"
# 3. Criar conexão MySQL
# 4. Copiar connection string

# Connection String format:
mysql://[username]:[password]@[host]/[database]?sslaccept=strict
```

**Vantagens:**
- ✅ Gratuito (1 banco)
- ✅ 5GB de storage
- ✅ Backups automáticos
- ✅ SSL/TLS obrigatório
- ✅ Deploy branches (ótimo para staging)
- ✅ Muito rápido e confiável

### Opção 2: Aiven (Alternativa)

Se Planetscale não funcionar, usar Aiven:
```
https://aiven.io/ → MySQL → Free tier
```

---

## 🎨 Design System Autoral

### Paleta de Cores (Identidade Visual)

```css
/* Cores Primárias */
--primary-blue: #2563eb;        /* Azul vibrante - principal */
--primary-dark: #1e40af;        /* Azul escuro - hover/active */
--primary-light: #3b82f6;       /* Azul claro - estados */

/* Cores de Status */
--success-green: #10b981;       /* Verde - sucesso/ativo */
--warning-orange: #f59e0b;      /* Laranja - alerta */
--danger-red: #ef4444;          /* Vermelho - perigo/erro */
--info-blue: #0ea5e9;           /* Azul claro - info */

/* Escala de Cinzas (Neutrals) */
--neutral-50: #f9fafb;          /* Fundo muito claro */
--neutral-100: #f3f4f6;         /* Fundo claro */
--neutral-200: #e5e7eb;         /* Border light */
--neutral-300: #d1d5db;         /* Border */
--neutral-600: #4b5563;         /* Texto secundário */
--neutral-800: #1f2937;         /* Texto principal */
--neutral-900: #111827;         /* Texto escuro/headings */

/* Sombras */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Tipografia

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Tamanhos */
--text-xs: 12px;      /* Labels, pequenas notas */
--text-sm: 14px;      /* Texto pequeno */
--text-base: 16px;    /* Padrão */
--text-lg: 18px;      /* Subtítulos */
--text-xl: 20px;      /* Títulos secundários */
--text-2xl: 24px;     /* Títulos principais */
--text-3xl: 32px;     /* Page headers */

/* Weights */
--font-light: 300;    /* Pouco usado */
--font-normal: 400;   /* Padrão */
--font-medium: 500;   /* Labels, destaques */
--font-semibold: 600; /* Subtítulos, botões */
--font-bold: 700;     /* Títulos */
```

### Componentes Padrão

#### Botão Primário
```jsx
// Uso:
<button className="btn btn-primary">
  Ação Principal
</button>

// Estilos Tailwind:
className="
  px-6 py-2.5
  bg-blue-600 hover:bg-blue-700
  text-white font-semibold
  rounded-lg
  transition-all duration-200
  shadow-md hover:shadow-lg
  cursor-pointer
  disabled:opacity-50 disabled:cursor-not-allowed
"
```

#### Botão Secundário
```jsx
<button className="btn btn-secondary">
  Ação Secundária
</button>

// Estilos:
className="
  px-6 py-2.5
  bg-neutral-200 hover:bg-neutral-300
  text-neutral-900 font-semibold
  rounded-lg
  transition-all
"
```

#### Card
```jsx
<div className="card">
  Conteúdo
</div>

// Estilos:
className="
  bg-white
  rounded-xl
  shadow-md hover:shadow-lg
  border border-neutral-200
  p-6
  transition-shadow
"
```

#### Input
```jsx
<input className="input" type="text" />

// Estilos:
className="
  w-full
  px-4 py-2.5
  border-2 border-neutral-300
  rounded-lg
  font-base
  focus:outline-none
  focus:border-blue-600
  focus:ring-2 focus:ring-blue-100
  transition-all
"
```

#### Badge (Status)
```jsx
<span className="badge badge-success">Ativo</span>
<span className="badge badge-warning">Pendente</span>
<span className="badge badge-danger">Inativo</span>

// Estilos:
badge: "inline-block px-3 py-1 rounded-full text-sm font-semibold"
badge-success: "bg-green-100 text-green-800"
badge-warning: "bg-orange-100 text-orange-800"
badge-danger: "bg-red-100 text-red-800"
```

#### Modal/Dialog
```jsx
<div className="modal">
  <div className="modal-content">
    Conteúdo
  </div>
</div>

// Estilos:
modal: "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
modal-content: "bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
```

### Layout Padrão

**Header:**
- Logo/título à esquerda
- User menu à direita
- Altura: 64px
- Background: white com sombra

**Sidebar (quando aplicável):**
- Largura: 260px
- Background: neutral-900 (preto)
- Texto: white
- Itens com hover effect
- Item ativo com destaque azul

**Content Area:**
- Padding: 32px
- Background: neutral-50 (cinza claro)
- Max-width: sem limite (full responsive)

**Footer:**
- Background: neutral-900
- Texto: white
- Padding: 24px
- Apenas em landing pages (não em app)

### Spacing System (Tailwind)

Usar múltiplos de 4px:
```
4px = 1 unit
8px = 2 units
16px = 4 units
24px = 6 units
32px = 8 units
48px = 12 units
64px = 16 units
```

### Exemplo Completo: Página de Login

```jsx
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Renascer em Cristo
          </h1>
          <p className="text-neutral-600">
            Sistema de Gerenciamento de Acolhidos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Email
            </label>
            <input
              type="email"
              className="input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Senha
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {/* Botão */}
          <button type="submit" className="btn btn-primary w-full mt-6">
            Entrar no Sistema
          </button>
        </form>

        {/* Link */}
        <div className="text-center mt-4">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 Guia de Implementação Sprint 2

### Sprint 2 Objetivos
- ✅ Setup completo da infraestrutura
- ✅ Banco de dados criado e testado
- ✅ API backend com autenticação JWT
- ✅ Frontend com login/logout funcional
- ✅ Deploy automático configurado

### Passo 1: Setup do Backend

#### 1.1 - Clonar/Criar Repositório
```bash
# Criar pasta do projeto
mkdir renascer-em-cristo
cd renascer-em-cristo

# Inicializar git
git init

# Criar pastas
mkdir backend
mkdir frontend
mkdir docs
```

#### 1.2 - Setup Node.js + Express
```bash
cd backend
npm init -y
npm install express dotenv cors mysql2 bcryptjs jsonwebtoken joi axios

# Dev dependencies
npm install --save-dev nodemon
```

#### 1.3 - Estrutura de Pastas Backend
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # Conexão MySQL
│   │   └── env.js             # Validação de env
│   ├── controllers/
│   │   ├── authController.js  # Login, register, logout
│   │   ├── acolhidoController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── acolhidos.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js            # Verificar JWT
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── validators.js      # Validações (CPF, email, etc)
│   │   └── helpers.js
│   └── app.js                 # Express config
├── .env.example
├── .gitignore
├── package.json
└── server.js                  # Entry point
```

#### 1.4 - Arquivo: `backend/.env.example`
```env
# API
PORT=5000
NODE_ENV=development

# Banco de Dados (Planetscale)
DB_HOST=aws.connect.psdb.cloud
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=renascer_em_cristo
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui_com_minimum_32_caracteres
JWT_EXPIRE=7d

# Email (opcional, para recuperação de senha)
SMTP_HOST=seu_smtp
SMTP_PORT=587
SMTP_USER=seu_email
SMTP_PASS=sua_senha

# CORS
FRONTEND_URL=http://localhost:3000
```

#### 1.5 - Arquivo: `backend/src/config/database.js`
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: 'require', // Obrigatório para Planetscale
});

module.exports = pool;
```

#### 1.6 - Arquivo: `backend/src/app.js`
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/acolhidos', require('./routes/acolhidos'));
app.use('/api/users', require('./routes/users'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

module.exports = app;
```

#### 1.7 - Arquivo: `backend/server.js`
```javascript
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Testar conexão com BD
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao banco de dados');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

#### 1.8 - Arquivo: `backend/package.json` (script)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Passo 2: Autenticação JWT

#### 2.1 - Arquivo: `backend/src/middleware/auth.js`
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const requirePerfil = (perfis) => {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};

module.exports = { authMiddleware, requirePerfil };
```

#### 2.2 - Arquivo: `backend/src/controllers/authController.js`
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// LOGIN
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validar entrada
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }

    // Buscar usuário
    const connection = await pool.getConnection();
    const [usuarios] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    connection.release();

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const usuario = usuarios[0];

    // Comparar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// REGISTRAR (apenas admin)
const registrar = async (req, res) => {
  try {
    const { email, senha, nome, perfil } = req.body;

    // Validações
    if (!email || !senha || !nome) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir no BD
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO usuarios (email, senha_hash, nome, perfil) VALUES (?, ?, ?, ?)',
      [email, senhaHash, nome, perfil || 'profissional']
    );
    connection.release();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar' });
  }
};

module.exports = { login, registrar };
```

#### 2.3 - Arquivo: `backend/src/routes/auth.js`
```javascript
const express = require('express');
const { login, registrar } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/registrar', registrar);

module.exports = router;
```

### Passo 3: Setup do Frontend

#### 3.1 - Criar app React
```bash
cd ../frontend
npx create-react-app .
npm install react-router-dom axios

# Remover CSS padrão e adicionar Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 3.2 - Configurar Tailwind (`frontend/tailwind.config.js`)
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1e40af',
        'primary-light': '#3b82f6',
      },
    },
  },
  plugins: [],
};
```

#### 3.3 - Arquivo: `frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply px-6 py-2.5 rounded-lg font-semibold transition-all cursor-pointer;
  }

  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg;
  }

  .btn-secondary {
    @apply bg-neutral-200 hover:bg-neutral-300 text-neutral-900;
  }

  .card {
    @apply bg-white rounded-xl shadow-md border border-neutral-200 p-6 transition-shadow hover:shadow-lg;
  }

  .input {
    @apply w-full px-4 py-2.5 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all;
  }

  .badge {
    @apply inline-block px-3 py-1 rounded-full text-sm font-semibold;
  }

  .badge-success {
    @apply bg-green-100 text-green-800;
  }

  .badge-danger {
    @apply bg-red-100 text-red-800;
  }
}
```

#### 3.4 - Context API para Autenticação: `frontend/src/context/AuthContext.jsx`
```javascript
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        senha,
      });

      const { token: novoToken, usuario: dados } = response.data;
      setToken(novoToken);
      setUsuario(dados);
      localStorage.setItem('token', novoToken);
      return { sucesso: true };
    } catch (err) {
      return { sucesso: false, erro: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

#### 3.5 - Página de Login: `frontend/src/pages/LoginPage.jsx`
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await login(email, senha);
    
    if (resultado.sucesso) {
      navigate('/dashboard');
    } else {
      setErro(resultado.erro);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Renascer em Cristo
          </h1>
          <p className="text-neutral-600">
            Sistema de Gerenciamento de Acolhidos
          </p>
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Email
            </label>
            <input
              type="email"
              className="input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Senha
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}
```

#### 3.6 - Arquivo: `frontend/src/App.jsx`
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Dashboard (em construção)</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### Passo 4: Deploy

#### 4.1 - Deploy Backend (Render)

```bash
# 1. Criar conta em https://render.com
# 2. Conectar repositório GitHub
# 3. Criar novo "Web Service"
# 4. Configurar:
#    - Build: npm install
#    - Start: npm start
#    - Env vars: copiar .env.example
# 5. Deploy automático
```

#### 4.2 - Deploy Frontend (Vercel)

```bash
# 1. Criar conta em https://vercel.com
# 2. Importar repositório
# 3. Framework: Create React App
# 4. Deploy automático
```

---

## 📁 Estrutura de Pastas

```
renascer-em-cristo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── acolhidoController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── acolhidos.js
│   │   │   └── users.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── REQUISITOS.md
│   ├── ARQUITETURA.md
│   ├── GUIA_DESIGN.md
│   └── API_ROUTES.md
│
├── .gitignore
└── README.md
```

---

## 🔧 Variáveis de Ambiente

### Backend (.env)
```env
# Servidor
PORT=5000
NODE_ENV=development

# Banco de Dados
DB_HOST=aws.connect.psdb.cloud
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=renascer_em_cristo
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_super_secreta_com_minimo_32_caracteres
JWT_EXPIRE=7d

# Cors
FRONTEND_URL=http://localhost:3000

# Email (futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📅 Sprint 2 - Checklist de Entrega

- [ ] Banco de dados criado em Planetscale
- [ ] Backend rodando localmente com autenticação JWT
- [ ] Frontend com Context API para gerenciar autenticação
- [ ] Página de login funcionando
- [ ] Página de dashboard vazia (apenas layout)
- [ ] Deploy do backend em Render
- [ ] Deploy do frontend em Vercel
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente configuradas em produção
- [ ] Testes manuais de login/logout
- [ ] Documentação atualizada
- [ ] Entrega na terça de aula

---

## 🔗 Próximos Passos (Sprint 3)

- CRUD de Acolhidos (criar, ler, atualizar, deletar)
- Upload de fotos para servidor (Cloudinary gratuito)
- Validações avançadas (CPF, RG)
- Testes automatizados com Jest
- Página de dashboard com estatísticas

---

## 📚 Referências Úteis

- **Planetscale Docs:** https://planetscale.com/docs
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **JWT.io:** https://jwt.io/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/en/main
- **Express.js:** https://expressjs.com/
- **MySQL2 Node.js:** https://github.com/sidorares/node-mysql2

---

## 💬 Dúvidas?

Este documento cobre toda a infraestrutura, design system e implementação de Sprint 2. Qualquer dúvida durante o desenvolvimento, consulte as referências ou revise este documento.

**Boa codificação! 🚀**
