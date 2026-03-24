const express = require('express');
const { obterEstatisticas } = require('../controllers/relatorioController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/estatisticas', obterEstatisticas);

module.exports = router;
