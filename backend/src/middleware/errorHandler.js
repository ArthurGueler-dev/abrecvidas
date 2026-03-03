// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[Erro]', err.message || err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
