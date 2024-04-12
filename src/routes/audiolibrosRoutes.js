const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/genre/:genero', audiolibrosController.getAudiolibrosByGenero);
router.get('/:id', authMiddleware.boolAuthenticated, audiolibrosController.getAudiolibroById);

module.exports = router;
