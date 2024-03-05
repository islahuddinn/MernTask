const express = require("express");
const userControler = require("../Controllers/userController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
// router.post("/verify", authController.verifyEmail);
router.post("/login", authController.login);
// router.post("/sendOTP", authController.sendOTP);
// router.post("/verifyOTP", authController.verifyOtp);
// router.post("/refresh/:token", authController.refresh);
// router.post("/forgetPassword", authController.forgotPassword);
// router.patch("/resetPassword", authController.resetPassword);
// router.post(
//   "/verifyOTPResetPassword",
//   authController.verifyOtpForResetPassword
// );

// protecting all routes ussing protect midleware
// router.use(authController.protect);
router.post("/logout", authController.logout);

router.get("/me", userControler.getMe, userControler.getUser);
router.patch("/updateProfile", userControler.updateMe);
router.route("/getAllUsers").get(userControler.getAllUsers);

router
  .route("/:id")
  .get(userControler.getUser)
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser)
  .post(userControler.deleteUser);

module.exports = router;
