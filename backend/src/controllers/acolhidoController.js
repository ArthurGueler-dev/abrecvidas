const pool = require('../config/database');
const { validarCPF, validarRG, validarEmail, formatarCPF } = require('../utils/validators');
const { uploadFoto, deletarFoto } = require('../utils/cloudinary');

// GET /api/acolhidos
const listarAcolhidos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (status) {
      where += ' AND a.status = ?';
      params.push(status);
    }

    if (search) {
      where += ' AND (a.nome LIKE ? OR a.cpf LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const { data_de, data_ate } = req.query;
    if (data_de)  { where += ' AND a.data_admissao >= ?'; params.push(data_de); }
    if (data_ate) { where += ' AND a.data_admissao <= ?'; params.push(data_ate); }

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) as total FROM acolhidos a ${where}`,
      params
    );

    const limitInt  = parseInt(limit,  10) || 10;
    const offsetInt = parseInt(offset, 10) || 0;

    const [acolhidos] = await pool.execute(
      `SELECT a.id, a.nome, a.cpf, a.telefone, a.email, a.status,
              a.data_admissao, a.foto_url, a.cidade, a.estado,
              u.nome as criado_por_nome
       FROM acolhidos a
       LEFT JOIN usuarios u ON u.id = a.criado_por
       ${where}
       ORDER BY a.data_admissao DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      params
    );

    res.json({
      sucesso: true,
      dados: acolhidos,
      paginacao: {
        total: Number(total),
        pagina: Number(page),
        limite: Number(limit),
        paginas: Math.ceil(Number(total) / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/acolhidos/:id
const obterAcolhido = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, u.nome as criado_por_nome
       FROM acolhidos a
       LEFT JOIN usuarios u ON u.id = a.criado_por
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Acolhido não encontrado' });
    }

    res.json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/acolhidos
const criarAcolhido = async (req, res, next) => {
  try {
    const {
      nome, cpf, rg, data_nascimento, sexo, estado_civil,
      telefone, telefone_secundario, email, endereco,
      cep, cidade, estado, data_admissao,
    } = req.body;

    const erros = {};
    if (!nome || nome.trim().length < 3) erros.nome = 'Nome deve ter pelo menos 3 caracteres';
    if (!cpf || !validarCPF(cpf)) erros.cpf = 'CPF inválido';
    if (!telefone) erros.telefone = 'Telefone é obrigatório';
    if (email && !validarEmail(email)) erros.email = 'E-mail inválido';
    if (rg && !validarRG(rg)) erros.rg = 'RG inválido';

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({ sucesso: false, erros });
    }

    const cpfFormatado = formatarCPF(cpf);

    const [existente] = await pool.execute(
      'SELECT id FROM acolhidos WHERE cpf = ?', [cpfFormatado]
    );

    if (existente.length > 0) {
      return res.status(400).json({ sucesso: false, erros: { cpf: 'CPF já cadastrado' } });
    }

    const [result] = await pool.execute(
      `INSERT INTO acolhidos
       (nome, cpf, rg, data_nascimento, sexo, estado_civil, telefone,
        telefone_secundario, email, endereco, cep, cidade, estado,
        data_admissao, criado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(), cpfFormatado, rg || null, data_nascimento || null,
        sexo || 'M', estado_civil || null, telefone,
        telefone_secundario || null, email || null, endereco || null,
        cep || null, cidade || null, estado || null,
        data_admissao || new Date().toISOString().split('T')[0],
        req.usuario.id,
      ]
    );

    const [novo] = await pool.execute('SELECT * FROM acolhidos WHERE id = ?', [result.insertId]);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Acolhido criado com sucesso',
      dados: novo[0],
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/acolhidos/:id
const atualizarAcolhido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const erros = {};
    if (dados.email && !validarEmail(dados.email)) erros.email = 'E-mail inválido';
    if (dados.cpf && !validarCPF(dados.cpf)) erros.cpf = 'CPF inválido';
    if (dados.rg && !validarRG(dados.rg)) erros.rg = 'RG inválido';

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({ sucesso: false, erros });
    }

    if (dados.cpf) dados.cpf = formatarCPF(dados.cpf);

    // Campos permitidos para atualização
    const camposPermitidos = [
      'nome', 'cpf', 'rg', 'data_nascimento', 'sexo', 'estado_civil',
      'telefone', 'telefone_secundario', 'email', 'endereco', 'cep',
      'cidade', 'estado', 'data_admissao', 'data_alta', 'status',
    ];

    const camposAtualizar = Object.keys(dados).filter((k) => camposPermitidos.includes(k));

    if (camposAtualizar.length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum campo válido para atualizar' });
    }

    const sets = camposAtualizar.map((k) => `${k} = ?`).join(', ');
    const valores = [...camposAtualizar.map((k) => dados[k]), req.usuario.id, id];

    await pool.execute(
      `UPDATE acolhidos SET ${sets}, atualizado_por = ? WHERE id = ?`,
      valores
    );

    const [atualizado] = await pool.execute('SELECT * FROM acolhidos WHERE id = ?', [id]);

    if (atualizado.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Acolhido não encontrado' });
    }

    res.json({ sucesso: true, mensagem: 'Acolhido atualizado com sucesso', dados: atualizado[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/acolhidos/:id
const deletarAcolhido = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT foto_public_id FROM acolhidos WHERE id = ?', [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Acolhido não encontrado' });
    }

    if (rows[0].foto_public_id) {
      await deletarFoto(rows[0].foto_public_id);
    }

    await pool.execute('DELETE FROM acolhidos WHERE id = ?', [req.params.id]);

    res.json({ sucesso: true, mensagem: 'Acolhido removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

// POST /api/acolhidos/:id/foto
const uploadFotoAcolhido = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum arquivo enviado' });
    }

    const [rows] = await pool.execute('SELECT foto_public_id FROM acolhidos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Acolhido não encontrado' });
    }

    // Remove foto antiga do Cloudinary
    if (rows[0].foto_public_id) await deletarFoto(rows[0].foto_public_id);

    const resultado = await uploadFoto(req.file, `acolhido_${id}`);

    await pool.execute(
      'UPDATE acolhidos SET foto_url = ?, foto_public_id = ? WHERE id = ?',
      [resultado.url, resultado.public_id, id]
    );

    res.json({
      sucesso: true,
      mensagem: 'Foto enviada com sucesso',
      foto_url: resultado.url,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/acolhidos/:id/foto
const deletarFotoAcolhido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT foto_public_id FROM acolhidos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Acolhido não encontrado' });
    }

    if (rows[0].foto_public_id) await deletarFoto(rows[0].foto_public_id);

    await pool.execute('UPDATE acolhidos SET foto_url = NULL, foto_public_id = NULL WHERE id = ?', [id]);

    res.json({ sucesso: true, mensagem: 'Foto removida com sucesso' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listarAcolhidos, obterAcolhido, criarAcolhido, atualizarAcolhido, deletarAcolhido, uploadFotoAcolhido, deletarFotoAcolhido };
