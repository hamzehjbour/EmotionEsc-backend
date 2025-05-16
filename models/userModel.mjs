import { randomBytes, createHash } from "node:crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "You must provide your full name"],
  },

  email: {
    type: String,
    required: [true, "You must provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: "Please provide a valid email address",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/.test(
          value,
        );
      },
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    },
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Confirm password must match the password.",
    },
  },

  linkToSpotify: {
    type: Boolean,
    default: false,
  },

  spotify: {
    accessToken: String,
    refreshToken: String,
    tokenExpiresAt: Date,
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetTokenExpiresAt: Date,

  twoFACode: Number,
  twoFACodeExpiresAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 2000;

  next();
});

userSchema.methods.comparePasswords = async function (
  plainPassword,
  storedPassword,
) {
  return await bcrypt.compare(plainPassword, storedPassword);
};

userSchema.methods.changedPasswordAfter = function (JwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedAfter = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JwtTimestamp < changedAfter;
  }

  return false;
};

userSchema.methods.generate2FA = function () {
  const code = (parseInt(randomBytes(3).toString("hex"), 16) % 1000000)
    .toString(10)
    .padStart(6, "0");

  return code;
};

userSchema.methods.generateResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");

  this.passwordResetToken = createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
