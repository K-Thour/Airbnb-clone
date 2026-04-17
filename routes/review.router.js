import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import validateSchema from "../middlewares/validateSchema.js";
import reviewSchema from "../validations/reviewSchema.js";
import isLoggedIn, { isReviewAuthor } from "../middlewares/isLoggedIn.js";
import {
  createReview,
  deleteReview,
} from "../controllers/reviewControllers.js";
const router = express.Router();

router.post(
  "/:id/reviews",
  isLoggedIn,
  validateSchema(reviewSchema),
  wrapAsync(createReview),
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview),
);

export default router;
