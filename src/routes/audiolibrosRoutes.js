const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', audiolibrosController.getAllAudiolibros);
router.get('/:id', authMiddleware.boolAuthenticated, audiolibrosController.getAllAudiolibros);

module.exports = router;
