import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
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
    twoFACode: {
      type: String,
      required: true,
    },
    codeExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pendingSignupSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

pendingSignupSchema.methods.generate2FA = function () {
  const code = (parseInt(randomBytes(3).toString("hex"), 16) % 1000000)
    .toString(10)
    .padStart(6, "0");

  return code;
};

const PendingSignup = mongoose.model("PendingSignup", pendingSignupSchema);

export default PendingSignup;
