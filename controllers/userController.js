const fs = require("fs").promises;
const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const User = require("../models/user");

const { HttpError, cloudinary } = require("../helpers");
const { controllerWrap } = require("../decorators");

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar.profile_url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: avatar,
  });

  const payload = {
    id: newUser._id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "3m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(newUser.id, { accessToken, refreshToken });

  res.status(201).json({
    token: accessToken,
    refreshToken,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const comparePassword = bcrypt.compare(password, user.password);

  if (!user || !comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "3m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await User.findByIdAndUpdate(user.id, { accessToken, refreshToken });

  res.json({
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      phone: user.phone,
      birthday: user.birthday,
      skype: user.skype,
    },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "Token is invalid");
    }

    const payload = {
      id,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "3m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const update = async (req, res) => {
  const { _id } = req.user;
  const { avatarURL, name, email, phone, skype, birthday } = req.body;
  const { path: oldPath } = req.file;
  const fileData = cloudinary.uploader.upload(oldPath, {
    folder: "avatar",
  });
  await fs.unlink(oldPath);

  const fieldsToUpdate = {};

  if (avatarURL) {
    fieldsToUpdate.avatarURL = fileData.url;
  }
  if (name) {
    fieldsToUpdate.name = name;
  }
  if (email) {
    fieldsToUpdate.email = email;
  }
  if (phone) {
    fieldsToUpdate.phone = phone;
  }
  if (skype) {
    fieldsToUpdate.skype = skype;
  }
  if (birthday) {
    fieldsToUpdate.birthday = birthday;
  }

  const result = await User.findByIdAndUpdate(_id, fieldsToUpdate, {
    new: true,
  });

  res.json({ result });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });

  res.status(204);
};

module.exports = {
  register: controllerWrap(register),
  login: controllerWrap(login),
  refresh: controllerWrap(refresh),
  getCurrent: controllerWrap(getCurrent),
  update: controllerWrap(update),
  logout: controllerWrap(logout),
};
