const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/post_review", authMiddleware.isAuthenticated, reviewController.postReview);
router.post("/edit_review", authMiddleware.isAuthenticated, reviewController.editReview);
router.post("/delete_review", authMiddleware.isAuthenticated, reviewController.deleteReview);

module.exports = router;
