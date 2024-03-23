const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.isAuthenticated, audiolibrosController.getAllAudiolibros);
router.get('/:genero', authMiddleware.isAuthenticated, audiolibrosController.getAudiolibrosByGenero);

module.exports = router;
