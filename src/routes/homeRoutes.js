const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get("/", authMiddleware.isAuthenticated, homeController.getHome);

module.exports = router;
