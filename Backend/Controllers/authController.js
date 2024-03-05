const { promisify } = require("util");
const { randomUUID: uuid } = require("crypto");
const User = require("../Models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../Models/refreshTokenModel");
const RefreshRecord = require("../Models/refreshRecordModel");
const DeviceSession = require("../Models/sessionModel");
const { generateAuthToken } = require("../Utils/generateAuthToken");

const signToken = (id, noExpiry) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    JSON.parse(
      JSON.stringify({
        expiresIn: noExpiry ? undefined : process.env.JWT_EXPIRES_IN,
      })
    )
  );
};
// // ======== function to creat and send token===========

const creatSendToken = async (
  user,
  statusCode,
  message,
  res,
  device,
  noExpiry = false
) => {
  const token = signToken(user._id, noExpiry);

  const logedIn = await RefreshToken.findOne({
    deviceToken: device.deviceToken,
    user: user._id,
  });
  if (logedIn) {
    await RefreshToken.findByIdAndDelete(logedIn._id);
  }

  const sessions = await DeviceSession.find({ user: user._id });
  const refreshToken = uuid();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    device: device.id,
    deviceToken: device.deviceToken,
  });
  const newUser = await User.findOne({ _id: user._id });
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    act: res.act,
    message,
    data: {
      token,
      user: newUser,
      refreshToken,
      sessions,
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;

  // console.log(token);

  if (!token) {
    return next(
      new AppError(
        "You are not logged in please log in to get access.",
        401,
        "authentication-error"
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The User belongging to this token does no longer exist.",
        401,
        "Token-expired"
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed the password! please logion again",
        401,
        "authentication-error"
      )
    );
  }

  req.user = currentUser;
  next();
});

//// =========SIGNUP USER=====================

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create a new user
    user = new User({ email, password });

    // Save the user to the database
    await user.save();

    // Generate auth token
    const authToken = generateAuthToken(user);

    // Send response with auth token and user data
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, authToken },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if the password is correct
    // const isPasswordValid = await user.comparePassword(password);

    // if (!isPasswordValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid credentials....",
    //   });
    // }

    // Generate auth token
    const authToken = generateAuthToken(user);

    // Send response with auth token and user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { authToken, user, password },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

//// ===========================VERIFY TOKEN BEFORE GETTING DATA=====================
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  console.log("verifying token....");
  // console.log(req.headers.authorization);
  token = req.headers.authorization;
  // console.log("token is:", token);
  if (!token) {
    return res.status(400).send({
      message: "You are not logged in, please login to get access",
      status: 400,
      success: true,
      data: {},
    });
  }

  // Verification of  token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("decoded", decoded);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(400).send({
      message: "User not exist now",
      status: 400,
      success: false,
      data: {},
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(400).send({
      message: "User recently changed password please login again!",
      status: 400,
      data: {},
    });
  }
  console.log("Requested Users id>>>", currentUser._id);
  req.user = currentUser;
  console.log("verification completed");
  next();
});

exports.logout = catchAsync(async (req, res, next) => {
  const device = req.body.device;

  if (!device) {
    return res.status(400).json({
      status: 400,
      message: "User or device id does not exist",
    });
  }

  await RefreshToken.deleteOne(device);

  return res.status(200).json({
    success: true,
    status: 200,
    message: "User logged out successfully",
    data: {},
  });
});
