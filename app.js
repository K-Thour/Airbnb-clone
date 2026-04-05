import express, { urlencoded } from "express";
import mongoose from "mongoose";
import listing from "./models/listing.js";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import dns from "dns";
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

app.get("/listings", async (req, res) => {
  const listings = await listing.find({});
  listings;
  res.render("listings/index.ejs", { listings });
});

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const fetchedListing = await listing.findById(id);
  res.render("listings/edit.ejs", { listing: fetchedListing });
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listingData = req.body;
  listingData.image = { url: listingData.image, filename: "listingimage" };
  await listing.findByIdAndUpdate(id, listingData);
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
  const newListing = new listing(req.body);
  newListing.image = { url: newListing.image, filename: "listingimage" };
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const fetchedListing = await listing.findById(id);
  res.render("listings/show.ejs", { listing: fetchedListing });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
