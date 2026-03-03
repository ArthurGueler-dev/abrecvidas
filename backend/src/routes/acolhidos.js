const express = require('express');
const {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
} = require('../controllers/acolhidoController');
const { authMiddleware, requirePerfil } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listar);
router.get('/:id', listar);  // placeholder até Sprint 3
router.post('/', requirePerfil(['admin', 'profissional']), criar);
router.put('/:id', requirePerfil(['admin', 'profissional']), atualizar);
router.delete('/:id', requirePerfil(['admin']), remover);

// Silencia linter até Sprint 3
void buscarPorId;

module.exports = router;
