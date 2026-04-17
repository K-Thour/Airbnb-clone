import { Router } from "express";
import passport from "passport";
import validateSchema from "../middlewares/validateSchema.js";
import userSchema from "../validations/userSchema.js";
import { saveRedirectUrl } from "../middlewares/isLoggedIn.js";
import {
  login,
  logout,
  renderLoginForm,
  renderSignupForm,
  signup,
} from "../controllers/userControllers.js";

const router = Router();
const { signupSchema, loginSchema } = userSchema;

router
  .route("/signup")
  .get(renderSignupForm)
  .post(validateSchema(signupSchema), signup);

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    validateSchema(loginSchema),
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login,
  );

router.route("/logout").get(logout);

const userRouter = router;
export default userRouter;
