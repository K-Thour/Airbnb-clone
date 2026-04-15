import Joi from "joi";

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export default {
  loginSchema,
  signupSchema,
};
