const express = require("express");

const router = express.Router();

const {
  register,
  login,
  refresh,
  getCurrent,
  updateAvatar,
  logout,
} = require("../controllers/userController");

const { validate } = require("../decorators");

const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../schemas/userValidate");

const { authenticate, upload } = require("../middlewares");

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("./refresh", validate(refreshSchema), refresh);

router.get("/current", authenticate, getCurrent);

router.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  updateAvatar
);

router.post("/logout", authenticate, logout);

module.exports = router;
