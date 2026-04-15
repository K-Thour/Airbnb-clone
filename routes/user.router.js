import { Router } from "express";
import User from "../models/user.js";
import passport from "passport";
import validateSchema from "../middlewares/validateSchema.js";
import userSchema from "../validations/userSchema.js";
import { saveRedirectUrl } from "../middlewares/isLoggedIn.js";

const router = Router();
const { signupSchema, loginSchema } = userSchema;

router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

router.post("/signup", validateSchema(signupSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Welcome to StayEasy!");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

router.post(
  "/login",
  validateSchema(loginSchema),
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to StayEasy!");
    res.redirect(res.locals.currentUrl || "/listings");
  },
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/login");
  });
});

const userRouter = router;
export default userRouter;
