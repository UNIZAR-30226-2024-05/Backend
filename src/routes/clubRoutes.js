const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const authMiddleware = require('../middlewares/authMiddleware');

/*router.get('/:id', clubController.DatosClub);*/
/*router.get('/', clubController.AllClubs);  Habra que hablar si sera implementar buscador, si les devolvemos todos y ellos gestionan el buscador o si los devolvemos por audiolibro*/
router.post('/create', authMiddleware.isAuthenticated, clubController.CrearClub);
router.post('/delete', authMiddleware.isAuthenticated, clubController.BorrarClub);
/*router.post('/join', authMiddleware.isAuthenticated, clubController.UnirseAClub);
router.post('/left', authMiddleware.isAuthenticated, clubController.DejarClub);*/

module.exports = router;
