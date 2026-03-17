const pool = require('../config/database');

// ─── FAMÍLIA ─────────────────────────────────────────────────────────────────

const listarFamilia = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM acolhido_familia WHERE acolhido_id = ? ORDER BY parentesco, nome',
      [req.params.id]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) { next(err); }
};

const criarFamiliar = async (req, res, next) => {
  try {
    const { nome, parentesco, idade, telefone, situacao, observacoes } = req.body;
    if (!nome || !parentesco) {
      return res.status(400).json({ sucesso: false, erro: 'Nome e parentesco são obrigatórios' });
    }
    const [result] = await pool.execute(
      `INSERT INTO acolhido_familia (acolhido_id, nome, parentesco, idade, telefone, situacao, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, nome.trim(), parentesco, idade || null, telefone || null, situacao || null, observacoes || null]
    );
    const [novo] = await pool.execute('SELECT * FROM acolhido_familia WHERE id = ?', [result.insertId]);
    res.status(201).json({ sucesso: true, dados: novo[0] });
  } catch (err) { next(err); }
};

const atualizarFamiliar = async (req, res, next) => {
  try {
    const { nome, parentesco, idade, telefone, situacao, observacoes } = req.body;
    await pool.execute(
      `UPDATE acolhido_familia SET nome=?, parentesco=?, idade=?, telefone=?, situacao=?, observacoes=?
       WHERE id = ? AND acolhido_id = ?`,
      [nome, parentesco, idade || null, telefone || null, situacao || null, observacoes || null,
       req.params.familiarId, req.params.id]
    );
    res.json({ sucesso: true, mensagem: 'Familiar atualizado' });
  } catch (err) { next(err); }
};

const deletarFamiliar = async (req, res, next) => {
  try {
    await pool.execute(
      'DELETE FROM acolhido_familia WHERE id = ? AND acolhido_id = ?',
      [req.params.familiarId, req.params.id]
    );
    res.json({ sucesso: true, mensagem: 'Familiar removido' });
  } catch (err) { next(err); }
};

// ─── SAÚDE ───────────────────────────────────────────────────────────────────

const obterSaude = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM acolhido_saude WHERE acolhido_id = ?', [req.params.id]
    );
    res.json({ sucesso: true, dados: rows[0] || null });
  } catch (err) { next(err); }
};

const salvarSaude = async (req, res, next) => {
  try {
    const campos = [
      'tipo_sanguineo', 'alergias', 'medicamentos_em_uso', 'condicoes_cronicas',
      'historico_psiquiatrico', 'tentativas_suicidio', 'numero_tentativas',
      'acompanhamento_psicologico', 'acompanhamento_psiquiatrico', 'observacoes',
    ];
    const valores = campos.map(c => req.body[c] !== undefined ? req.body[c] : null);

    const [existe] = await pool.execute(
      'SELECT id FROM acolhido_saude WHERE acolhido_id = ?', [req.params.id]
    );

    if (existe.length > 0) {
      const sets = campos.map(c => `${c} = ?`).join(', ');
      await pool.execute(
        `UPDATE acolhido_saude SET ${sets} WHERE acolhido_id = ?`,
        [...valores, req.params.id]
      );
    } else {
      const cols = campos.join(', ');
      const placeholders = campos.map(() => '?').join(', ');
      await pool.execute(
        `INSERT INTO acolhido_saude (acolhido_id, ${cols}) VALUES (?, ${placeholders})`,
        [req.params.id, ...valores]
      );
    }

    const [atualizado] = await pool.execute(
      'SELECT * FROM acolhido_saude WHERE acolhido_id = ?', [req.params.id]
    );
    res.json({ sucesso: true, dados: atualizado[0] });
  } catch (err) { next(err); }
};

// ─── SUBSTÂNCIAS ─────────────────────────────────────────────────────────────

const obterSubstancias = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM acolhido_substancias WHERE acolhido_id = ?', [req.params.id]
    );
    res.json({ sucesso: true, dados: rows[0] || null });
  } catch (err) { next(err); }
};

const salvarSubstancias = async (req, res, next) => {
  try {
    const campos = [
      'usa_alcool', 'alcool_frequencia', 'alcool_tempo_uso',
      'usa_drogas', 'drogas_tipos', 'drogas_tempo_uso',
      'usa_medicamentos_abuso', 'medicamentos_tipos',
      'internacoes_anteriores', 'tentativas_recuperacao',
      'motivacao_tratamento', 'observacoes',
    ];
    const valores = campos.map(c => req.body[c] !== undefined ? req.body[c] : null);

    const [existe] = await pool.execute(
      'SELECT id FROM acolhido_substancias WHERE acolhido_id = ?', [req.params.id]
    );

    if (existe.length > 0) {
      const sets = campos.map(c => `${c} = ?`).join(', ');
      await pool.execute(
        `UPDATE acolhido_substancias SET ${sets} WHERE acolhido_id = ?`,
        [...valores, req.params.id]
      );
    } else {
      const cols = campos.join(', ');
      const placeholders = campos.map(() => '?').join(', ');
      await pool.execute(
        `INSERT INTO acolhido_substancias (acolhido_id, ${cols}) VALUES (?, ${placeholders})`,
        [req.params.id, ...valores]
      );
    }

    const [atualizado] = await pool.execute(
      'SELECT * FROM acolhido_substancias WHERE acolhido_id = ?', [req.params.id]
    );
    res.json({ sucesso: true, dados: atualizado[0] });
  } catch (err) { next(err); }
};

// ─── HISTÓRICO PROFISSIONAL ──────────────────────────────────────────────────

const obterHistoricoProfissional = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM acolhido_historico_profissional WHERE acolhido_id = ?', [req.params.id]
    );
    res.json({ sucesso: true, dados: rows[0] || null });
  } catch (err) { next(err); }
};

const salvarHistoricoProfissional = async (req, res, next) => {
  try {
    const campos = [
      'escolaridade', 'ultima_ocupacao', 'area_atuacao',
      'tempo_desempregado', 'fonte_renda', 'beneficios_sociais',
      'habilidades', 'observacoes',
    ];
    const valores = campos.map(c => req.body[c] !== undefined ? req.body[c] : null);

    const [existe] = await pool.execute(
      'SELECT id FROM acolhido_historico_profissional WHERE acolhido_id = ?', [req.params.id]
    );

    if (existe.length > 0) {
      const sets = campos.map(c => `${c} = ?`).join(', ');
      await pool.execute(
        `UPDATE acolhido_historico_profissional SET ${sets} WHERE acolhido_id = ?`,
        [...valores, req.params.id]
      );
    } else {
      const cols = campos.join(', ');
      const placeholders = campos.map(() => '?').join(', ');
      await pool.execute(
        `INSERT INTO acolhido_historico_profissional (acolhido_id, ${cols}) VALUES (?, ${placeholders})`,
        [req.params.id, ...valores]
      );
    }

    const [atualizado] = await pool.execute(
      'SELECT * FROM acolhido_historico_profissional WHERE acolhido_id = ?', [req.params.id]
    );
    res.json({ sucesso: true, dados: atualizado[0] });
  } catch (err) { next(err); }
};

// ─── AVALIAÇÃO MULTIPROFISSIONAL ─────────────────────────────────────────────

const listarAvaliacoes = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, u.nome as profissional_nome
       FROM acolhido_avaliacao a
       LEFT JOIN usuarios u ON u.id = a.profissional_id
       WHERE a.acolhido_id = ?
       ORDER BY a.data_avaliacao DESC`,
      [req.params.id]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) { next(err); }
};

const criarAvaliacao = async (req, res, next) => {
  try {
    const { data_avaliacao, tipo, descricao, plano_terapeutico, proxima_avaliacao } = req.body;
    if (!data_avaliacao || !tipo || !descricao) {
      return res.status(400).json({ sucesso: false, erro: 'Data, tipo e descrição são obrigatórios' });
    }
    const [result] = await pool.execute(
      `INSERT INTO acolhido_avaliacao
       (acolhido_id, profissional_id, data_avaliacao, tipo, descricao, plano_terapeutico, proxima_avaliacao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, req.usuario.id, data_avaliacao, tipo, descricao,
       plano_terapeutico || null, proxima_avaliacao || null]
    );
    const [nova] = await pool.execute(
      `SELECT a.*, u.nome as profissional_nome FROM acolhido_avaliacao a
       LEFT JOIN usuarios u ON u.id = a.profissional_id WHERE a.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ sucesso: true, dados: nova[0] });
  } catch (err) { next(err); }
};

