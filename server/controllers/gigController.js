import createError from "../utils/createError.js";
import Gig from "../models/gigModels.js";

 export const createGig = async(req, res, next) => {
    //REQ COMES FROM JWT
    if(!req.isSeller) {
        return next(createError(403, "You are not allowed to create a gig!"));
    }

    // ITS IMP TO TAKE USERID FROM TOKEN AS OTHER USERS MAY BE ABLE TO UPLOAD HERE
    const newGig = new Gig({
        userId: req.userId,
        ...req.body
    })

    try {
        const savedGig = await newGig.save();
        res.status(201).send(savedGig);
    } catch (err) {
        // res.status(500).send("Something went wrong");
        next(err);
    }
}

export const deleteGig = async(req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return next(createError(404, "Gig not found"));
          }

        if (gig.userId !== req.userId) {
            return next(createError(403, "You can only delete your gig!"));
        }

        await Gig.findByIdAndDelete(req.params.id);

        res.status(200).send("Gig has been deleted");
    } catch (err) {
        next(err);
    }
}

export const getGig = async(req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return next (createError(404, "Gig not found!"));
        }

        res.status(200).send(gig);

    } catch (err) {
        next(err);
    }
}

export const getGigs = async(req, res, next) => {
    const q  = req.query;

    // $options : "i" means case insensitive

    const filters = {
        ...(q.userId && {userId: q.userId}),
        ...(q.cat && {cat: q.cat}),
        ...((q.min || q. max) && {
            price: {
                ...(q.min && {$gt: q.min}),
                ...(q.max && {$lt: q.max}),
            }
        }),
        ...(q.search && {$regex: q.search, $options: "i"})
    }

    // const filters = {
    //     ...(q.cat && {cat: q.cat}),
    //     price: {$gt: 0},
    //     ...(q.search && {$regex: q.search, $options: "i"})
    // };

    // const filters = {
    //     cat: q.cat,
    //     price: {$gt: 0},
    //     title: {$regex: q.search, $options: "i"}
    // }
    // const filters = {
    //     cat: "design"
    // }

    // try {
    //     const gigs = await Gig.find(filters);
    //     res.status(200).send(gigs);
    // } catch (err) {
    //     next(err);
    // }

    const allowedSortFields = ["price", "createdAt", "rating"];
const sortField = allowedSortFields.includes(q.sort) ? q.sort : "createdAt";
try {
    const gigs = await Gig.find(filters).sort({[sortField]: -1});
    res.status(200).send(gigs);
} catch (err) {
    next(err);
}
}
