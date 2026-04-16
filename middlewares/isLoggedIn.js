import Listing from "../models/listing.js";
import review from "../models/review.js";
import ExpressError from "../utils/expressError.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.currentUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.currentUrl) {
    res.locals.currentUrl = req.session.currentUrl;
  }
  next();
};

export const checkOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user._id)) {
    throw new ExpressError(
      "You don't have permission to edit this listing",
      403,
    );
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const fetchedReview = await review.findById(reviewId);
  if (!fetchedReview.author._id.equals(req.user._id)) {
    throw new ExpressError(
      "You don't have permission to delete this review",
      403,
    );
  }
  next();
};

export default isLoggedIn;
