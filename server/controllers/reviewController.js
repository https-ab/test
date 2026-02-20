import Review from "../models/reviewModels.js";
import Gig from "../models/gigModels.js";
import createError from "../utils/createError.js";

export const createReview = async (req, res, next) => {
    if(req.isSeller) {
        return next(createError(403, "Sellers are not allowed to give reviews!"));
    }
    const newReview = new Review({
                                 userId: req.userId,
                                 gigId: req.body.gigId,
                                 desc: req.body.desc,
                                 star: req.body.star
                                });

    try {
        const review = await Review.findOne({gigId: req.body.gigId, userId: req.userId});

        // CHECKING IF ALREADY CREATED A GIG WITH THE SAME ID
        if (review) {
            return next(createError(403, "You have already reviewed this gig!"));
        }

        // TODO : CHECK IF THE USER PURCHASED THE GIG

        const savedReview = await newReview.save();

        await Gig.findByIdAndUpdate(req.body.gigId,
                                    {$inc: {totslStars: req.body.star, starNumber: 1}
                                });

        res.status(201).send(savedReview);
    } catch (err) {
        next(err);
    }
}

export const getReviews = async(req, res, next) => {
    try {
        const reviews = await Review.find({gigId: req.params.gigId});
        res.status(200).send(reviews);
    } catch (err) {
        next(err);
    }
}


// TODO  
export const deleteReview = async(req, res, next) => {

}

