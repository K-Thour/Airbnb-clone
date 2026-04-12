import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import validateSchema from "../middlewares/validateSchema.js";
import reviewSchema from "../validations/reviewSchema.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
const router = express.Router();

router.post(
  "/:id/reviews",
  validateSchema(reviewSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedListing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    fetchedListing.reviews.push(newReview);
    await newReview.save();
    await fetchedListing.save();
    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }),
);

export default router;
