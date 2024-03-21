const express = require("express");
const router = express.Router();
const bibliotecaController = require("../controllers/bibliotecaController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/audiolibros', authMiddleware.isAuthenticated, bibliotecaController.getUserAudiolibros);
router.get('/favoritos', authMiddleware.isAuthenticated, bibliotecaController.getUserFavoritos);
router.get('/colecciones', authMiddleware.isAuthenticated, bibliotecaController.getUserCollections);
router.get('/colecciones/:titulo', authMiddleware.isAuthenticated, bibliotecaController.getAudiolibrosCollection);

router.post('/colecciones/create', authMiddleware.isAuthenticated, bibliotecaController.createUserCollection);
router.post('/colecciones/remove', authMiddleware.isAuthenticated, bibliotecaController.removeCollection);
router.post('/colecciones/friend', authMiddleware.isAuthenticated, bibliotecaController.addfriendCollection);
router.post('/colecciones/audiolibros/añadir', authMiddleware.isAuthenticated, bibliotecaController.addAudiolibroColeccion);
router.post('/colecciones/audiolibros/eliminar', authMiddleware.isAuthenticated, bibliotecaController.removeAudiolibroColeccion);

module.exports = router;
