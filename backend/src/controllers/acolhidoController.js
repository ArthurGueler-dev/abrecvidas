// Sprint 3 - Implementação completa do CRUD de Acolhidos
// Por ora, retorna placeholder para não bloquear o frontend

const listar = async (req, res) => {
  res.json({ acolhidos: [], total: 0, message: 'Implementação prevista para Sprint 3' });
};

const buscarPorId = async (req, res) => {
  res.status(404).json({ error: 'Implementação prevista para Sprint 3' });
};

const criar = async (req, res) => {
  res.status(501).json({ error: 'Implementação prevista para Sprint 3' });
};

const atualizar = async (req, res) => {
  res.status(501).json({ error: 'Implementação prevista para Sprint 3' });
};

const remover = async (req, res) => {
  res.status(501).json({ error: 'Implementação prevista para Sprint 3' });
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
