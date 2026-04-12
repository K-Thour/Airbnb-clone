import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/expressError.js";
import Listing from "../models/listing.js";
import validateSchema from "../middlewares/validateSchema.js";
import listingSchema from "../validations/listingSchema.js";

export const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  }),
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing: fetchedListing });
  }),
);

router.put(
  "/:id",
  validateSchema(listingSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new ExpressError("No listing id found", 400);
    }
    const listingData = req.body;
    if (!listingData) {
      throw new ExpressError("No listing data found", 400);
    }
    listingData.image = { url: listingData.image, filename: "listingimage" };
    await Listing.findByIdAndUpdate(id, listingData);
    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new ExpressError("No listing id found", 400);
    }
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

router.post(
  "/",
  validateSchema(listingSchema),
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError("No listing data found", 400);
    }
    const newListing = new Listing(req.body.listing);
    newListing.image = { url: newListing.image, filename: "listingimage" };
    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings");
  }),
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedListing = await Listing.findById(id).populate("reviews");
    if (!fetchedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: fetchedListing });
  }),
);

export default router;
