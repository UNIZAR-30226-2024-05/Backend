const express = require("express");
const router = express.Router();
const marcapaginasController = require("../controllers/marcapaginasController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/last/:username', marcapaginasController.getUltimoAudiolibro);
router.post('/create',authMiddleware.isAuthenticated, marcapaginasController.crearMarcapaginas);
router.post('/delete',authMiddleware.isAuthenticated, marcapaginasController.BorrarMarcapaginas);
router.post('/update',authMiddleware.isAuthenticated, marcapaginasController.ActualizarMarcapaginas);

module.exports = router;
