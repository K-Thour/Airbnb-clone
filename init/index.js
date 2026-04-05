import mongoose from "mongoose";
import listing from "../models/listing.js";
import data from "./data.js";

const url =
  "mongodb+srv://thour:ChSkVdo0hwmwOHIE@inotebook.j4dvz.mongodb.net/airbnb?retryWrites=true&w=majority&appName=airbnb";

connectDB()
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.error("error connecting to db");
    process.exit(1);
  });

async function connectDB() {
  await mongoose.connect(url);
}

const initDB = async () => {
  await listing.deleteMany({});
  await listing.insertMany(data.data);
  console.log("data was initialized");
  process.exit(0);
};

initDB();
