import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import validateSchema from "../middlewares/validateSchema.js";
import reviewSchema from "../validations/reviewSchema.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import isLoggedIn, { isReviewAuthor } from "../middlewares/isLoggedIn.js";
const router = express.Router();

router.post(
  "/:id/reviews",
  isLoggedIn,
  validateSchema(reviewSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedListing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    fetchedListing.reviews.push(newReview);
    await newReview.save();
    await fetchedListing.save();
    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }),
);

export default router;
