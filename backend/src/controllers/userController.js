const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { validarEmail, validarSenha } = require('../utils/validators');

// GET /api/users  (admin)
const listar = async (req, res, next) => {
  try {
    const [usuarios] = await pool.execute(
      'SELECT id, nome, email, perfil, ativo, criado_em FROM usuarios ORDER BY nome'
    );
    res.json({ usuarios });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id  (admin)
const atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email, perfil, ativo, senha } = req.body;

    const perfisValidos = ['admin', 'profissional', 'visualizador'];
    if (perfil && !perfisValidos.includes(perfil)) {
      return res.status(400).json({ error: 'Perfil inválido' });
    }

    if (email && !validarEmail(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (senha) {
      if (!validarSenha(senha)) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres' });
      }
      const senhaHash = await bcrypt.hash(senha, 10);
      await pool.execute(
        'UPDATE usuarios SET senha_hash = ? WHERE id = ?',
        [senhaHash, id]
      );
    }

    const campos = [];
    const valores = [];
    if (nome) { campos.push('nome = ?'); valores.push(nome); }
    if (email) { campos.push('email = ?'); valores.push(email); }
    if (perfil) { campos.push('perfil = ?'); valores.push(perfil); }
    if (ativo !== undefined) { campos.push('ativo = ?'); valores.push(ativo ? 1 : 0); }

    if (campos.length > 0) {
      valores.push(id);
      await pool.execute(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores);
    }

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (admin) - desativa, não exclui (LGPD)
const desativar = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({ error: 'Não é possível desativar seu próprio usuário' });
    }

    await pool.execute('UPDATE usuarios SET ativo = 0 WHERE id = ?', [id]);
    res.json({ message: 'Usuário desativado com sucesso' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, atualizar, desativar };
