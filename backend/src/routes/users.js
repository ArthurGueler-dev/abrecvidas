const express = require('express');
const { listar, atualizar, desativar } = require('../controllers/userController');
const { authMiddleware, requirePerfil } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', requirePerfil(['admin']), listar);
router.put('/:id', requirePerfil(['admin']), atualizar);
router.delete('/:id', requirePerfil(['admin']), desativar);

module.exports = router;
