const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");

router.get('/genre/:genero', audiolibrosController.getAudiolibrosByGenero);
router.get('/:id', audiolibrosController.getAudiolibroById); //Middleware dos vías (logeado, no)

module.exports = router;
