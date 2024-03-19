const express = require("express");
const router = express.Router();
const bibliotecaController = require("../controllers/bibliotecaController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/audiolibros', authMiddleware.isAuthenticated, bibliotecaController.getAllAudiolibros);
router.get('/favoritos', authMiddleware.isAuthenticated, bibliotecaController.getAllAudiolibros);
router.get('/colecciones', authMiddleware.isAuthenticated, bibliotecaController.getAllCollections);

router.post('/colecciones/create', authMiddleware.isAuthenticated, bibliotecaController.createCollection);
router.post('/colecciones/delete', authMiddleware.isAuthenticated, bibliotecaController .deleteCollection);

module.exports = router;
