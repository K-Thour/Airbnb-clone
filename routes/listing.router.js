import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import validateSchema from "../middlewares/validateSchema.js";
import listingSchema from "../validations/listingSchema.js";
import isLoggedIn, { checkOwner } from "../middlewares/isLoggedIn.js";
import {
  createNewListing,
  deleteListing,
  editListing,
  fetchParticularListing,
  index,
  renderEditForm,
  renderNewForm,
} from "../controllers/listingControllers.js";
import { storage } from "../config/cloudinaryConfig.js";
import multer from "multer";

const upload = multer({ storage });

export const router = express.Router();

router
  .route("/")
  .get(isLoggedIn, wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateSchema(listingSchema),
    wrapAsync(createNewListing),
  );

router.get("/new", isLoggedIn, wrapAsync(renderNewForm));

router.get("/:id/edit", isLoggedIn, checkOwner, wrapAsync(renderEditForm));

router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(fetchParticularListing))
  .put(
    isLoggedIn,
    checkOwner,
    upload.single("listing[image]"),
    validateSchema(listingSchema),
    wrapAsync(editListing),
  )
  .delete(isLoggedIn, checkOwner, wrapAsync(deleteListing));

export default router;
