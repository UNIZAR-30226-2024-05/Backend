const express = require("express");
const router = express.Router();
const autoresController = require("../controllers/autoresController");
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/data/:id', autoresController.getDatosAutor);
router.get('/lista', autoresController.getAutores);
router.post('/create', authMiddleware.adminAuthorized, autoresController.CrearAutor);
router.post('/delete', authMiddleware.adminAuthorized, autoresController.BorrarAutor);
router.post('/update', authMiddleware.adminAuthorized, autoresController.ActualizarAutor); 

module.exports = router;
