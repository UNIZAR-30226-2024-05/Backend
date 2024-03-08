const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", authMiddleware.isAuthenticated, userController.logout);
router.post("/change_pass", authMiddleware.isAuthenticated, userController.changePass)
router.get("/profile", authMiddleware.isAuthenticated, userController.profile)

module.exports = router;
