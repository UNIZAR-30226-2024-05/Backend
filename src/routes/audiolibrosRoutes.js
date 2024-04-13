const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/audiolibrosController");

router.get('/', audiolibrosController.getAllAudiolibros);

module.exports = router;
