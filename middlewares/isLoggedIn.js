const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.currentUrl = req.originalUrl;
    console.log(req.session.currentUrl);
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.currentUrl) {
    res.locals.currentUrl = req.session.currentUrl;
  }
  next();
};

export default isLoggedIn;
