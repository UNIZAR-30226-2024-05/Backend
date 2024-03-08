const express = require("express");
const router = express.Router();
const audiolibrosController = require("../controllers/profileController");

router.get('/profile/:username', profileController.getProfileByUsername);

module.exports = router;
