import { model, Schema } from "mongoose";
import passportLocalMongoosePkg from "passport-local-mongoose";

const passportLocalMongoose =
  passportLocalMongoosePkg.default || passportLocalMongoosePkg;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = model("User", userSchema);

export default User;
