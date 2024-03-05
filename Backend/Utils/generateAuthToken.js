const jwt = require("jsonwebtoken");

function generateAuthToken(user) {
  const payload = {
    user_id: user._id,
    email: user.email,
    password: user.password,
  };

  // Generate JWT token
  const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return authToken;
}

module.exports = { generateAuthToken };
