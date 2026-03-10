require('./src/config/env');
const app = require('./src/app');
const pool = require('./src/config/database');
const migrar = require('./src/config/migrate');

const PORT = process.env.PORT || 5000;

pool.getConnection()
  .then(async (conn) => {
    console.log('✅ Conectado ao banco de dados MySQL');
    conn.release();

    if (process.env.RUN_MIGRATIONS === 'true') {
      await migrar();
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  });
