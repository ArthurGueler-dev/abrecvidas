const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { helmetMiddleware, limiteGeral, compressionMiddleware, sanitizarBody } = require('./middleware/security');

const app = express();

const origensPermitidas = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://abrecvidas.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(helmetMiddleware);
app.use(compressionMiddleware);
app.use(limiteGeral);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origensPermitidas.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origem não permitida'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizarBody);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/acolhidos', require('./routes/acolhidos'));
app.use('/api/users', require('./routes/users'));
app.use('/api/evolucoes', require('./routes/evolucoes'));
app.use('/api/relatorios', require('./routes/relatorios'));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use(errorHandler);

module.exports = app;
