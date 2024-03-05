const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "must enter email"],
      //   lowercase: truee,
      validate: [validator.isEmail, "please provide a valid email"],
    },
    image: {
      type: String,
      default:
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
    },
    password: {
      type: String,
      required: [true, "must enter password"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      minlength: 8,
      select: false,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    otp: {
      type: Number,
    },
    otpExpires: Date,
    authToken: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    // Check if enteredPassword exists
    if (!enteredPassword) {
      throw new Error("No password provided");
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(enteredPassword, this.password);

    // Return true if passwords match, false otherwise
    return isMatch;
  } catch (error) {
    console.error(error);
    return false;
  }
};

userSchema.pre("save", async function (next) {
  //only run this function if password id actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost
  this.password = await bcrypt.hash(this.password, 12);
  // remove(stop) the confirmPassword to store in db. require means necessary to input not to save in db.
  this.confirmPassword = undefined;
  next();
});
// password Tester
userSchema.methods.correctPassword = async function (
  passwordByUser,
  passwordInDb
) {
  return await bcrypt.compare(passwordByUser, passwordInDb);
};
// ========method to protect routes verifies all about token

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// update "passwordChangedAt value in DB whenever we update password "
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //here -1000 mili seconds is to make sure that it will not creat any problem in login as some times that gets this
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;