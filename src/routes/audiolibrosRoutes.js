const express = require("express");
const router = express.Router();
const multer = require("multer");
const audiolibrosController = require("../controllers/audiolibrosController");
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/anadir', upload.fields([{ name: "image", maxCount: 1 }, { name: "audios" }]), audiolibrosController.newAudiolibro);
//router.post('/eliminar', authMiddleware.adminAuthorized, audiolibrosController.deleteAudiolibro);
router.get('/genre/:genero', audiolibrosController.getAudiolibrosByGenero);

module.exports = router;
