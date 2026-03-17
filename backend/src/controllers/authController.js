const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validarEmail, validarSenha } = require('../utils/validators');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const [usuarios] = await pool.execute(
      'SELECT id, nome, email, senha_hash, perfil, ativo FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const usuario = usuarios[0];

    if (!usuario.ativo) {
      return res.status(403).json({ error: 'Usuário inativo. Contate o administrador.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/registrar  (somente admin)
const registrar = async (req, res, next) => {
  try {
    const { email, senha, nome, perfil } = req.body;

    if (!email || !senha || !nome) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (!validarSenha(senha)) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres' });
    }

    const perfisValidos = ['admin', 'profissional', 'visualizador'];
    const perfilFinal = perfisValidos.includes(perfil) ? perfil : 'profissional';

    const [existente] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existente.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, perfilFinal]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario_id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const me = async (req, res, next) => {
  try {
    const [usuarios] = await pool.execute(
      'SELECT id, nome, email, perfil, criado_em FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ usuario: usuarios[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/alterar-senha  (usuário autenticado)
const alterarSenha = async (req, res, next) => {
  try {
    const { senha_atual, nova_senha } = req.body;

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (!validarSenha(nova_senha)) {
      return res.status(400).json({ error: 'A nova senha deve ter no mínimo 8 caracteres' });
    }

    const [usuarios] = await pool.execute(
      'SELECT senha_hash FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha_atual, usuarios[0].senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    const novoHash = await bcrypt.hash(nova_senha, 10);
    await pool.execute('UPDATE usuarios SET senha_hash = ? WHERE id = ?', [novoHash, req.usuario.id]);

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, registrar, me, alterarSenha };
