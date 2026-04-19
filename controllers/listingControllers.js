import Listing from "../models/listing.js";
import ExpressError from "../utils/expressError.js";
import { categories } from "../public/js/filters.js";

export const index = async (_req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

export const searchListings = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    req.flash("error", "Please enter a search term");
    return res.redirect("/listings");
  }
  const searchRegex = new RegExp(q.trim(), "i");
  const listings = await Listing.find({
    $or: [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
    ],
  });
  if (listings.length === 0) {
    req.flash("error", `No listings found for "${q}"`);
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { listings });
};

export const renderEditForm = async (req, res) => {
  const { id } = req.params;
  let fetchedListing = await Listing.findById(id).populate("owner");
  fetchedListing.image.url = fetchedListing.image.url.replace(
    "/upload/",
    "/upload/w_250,h_250,c_fill/",
  );
  res.render("listings/edit.ejs", { listing: fetchedListing, categories });
};

export const editListing = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ExpressError("No listing id found", 400);
  }
  const listingData = req.body.listing;
  if (!listingData) {
    throw new ExpressError("No listing data found", 400);
  }
  // Remove the image string field from body (handled separately)
  delete listingData.image;
  const updatedListing = await Listing.findByIdAndUpdate(id, listingData, {
    new: true,
  });
  // If a new file was uploaded, update the image
  if (req.file) {
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename || req.file.originalname,
    };
    await updatedListing.save();
  }
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

export const deleteListing = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ExpressError("No listing id found", 400);
  }
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};

export const renderNewForm = async (_req, res) => {
  res.render("listings/new.ejs", { categories });
};

export const createNewListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError("No listing data found", 400);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  // If an image was uploaded, use it; otherwise the model default is used
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename || req.file.originalname,
    };
  }
  await newListing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
};

export const fetchParticularListing = async (req, res) => {
  const { id } = req.params;
  const fetchedListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!fetchedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing: fetchedListing });
};
