import review from "../models/review.js";
import Listing from "../models/listing.js";

export const createReview = async (req, res) => {
  const { id } = req.params;
  const fetchedListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  // Convert rating to number
  const reviewData = req.body.review;
  if (reviewData.rating) {
    reviewData.rating = parseInt(reviewData.rating, 10);
  }

  const newReview = new review(reviewData);
  newReview.author = req.user._id;
  fetchedListing.reviews.push(newReview);
  await newReview.save();
  await fetchedListing.save();
  res.redirect(`/listings/${id}`);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
