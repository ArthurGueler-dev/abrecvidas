const express = require('express');
const { login, registrar, me } = require('../controllers/authController');
const { authMiddleware, requirePerfil } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/registrar', authMiddleware, requirePerfil(['admin']), registrar);
router.get('/me', authMiddleware, me);

module.exports = router;
