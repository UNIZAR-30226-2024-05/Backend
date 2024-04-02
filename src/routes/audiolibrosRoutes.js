const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/anadir', authMiddleware.adminAuthorized, audiolibrosController.newAudiolibro);
router.post('/eliminar', authMiddleware.adminAuthorized, audiolibrosController.deleteAudiolibro);
router.get('/genre/:genero', audiolibrosController.getAudiolibrosByGenero);

module.exports = router;
