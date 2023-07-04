const { HttpError } = require("../helpers");

const validateQuery = (schemas) => {
  const func = (req, res, next) => {
    const { error } = schemas.validate(req.query);

    if (error) {
      return next(HttpError(404, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateQuery;