const atualizarAvaliacao = async (req, res, next) => {
  try {
    const { data_avaliacao, tipo, descricao, plano_terapeutico, proxima_avaliacao } = req.body;
    await pool.execute(
      `UPDATE acolhido_avaliacao
       SET data_avaliacao=?, tipo=?, descricao=?, plano_terapeutico=?, proxima_avaliacao=?
       WHERE id = ? AND acolhido_id = ?`,
      [data_avaliacao, tipo, descricao, plano_terapeutico || null, proxima_avaliacao || null,
       req.params.avaliacaoId, req.params.id]
    );
    res.json({ sucesso: true, mensagem: 'Avaliação atualizada' });
  } catch (err) { next(err); }
};

const deletarAvaliacao = async (req, res, next) => {
  try {
    await pool.execute(
      'DELETE FROM acolhido_avaliacao WHERE id = ? AND acolhido_id = ?',
      [req.params.avaliacaoId, req.params.id]
    );
    res.json({ sucesso: true, mensagem: 'Avaliação removida' });
  } catch (err) { next(err); }
};

module.exports = {
  listarFamilia, criarFamiliar, atualizarFamiliar, deletarFamiliar,
  obterSaude, salvarSaude,
  obterSubstancias, salvarSubstancias,
  obterHistoricoProfissional, salvarHistoricoProfissional,
  listarAvaliacoes, criarAvaliacao, atualizarAvaliacao, deletarAvaliacao,
};
