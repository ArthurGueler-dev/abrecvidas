const express = require('express');
const { login, registrar, me, alterarSenha } = require('../controllers/authController');
const { authMiddleware, requirePerfil } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/registrar', authMiddleware, requirePerfil(['admin']), registrar);
router.get('/me', authMiddleware, me);
router.put('/alterar-senha', authMiddleware, alterarSenha);

module.exports = router;
