const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/datos/:id', authMiddleware.isAuthenticated, clubController.DatosDelClub);
router.get('/lista', authMiddleware.isAuthenticated, clubController.getClubesOfUser);
router.get('/all', authMiddleware.isAuthenticated, clubController.getClubesNotOfUser);
router.post('/create', authMiddleware.isAuthenticated, clubController.CrearClub);
router.post('/delete', authMiddleware.isAuthenticated, clubController.BorrarClub);
router.post('/join', authMiddleware.isAuthenticated, clubController.UniserAClub);
router.post('/left', authMiddleware.isAuthenticated, clubController.SalirseDelClub);

module.exports = router;
