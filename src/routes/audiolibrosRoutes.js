const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");

router.get('/genre/:genero', audiolibrosController.getAudiolibrosByGenero);
router.get('/search/:nombre', audiolibrosController.getAudiolibrosByNombre);
router.get('/last/:username', audiolibrosController.getUltimoAudiolibro);

module.exports = router;
