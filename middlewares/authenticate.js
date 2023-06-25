const jwt = require("jsonwebtoken");

// const User = require("../models/user");
const { ACCESS_SECRET_KEY } = process.env;
const { HttpError } = require("../helpers");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer] = authorization.split(" "); //[bearer, token]

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    // const user = await User.findById(id);

    // if (!user || !user.accessToken) {
    //   next(HttpError(401, "Not authorized"));
    // }
    // req.user = user;

    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;