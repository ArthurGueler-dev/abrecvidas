const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const compression = require('compression');

// ─── Helmet: cabeçalhos HTTP de segurança ────────────────────────────────────
const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // permite imagens Cloudinary
  contentSecurityPolicy: false, // gerenciado pelo frontend (Vite)
});

// ─── Rate limiting: limite de requisições na rota de login ───────────────────
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos e tente novamente.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // não conta tentativas bem-sucedidas
});

// ─── Rate limiting geral: evita abuso da API ─────────────────────────────────
const limiteGeral = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 300,
  message: { error: 'Muitas requisições. Tente novamente em instantes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Compression: respostas gzip ─────────────────────────────────────────────
const compressionMiddleware = compression({ level: 6 });

// ─── Sanitização de strings: remove tags HTML de campos de texto ──────────────
function sanitizarString(valor) {
  if (typeof valor !== 'string') return valor;
  return valor.replace(/<[^>]*>/g, '').trim();
}

function sanitizarBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    const sanitizar = (obj) => {
      for (const chave of Object.keys(obj)) {
        if (typeof obj[chave] === 'string') {
          obj[chave] = sanitizarString(obj[chave]);
        } else if (typeof obj[chave] === 'object' && obj[chave] !== null) {
          sanitizar(obj[chave]);
        }
      }
    };
    sanitizar(req.body);
  }
  next();
}

module.exports = { helmetMiddleware, limiteLogin, limiteGeral, compressionMiddleware, sanitizarBody };
