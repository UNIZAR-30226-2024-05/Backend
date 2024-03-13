const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");

router.get('/genre/:genero', audiolibrosController.getAudiolibrosByGenero);

module.exports = router;
