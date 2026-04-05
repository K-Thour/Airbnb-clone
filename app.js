import express, { urlencoded } from "express";
import mongoose from "mongoose";
import listing from "./models/listing.js";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import dns from "dns";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/expressError.js";
import listingSchema from "./validations/listingSchema.js";
import validateSchema from "./middlewares/validateSchema.js";
const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const url =
  "mongodb+srv://Airbnb:IQoHKQuCWNA9abKU@inotebook.j4dvz.mongodb.net/airbnb?retryWrites=true&w=majority&appName=airbnb";

connectDB()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.error("error connecting to db", err);
    process.exit(1);
  });

async function connectDB() {
  await mongoose.connect(url);
}

app.set("view engine", "ejs");
app.set("views", path.join("views"));
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    listings;
    res.render("listings/index.ejs", { listings });
  }),
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedListing = await listing.findById(id);
    res.render("listings/edit.ejs", { listing: fetchedListing });
  }),
);

app.put(
  "/listings/:id",
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
    await listing.findByIdAndUpdate(id, listingData);
    res.redirect(`/listings/${id}`);
  }),
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new ExpressError("No listing id found", 400);
    }
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

app.post(
  "/listings",
  validateSchema(listingSchema),
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError("No listing data found", 400);
    }
    const newListing = new listing(req.body.listing);
    newListing.image = { url: newListing.image, filename: "listingimage" };
    await newListing.save();
    res.redirect("/listings");
  }),
);

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedListing = await listing.findById(id);
    res.render("listings/show.ejs", { listing: fetchedListing });
  }),
);

app.all("/{*path}", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Error!", statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
