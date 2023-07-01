const Joi = require("joi");

const createReviewSchema = Joi.object({
  rating: Joi.number().max(5).min(0).integer().required(),
  comment: Joi.string().required(),
});

const updateReviewSchema = Joi.object().keys({
  comment: createReviewSchema.extract("comment"),
  rating: createReviewSchema.extract("rating"),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
