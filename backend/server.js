require('./src/config/env'); // valida variáveis antes de tudo
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 5000;

pool.getConnection()
  .then((conn) => {
    console.log('✅ Conectado ao banco de dados MySQL');
    conn.release();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    console.error('Verifique as variáveis de ambiente no arquivo .env');
    process.exit(1);
  });
