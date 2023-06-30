const express = require("express");

const router = express.Router();

const {
  register,
  login,
  refresh,
  getCurrent,
  update,
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

router.post("/refresh", validate(refreshSchema), authenticate, refresh);

router.get("/current", authenticate, getCurrent);

router.patch("/update", upload.single("avatarURL"), authenticate, update);

router.post("/logout", authenticate, logout);

module.exports = router;
