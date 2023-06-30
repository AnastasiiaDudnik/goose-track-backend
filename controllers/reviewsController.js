const { Review } = require("..//models/review");
const { HttpError } = require("..//helpers");
const { controllerWrap } = require("..//decorators");

const getAllReviews = controllerWrap(async (req, res) => {
  const result = await Review.find({}).populate("owner", "name avatarURL");
  res.json(result);
});

const getOwnerReview = controllerWrap(async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Review.find({ owner }).populate(
    "owner",
    "name avatarURL"
  );

  if (!result) {
    throw HttpError(404);
  }
  let [result1] = result; // деструкт. объект из массива
  res.json(result1);
});

const addReview = controllerWrap(async (req, res) => {
  const { _id: owner } = req.user;
  const id = await Review.findOne({ owner });

  if (id) {
    throw HttpError(409, "User already has a review");
  }
  const result = await Review.create({ ...req.body, owner });
  res.json(result);
});

const updateCommentReview = controllerWrap(async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Review.findOneAndUpdate({ owner }, req.body, {
    new: true,
  }).populate("owner", "name avatarURL");

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);

  // const { id } = req.params;
  // const result = await Review.findByIdAndUpdate(id, req.body, {
  //   new: true,
  // });

  // if (!result) {
  //   throw HttpError(404);
  // }

  // res.json(result);
});

const deleteReview = controllerWrap(async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Review.findOneAndDelete({ owner });

  if (!result) {
    throw HttpError(404);
  }
  res.status(204).json({ message: "Review deleted" });

  // const { id } = req.params;
  // const result = await Review.findByIdAndRemove(id);
  // if (!result) {
  //   throw HttpError(404);
  // }
  // res.json(result);
  // return result;
});

module.exports = {
  getAllReviews,
  getOwnerReview,
  addReview,
  updateCommentReview,
  deleteReview,
};
