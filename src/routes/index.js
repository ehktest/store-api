"use strict";
const router = require("express").Router();

// Check functionality of userCheck middleware
router.all("/", (req, res) => {
  if (req.isLogin) {
    res.json({
      error: false,
      message: "WELCOME STORE API PROJECT",
      session: req.session,
      user: req.user,
    });
  } else {
    res.json({
      error: false,
      message: "WELCOME STORE API PROJECT",
      session: req.session,
    });
  }
});

module.exports = router;
