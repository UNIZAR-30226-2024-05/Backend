const express = require("express");
const router = express.Router();
const bibliotecaController = require("../controllers/bibliotecaController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/audiolibros', authMiddleware.isAuthenticated, bibliotecaController.getUserAudiolibros);
router.get('/favoritos', authMiddleware.isAuthenticated, bibliotecaController.getUserFavoritos);
router.get('/colecciones', authMiddleware.isAuthenticated, bibliotecaController.getUserCollections);

router.post('/colecciones/create', authMiddleware.isAuthenticated, bibliotecaController.createUserCollection);
router.post('/colecciones/delete', authMiddleware.isAuthenticated, bibliotecaController.deleteUserCollection);

module.exports = router;
