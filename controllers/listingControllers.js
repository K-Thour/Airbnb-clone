import Listing from "../models/listing.js";
import ExpressError from "../utils/expressError.js";

export const index = async (_req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

export const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const fetchedListing = await Listing.findById(id).populate("owner");
  res.render("listings/edit.ejs", { listing: fetchedListing });
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
  listingData.image = { url: listingData.image, filename: "listingimage" };
  await Listing.findByIdAndUpdate(id, listingData);
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
  res.render("listings/new.ejs");
};

export const createNewListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError("No listing data found", 400);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {
    url: req.file.secure_url,
    filename: req.file.originalname,
  };
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
