"use strict";

require("express-async-errors");

const User = require("../models/userModel");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const CustomError = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(User);

    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(User),
      result: data,
    });
  },

  read: async (req, res) => {
    const data = await User.findById(req.params.userId);

    res.status(200).json({
      error: false,
      result: data,
    });
  },

  create: async (req, res, next) => {
    try {
      const data = await User.create(req.body);

      res.status(201).json({
        error: false,
        result: data,
      });
      // pre save hatalarini yakala ve error handler middleware'e aktar
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);

        next(new CustomError(messages.join(", "), 400));
      } else if (error instanceof CustomError) {
        next(error);
      } else {
        next(new CustomError("An unexpected error occurred", 500));
      }
    }
  },

  update: async (req, res) => {
    const data = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { runValidators: true, new: true }
    );

    res.status(202).json({
      error: false,
      message: "Updated",
      body: req.body,

      result: data,
    });
  },

  destroy: async (req, res) => {
    const data = await User.deleteOne({ _id: req.params.userId });

    if (!data.deletedCount) throw new CustomError("Not deleted", 409);

    res.status(204).json({
      error: false,
      result: data,
    });
  },

  login: async (req, res) => {
    const { email, pass } = req.body;
    if (email && pass) {
      const user = await User.findOne({ email });
      if (user && user.pass === passwordEncrypt(pass)) {
        console.log("🔭 ~ login: ~ req.session ➡ ➡ ", req.session);

        req.session.id = user._id;
        req.session.password = user.pass;
        console.log("🔭 ~ login: ~ req.session ➡ ➡ ", req.session);

        if (user.email === "admin@aa.com") {
          req.session.isAdmin = true;
        } else {
          req.session.isAdmin = false;
        }

        res.status(200).json({
          error: false,
          message: "Login OK",
          user,
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Login parameters are not true.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Email and password required.");
    }
  },

  logout: async (req, res) => {
    req.session = null;
    res.status(200).json({
      error: false,
      message: "Logout OK",
    });
  },
};
