"use strict";

const cors = require("cors");

module.exports = cors({
  origin: "*",
  methods: ["POST"],
});
