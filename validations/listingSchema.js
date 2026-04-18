import Joi from "joi";

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null).optional(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

export default listingSchema;
