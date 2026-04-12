import express, { urlencoded } from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import dns from "dns";
import ExpressError from "./utils/expressError.js";
import listingRouter from "./routes/listing.router.js";
import reviewRouter from "./routes/review.router.js";
import session from "express-session";
import flash from "connect-flash";
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

const sessionOptions = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};

async function connectDB() {
  await mongoose.connect(url);
}

app.set("view engine", "ejs");
app.set("views", path.join("views"));
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);

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
