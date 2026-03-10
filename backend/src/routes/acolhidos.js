const express = require('express');
const multer = require('multer');
const {
  listarAcolhidos, obterAcolhido, criarAcolhido,
  atualizarAcolhido, deletarAcolhido,
  uploadFotoAcolhido, deletarFotoAcolhido,
} = require('../controllers/acolhidoController');
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

module.exports = router;
