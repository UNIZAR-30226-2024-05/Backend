const express = require("express");
const router = express.Router();
const coleccionesController = require("../controllers/coleccionesController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.isAuthenticated, coleccionesController.getUserCollections);
router.get('/:coleccionId', authMiddleware.isAuthenticated, coleccionesController.getInfoCollection);

router.post('/create', authMiddleware.isAuthenticated, coleccionesController.createUserCollection);
router.post('/remove', authMiddleware.isAuthenticated, coleccionesController.removeCollection);
router.post('/friend', authMiddleware.isAuthenticated, coleccionesController.addfriendCollection);
router.post('/anadirAudiolibro', authMiddleware.isAuthenticated, coleccionesController.addAudiolibroColeccion);
router.post('/eliminarAudiolibro', authMiddleware.isAuthenticated, coleccionesController.removeAudiolibroColeccion);

module.exports = router;
