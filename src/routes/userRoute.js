"use strict";

const router = require("express").Router();

const User = require("../controllers/userController");
const idValidation = require("../middlewares/idValidation");

router.post("/login", User.login).post("/logout", User.logout);

module.exports = router;
