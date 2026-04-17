import User from "../models/user.js";

export const renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

export const signup = async (req, res) => {
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
};

export const renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

export const login = (req, res) => {
  req.flash("success", "Welcome back to StayEasy!");
  res.redirect(res.locals.currentUrl || "/listings");
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/login");
  });
};
