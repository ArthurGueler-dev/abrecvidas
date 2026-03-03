require('dotenv').config();

const obrigatorias = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];

const faltando = obrigatorias.filter((v) => !process.env[v]);

if (faltando.length > 0) {
  console.error(`❌ Variáveis de ambiente obrigatórias não definidas: ${faltando.join(', ')}`);
  console.error('Copie o arquivo .env.example para .env e preencha os valores.');
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
