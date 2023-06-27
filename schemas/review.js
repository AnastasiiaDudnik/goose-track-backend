const Joi = require("joi");

const createReviewSchema = Joi.object({
  name: Joi.string().required(),
  rating: Joi.number().max(5).min(0).integer().required(),
  comment: Joi.string().required(),
});

const updateReviewSchema = Joi.object().keys({
  name: createReviewSchema.extract("name"),
  rating: createReviewSchema.extract("rating"),
  comment: createReviewSchema.extract("comment"),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
