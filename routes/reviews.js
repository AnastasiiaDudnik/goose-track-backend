const express = require("express");
const {
  getAllReviews,
  getOwnerReview,
  addReview,
  updateCommentReview,
  deleteReview,
} = require("..//controllers/reviewsController");
const { validateBody, isValidId, authenticate } = require("..//middlewares");
const {
  createReviewSchema,
  updateReviewSchema,
} = require("..//schemas/review");

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", authenticate, isValidId, getOwnerReview);
router.post("/", authenticate, validateBody(createReviewSchema), addReview);
router.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateReviewSchema),
  updateCommentReview
);
router.delete("/:id", authenticate, isValidId, deleteReview);

module.exports = router;
