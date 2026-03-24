const pool = require('../config/database');

// GET /api/acolhidos/:id/evolucoes
const listarEvolucoes = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, u.nome as profissional_nome
       FROM evolucoes e
       LEFT JOIN usuarios u ON u.id = e.profissional_id
       WHERE e.acolhido_id = ?
       ORDER BY e.criado_em DESC`,
      [req.params.id]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) { next(err); }
};

// GET /api/evolucoes (todas, global)
const listarTodasEvolucoes = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const limitInt = Math.min(parseInt(limit, 10) || 50, 200);
    const [rows] = await pool.execute(
      `SELECT e.*, u.nome as profissional_nome, a.nome as acolhido_nome
       FROM evolucoes e
       LEFT JOIN usuarios u ON u.id = e.profissional_id
       LEFT JOIN acolhidos a ON a.id = e.acolhido_id
       ORDER BY e.criado_em DESC
       LIMIT ${limitInt}`,
      []
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) { next(err); }
};

// POST /api/acolhidos/:id/evolucoes
const criarEvolucao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { descricao, tipo } = req.body;
    if (!descricao || descricao.trim().length < 3) {
      return res.status(400).json({ sucesso: false, erro: 'Descrição é obrigatória (mínimo 3 caracteres)' });
    }
    const [result] = await pool.execute(
      `INSERT INTO evolucoes (acolhido_id, profissional_id, descricao, tipo) VALUES (?, ?, ?, ?)`,
      [id, req.usuario.id, descricao.trim(), tipo || 'Geral']
    );
    const [nova] = await pool.execute(
      `SELECT e.*, u.nome as profissional_nome FROM evolucoes e LEFT JOIN usuarios u ON u.id = e.profissional_id WHERE e.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ sucesso: true, dados: nova[0] });
  } catch (err) { next(err); }
};

// PUT /api/acolhidos/:id/evolucoes/:evolucaoId
const atualizarEvolucao = async (req, res, next) => {
  try {
    const { evolucaoId } = req.params;
    const { descricao, tipo } = req.body;
    if (!descricao || descricao.trim().length < 3) {
      return res.status(400).json({ sucesso: false, erro: 'Descrição é obrigatória' });
    }
    await pool.execute(
      `UPDATE evolucoes SET descricao = ?, tipo = ? WHERE id = ?`,
      [descricao.trim(), tipo || 'Geral', evolucaoId]
    );
    const [atualizada] = await pool.execute(
      `SELECT e.*, u.nome as profissional_nome FROM evolucoes e LEFT JOIN usuarios u ON u.id = e.profissional_id WHERE e.id = ?`,
      [evolucaoId]
    );
    res.json({ sucesso: true, dados: atualizada[0] });
  } catch (err) { next(err); }
};

// DELETE /api/acolhidos/:id/evolucoes/:evolucaoId
const deletarEvolucao = async (req, res, next) => {
  try {
    await pool.execute(`DELETE FROM evolucoes WHERE id = ?`, [req.params.evolucaoId]);
    res.json({ sucesso: true, mensagem: 'Evolução removida' });
  } catch (err) { next(err); }
};

module.exports = { listarEvolucoes, listarTodasEvolucoes, criarEvolucao, atualizarEvolucao, deletarEvolucao };
