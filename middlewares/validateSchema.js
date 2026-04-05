const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw new ExpressError(errorMessage, 400);
    }
    next();
  };
};

export default validateSchema;
