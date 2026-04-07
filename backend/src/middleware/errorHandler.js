// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  // Loga sempre no servidor, mas não expõe stack em produção
  if (!isProd) {
    console.error('[Erro]', err);
  } else {
    console.error('[Erro]', err.message || err);
  }

  const status = err.status || err.statusCode || 500;

  // Erros conhecidos do mysql2 (constraint, duplicate, etc.)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Registro duplicado — verifique os dados informados.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'Referência inválida nos dados enviados.' });
  }

  const message = isProd && status === 500
    ? 'Erro interno do servidor'
    : (err.message || 'Erro interno do servidor');

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
