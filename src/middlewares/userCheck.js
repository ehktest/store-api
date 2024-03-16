"use strict";

const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  if (req?.session?.id) {
    const { id, password } = req.session;
    const user = await User.findById(id);
    // ? if password changed, log user out
    if (user && user.pass === password) {
      // set req.user to user and req.isLogin to true
      req.user = user;
      req.isLogin = true;
    } else {
      // clear session data and set req.isLogin to false
      req.session = null;
      req.isLogin = false;
    }
  }
  next();
};
