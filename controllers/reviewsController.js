const { Review } = require("..//models/review");
const { HttpError } = require("..//helpers");
const { controllerWrap } = require("..//decorators");

const getAllReviews = controllerWrap(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Review.find({})
    .populate("owner", "name comment")
    .limit(limit)
    .skip(skip);
  res.json(result);
});

const getOwnerReview = controllerWrap(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Review.find({ owner })
    .populate("owner", "comment")
    .limit(limit)
    .skip(skip);

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
});

const addReview = controllerWrap(async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Review.create({ ...req.body, owner });
  res.json(result);
});

const updateCommentReview = controllerWrap(async (req, res) => {
  const { id } = req.params;
  const result = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
});

const deleteReview = controllerWrap(async (req, res) => {
  const { id } = req.params;
  const result = await Review.findByIdAndRemove(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);

  return result;
});

module.exports = {
  getAllReviews,
  getOwnerReview,
  addReview,
  updateCommentReview,
  deleteReview,
};
