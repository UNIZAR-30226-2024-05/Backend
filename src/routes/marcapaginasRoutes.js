const express = require("express");
const router = express.Router();
const marcapaginasController = require("../controllers/marcapaginasController");

router.get('/last/:username', marcapaginasController.getUltimoAudiolibro);
router.post('/create', marcapaginasController.crearMarcapaginas);
router.post('/delete', marcapaginasController.BorrarMarcapaginas);
router.post('/update', marcapaginasController.ActualizarMarcapaginas);

module.exports = router;
