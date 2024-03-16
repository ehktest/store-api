"use strict";

const CustomError = require("../errors/customError");

module.exports = (req, res, next) => {
  if (!req?.user) {
    throw new CustomError(
      `Only admin can access ${req.method} ${req.path}`,
      401
    );
  }
  req?.session.isAdmin ? next() : res.redirect("/");
};
