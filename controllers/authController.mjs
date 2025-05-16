/* eslint-disable camelcase */
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import queryString from "node:querystring";
import jwt from "jsonwebtoken";

import PendingSignup from "../models/pendingSignup.mjs";
import User from "../models/userModel.mjs";

import AppError from "../utils/AppError.mjs";
import sendMail from "../utils/email.mjs";
import createTfaEmail from "../emails/tfaEmail.mjs";
import sendWelcomeEmail from "../emails/welcomeEmail.mjs";
import {
  getAccessToken,
  refreshAccessToken,
} from "../utils/spotifyAccessHandler.mjs";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: false,
    domain: "localhost",
    sameSite: "None",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      message,
      user,
    },
  });
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new AppError(
        "Your are not logged in! Please log in to use the application",
        401,
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new AppError("Please login to get access", 401);
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError("User changes his password please log in again", 401);
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(err);
  }
};

export const start = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      throw new AppError("There is already an account with this email", 400);
    }

    let pendingUser = new PendingSignup();
    const twoFACode = pendingUser.generate2FA();

    pendingUser = await PendingSignup.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      twoFACode,
      codeExpiresAt: Date.now() + 5 * 60 * 1000,
    });

    const { html, message } = createTfaEmail(twoFACode);
    await sendMail({
      email: req.body.email,
      subject: "Email Verification",
      message,
      html,
    });

    res.status(200).json({
      status: "success",
      data: {
        message: "Please verify your account",
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const pendingUser = await PendingSignup.findOne({ email });

    if (+pendingUser.twoFACode !== +code) {
      throw new AppError(
        "Please enter the correct code sent to your email",
        401,
      );
    }

    if (pendingUser.codeExpiresAt < Date.now()) {
      throw new AppError(
        "Your code have expired please request a new one",
        401,
      );
    }

    const user = {
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
    };

    const newUser = (
      await User.create([user], { validateBeforeSave: false })
    ).at(0);
    await PendingSignup.deleteOne({ email });

    // const html = htmlWelcomeTemplate.replace(
    //   "{{NAME}}",
    //   newUser.fullName.split(" ").at(0),
    // );

    // const message = "Welcome to EmotionEsc";

    const { html, message } = sendWelcomeEmail(
      newUser.fullName.split(" ").at(0),
    );

    await sendMail({
      email: newUser.email,
      subject: "Welcome to EmotionEsc",
      message,
      html,
    });

    newUser.password = undefined;

    createSendToken(newUser, 200, res, "Your account was created successfully");
  } catch (err) {
    return next(err);
  }
};

export const resend = async (req, res, next) => {
  try {
    const { email } = req.query;

    const pendingUser = await PendingSignup.findOne({ email });

    const newtwoFACode = pendingUser.generate2FA();
    const newExpire = Date.now() + 5 * 60 * 1000;

    pendingUser.twoFACode = newtwoFACode;
    pendingUser.codeExpiresAt = newExpire;

    const { html, message } = sendTfaEmail(newtwoFACode);

    await sendMail({
      email,
      subject: "Email Verification",
      message,
      html,
    });

    await pendingUser.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        message: "new code has been sent",
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please provide email and password!", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePasswords(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    createSendToken(user, 200, res, "Logged in successfully");
  } catch (err) {
    return next(err);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new AppError("No account found with this email", 404);
    }

    const resetToken = user.generateResetToken();

    const twoFACode = user.generate2FA();

    user.twoFACode = twoFACode;
    user.twoFACodeExpiresAt = Date.now() + 5 * 60 * 1000;

    const { html, message } = createTfaEmail(twoFACode);

    await sendMail({
      email: req.body.email,
      subject: "Password Reset",
      message,
      html,
    });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        resetToken,
        message: "Verification code sent to email",
      },
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetToken = createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("Incorrect or Invalid token", 400);
    }

    if (+user.twoFACode !== +req.body.code) {
      throw new AppError(
        "Please enter the correct code sent to your email",
        401,
      );
    }

    if (user.twoFACodeExpiresAt < Date.now()) {
      throw new AppError("Your code have expired", 401);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    user.twoFACode = undefined;
    user.twoFACodeExpiresAt = undefined;
    await user.save();

    createSendToken(user, 200, res, "Reset password is successfull");
  } catch (err) {
    next(err);
  }
};

export const updateMyPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (
      !(await user.comparePasswords(req.body.currentPassword, user.password))
    ) {
      throw new AppError("Your current password is incorrect", 401);
    }

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken(user, 200, res, "Successfully updated your password");
  } catch (err) {
    return next(err);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    if (req.body.password || req.body.confirmPassword) {
      return next(new AppError("Please use update my password route", 400));
    }

    const newbody = filterObj(req.body, "fullName", "email");
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newbody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const redirectToSpotify = (req, res) => {
  const scopes = [
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  const authUrl = `https://accounts.spotify.com/authorize?${queryString.stringify(
    {
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes.join(" "),
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: req.user.id,
    },
  )}`;

  res.status(200).json({
    status: "success",
    data: {
      authUrl,
    },
  });
};

export const handleSpotifyCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;

    const { access_token, refresh_token, expires_in } =
      await getAccessToken(code);

    const user = await User.findByIdAndUpdate(
      state,
      {
        linkToSpotify: true,
        spotify: {
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiresAt: Date.now() + expires_in * 1000,
        },
      },
      {
        new: true,
        runValidators: false,
      },
    );

    res.status(200).json({
      status: "success",
      data: {
        message: "Spotify linked successfully. You may close this tab.",
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshSpotifyAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const { access_token, refresh_token, expires_in } =
      await refreshAccessToken(refreshToken);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        spotify: {
          accessToken: access_token,
          refreshToken: refresh_token || refreshToken,
          tokenExpiresAt: Date.now() + expires_in * 1000,
        },
      },
      {
        new: true,
        runValidators: false,
      },
    );

    res.status(200).json({
      status: "success",
      data: {
        message: "Spotify's access token refreshed successfully.",
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
