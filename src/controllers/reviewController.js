const ReviewModel = require("../models/reviewModel");

exports.postReview = async (req, res) => {
    const { user_id } = req.session.user;
    const { id_audiolibro, comentario, puntuacion, visibilidad } = req.body;

    try {
        const existingReview = await ReviewModel.alreadyExistingReview(id_audiolibro, user_id);
        if (existingReview) {
            return res.status(409).json({ 
                error: "Already existing review for audiolibro"
            });
        } else {
            const review = await ReviewModel.createReview(id_audiolibro, user_id, comentario, puntuacion, visibilidad);
            res.status(200).json(review);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.editReview = async (req, res) => {
    const { user_id } = req.session.user;
    const { id_review, comentario, puntuacion, visibilidad } = req.body;

    try {
        const exists = await ReviewModel.getReviewById(id_review, user_id)
        if(exists){
            const belongs = await ReviewModel.reviewBelongsToUser(id_review, user_id)
            if (belongs) {
                const editedReview = await ReviewModel.editReview(id_review, comentario, puntuacion, visibilidad);
                if (editedReview) {
                    return res.status(200).json({
                        message: "Updated review",
                        editedReview
                    });
                } else {
                    throw new Error("Review couldn't be updated"); //?
                }
            } else {
                return res.status(403).json({ 
                    error: "Review doesn't belong to user"
                });
            }
        } else {
            return res.status(404).json({ 
                error: "Review doesn't exist"
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deleteReview = async (req, res) => {
    const { user_id } = req.session.user;
    const { id_review } = req.body;
    try {
        const exists = await ReviewModel.getReviewById(id_review, user_id)
        if(exists){
            const belongs = await ReviewModel.reviewBelongsToUser(id_review, user_id)
            if (belongs) {
                ReviewModel.deleteReview(id_review);
                return res.status(200).json({
                    message: "Deleted review"
                });
            } else {
                return res.status(403).json({ 
                    error: "Review doesn't belong to user"
                });
            }
        } else {
            return res.status(404).json({ 
                error: "Review doesn't exist"
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};