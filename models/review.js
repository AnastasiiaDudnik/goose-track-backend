const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      default: 0,
      required: true,
    },
    comment: {
      type: String,
      default: "",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: "reviews",
  }
);

const Review = model("review", reviewSchema);

module.exports = { Review };
