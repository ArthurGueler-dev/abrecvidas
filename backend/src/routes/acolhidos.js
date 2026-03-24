const express = require('express');
const multer = require('multer');
const {
  listarAcolhidos, obterAcolhido, criarAcolhido,
  atualizarAcolhido, deletarAcolhido,
  uploadFotoAcolhido, deletarFotoAcolhido,
} = require('../controllers/acolhidoController');
const {
  listarEvolucoes, criarEvolucao, atualizarEvolucao, deletarEvolucao,
} = require('../controllers/evolucaoController');
const {
  listarFamilia, criarFamiliar, atualizarFamiliar, deletarFamiliar,
  obterSaude, salvarSaude,
  obterSubstancias, salvarSubstancias,
  obterHistoricoProfissional, salvarHistoricoProfissional,
  listarAvaliacoes, criarAvaliacao, atualizarAvaliacao, deletarAvaliacao,
} = require('../controllers/complementarController');
const { authMiddleware, requirePerfil } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPG, PNG ou WEBP são permitidas'));
    }
  },
});

router.use(authMiddleware);

router.get('/',     listarAcolhidos);
router.get('/:id',  obterAcolhido);
router.post('/',    requirePerfil(['admin', 'profissional']), criarAcolhido);
router.put('/:id',  requirePerfil(['admin', 'profissional']), atualizarAcolhido);
router.delete('/:id', requirePerfil(['admin']), deletarAcolhido);

router.post('/:id/foto',   upload.single('file'), uploadFotoAcolhido);
router.delete('/:id/foto', deletarFotoAcolhido);

// Sprint 5 — Evoluções
router.get   ('/:id/evolucoes',                     listarEvolucoes);
router.post  ('/:id/evolucoes',              rw,    criarEvolucao);
router.put   ('/:id/evolucoes/:evolucaoId',  rw,    atualizarEvolucao);
router.delete('/:id/evolucoes/:evolucaoId',  rw,    deletarEvolucao);

// Sprint 4 — Informações complementares
const rw = requirePerfil(['admin', 'profissional']);

router.get   ('/:id/familia',                  listarFamilia);
router.post  ('/:id/familia',             rw,  criarFamiliar);
router.put   ('/:id/familia/:familiarId', rw,  atualizarFamiliar);
router.delete('/:id/familia/:familiarId', rw,  deletarFamiliar);

router.get('/:id/saude',       obterSaude);
router.put('/:id/saude', rw,   salvarSaude);

router.get('/:id/substancias',       obterSubstancias);
router.put('/:id/substancias', rw,   salvarSubstancias);

router.get('/:id/historico-profissional',       obterHistoricoProfissional);
router.put('/:id/historico-profissional', rw,   salvarHistoricoProfissional);

router.get   ('/:id/avaliacoes',                    listarAvaliacoes);
router.post  ('/:id/avaliacoes',              rw,   criarAvaliacao);
router.put   ('/:id/avaliacoes/:avaliacaoId', rw,   atualizarAvaliacao);
router.delete('/:id/avaliacoes/:avaliacaoId', rw,   deletarAvaliacao);

module.exports = router;
