// const express = require("express");

// const {
//   registerUser,
//   loginUser,
//   sendOTP,
//   verifyOTP,
// } = require("../Controllers/AuthController");

// const router = express.Router();

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.post("/send-otp", sendOTP);

// router.post("/verify-otp", verifyOTP);

// module.exports = router;

const express = require("express");

const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../Controllers/AuthController");

const router = express.Router();

// =====================================================
// NORMAL REGISTER
// Name + Email + Password
// =====================================================

router.post("/register", registerUser);

// =====================================================
// NORMAL LOGIN
// Email + Password
// =====================================================

router.post("/login", loginUser);

// =====================================================
// GOOGLE LOGIN / REGISTER
// =====================================================

router.post("/google", googleLogin);

module.exports = router;