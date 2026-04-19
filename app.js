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
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user.js";
import userRouter from "./routes/user.router.js";
import MongoStore from "connect-mongo";
import envConfigs from "./config/envConfigs.js";

const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const url = envConfigs.MONGODB_URL;
if (!url) {
  console.error("MONGODB_URL not found in environment variables");
  process.exit(1);
}

async function connectDB() {
  await mongoose.connect(url);
}

const store = new MongoStore({
  mongoUrl: url,
  crypto: {
    secret: envConfigs.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Session store error", err);
});

const sessionOptions = {
  store,
  secret: envConfigs.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join("views"));
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/", userRouter);

app.get("/demoUser", async (req, res) => {
  let fakeUser = new User({
    email: "karan@gmail.com",
    username: "karan-user",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

app.use((_, __, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, _, res) => {
  const { message = "Error!", statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(envConfigs.PORT, () => {
  connectDB()
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.error("error connecting to db", err);
      process.exit(1);
    });
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log(`app is running on port ${envConfigs.PORT}`);
});
