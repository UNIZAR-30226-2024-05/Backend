const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");

router.get('/', audiolibrosController.getAllAudiolibros);
router.get('/:genero', audiolibrosController.getAudiolibrosByGenero);

module.exports = router;
