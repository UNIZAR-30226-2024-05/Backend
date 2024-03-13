const express = require("express");
const router = express.Router();
const marcapaginasController = require("../controllers/marcapaginasController");

router.get('/last/:username', marcapaginasController.getUltimoAudiolibro);

module.exports = router;
