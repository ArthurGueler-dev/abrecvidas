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
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

/**
 * Middleware para restringir acesso por perfil.
 * @param {string[]} perfis - Ex: ['admin'], ['admin', 'profissional']
 */
const requirePerfil = (perfis) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil' });
    }
    next();
  };
};

module.exports = { authMiddleware, requirePerfil };
