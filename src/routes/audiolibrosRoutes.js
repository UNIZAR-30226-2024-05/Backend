const express = require("express");
const router = express.Router();
const multer = require("multer");
const audiolibrosController = require("../controllers/audiolibrosController");
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', audiolibrosController.getAllAudiolibros);
router.get('/:id', authMiddleware.boolAuthenticated, audiolibrosController.getAudiolibroById);
router.post('/anadir',  upload.fields([{ name: "image", maxCount: 1 }, { name: "audios" }]), audiolibrosController.newAudiolibro);
router.post('/eliminar', authMiddleware.isAuthenticated, authMiddleware.adminAuthorized, audiolibrosController.deleteAudiolibro);
router.post('/actualizar', authMiddleware.isAuthenticated, authMiddleware.adminAuthorized, upload.fields([{ name: "image", maxCount: 1 }, { name: "audios" }]), audiolibrosController.updateAudiolibro);

module.exports = router;
