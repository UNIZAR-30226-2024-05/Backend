const express = require("express");
const router = express.Router();
const amistadController = require("../controllers/amistadController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/send", authMiddleware.isAuthenticated, amistadController.sendPeticion);
router.post("/accept", authMiddleware.isAuthenticated, amistadController.acceptPeticion);
router.post("/reject", authMiddleware.isAuthenticated, amistadController.rejectPeticion);
router.post("/cancel", authMiddleware.isAuthenticated, amistadController.cancelPeticion);
router.post("/remove", authMiddleware.isAuthenticated, amistadController.removeAmistad);
router.get("/peticiones", authMiddleware.isAuthenticated, amistadController.getPeticiones);
router.get("/amigos", authMiddleware.isAuthenticated, amistadController.getAmigos);

module.exports = router;