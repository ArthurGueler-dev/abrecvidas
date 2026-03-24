const express = require('express');
const { listarTodasEvolucoes } = require('../controllers/evolucaoController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', listarTodasEvolucoes);

module.exports = router;
