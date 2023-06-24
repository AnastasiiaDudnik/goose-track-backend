const { Schema, model } = require("mongoose");
const { MongooseError } = require("../helpers");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Set your password"],
  },
  phone: {
    type: String,
    unique: true,
    default: null,
  },
  birthday: {
    type: Date,
    default: null,
  },
  skype: {
    type: String,
    default: null,
  },
  avatarURL: String,
  accessToken: String,
  refreshToken: String,
});

userSchema.post("save", MongooseError);

const User = model("user", userSchema);

module.exports = User;
