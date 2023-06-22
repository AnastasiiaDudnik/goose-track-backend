const Joi = require("joi");

const createReviewSchema = Joi.object({
  name: Joi.string().required(),
  comment: Joi.string().required(),
});

const updateReviewSchema = Joi.object().keys({
  name: createReviewSchema.extract("name"),
  comment: createReviewSchema.extract("comment"),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
