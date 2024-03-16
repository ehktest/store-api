"use strict";
/* ------------------------------------------------------------------ */
// -                           Store API
/* ------------------------------------------------------------------ */

require("dotenv").config();
const express = require("express");
const app = express();
const { logger } = require("./src/controllers/logEvents");
const connectDB = require("./src/configs/dbConnection");
const syncModels = require("./src/sync");
const session = require("cookie-session");
const getCors = require("./src/middlewares/getCors");
const postCors = require("./src/middlewares/postCors");
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;

/* ------------------------------------------------------------------ */

// logger
app.use(logger);

// Accept JSON and convert to object
app.use(express.json());
// Accept text
app.use(express.text());
// Accept form
app.use(express.urlencoded({ extended: true }));

// ? Allow static files
app.use("/static", express.static("./public"));

// IIFE Server
(async () => {
  // Veritabanı bağlantısını test et
  await connectDB();

  // sync models(model degisikliklerinin database'de manuel olarak handle edilmesi)
  await syncModels();

  // ? SessionCookies:
  app.use(
    session({
      secret: process.env.SECRET_KEY, // Sifreleme anahtari
      // maxAge: 1000 * 60 * 60 * 24 * 3 // milliseconds // 3 days
      // Burasi global cookie ayarlaridir, maxAge burada tanimlanirsa session olarak calismaz ve degiskenlik gostermez. controller'larda ayri ayri yapmak daha fazla esneklik saglar.
    })
  );
  /* ------------------------------------------------------------------ */
  // ? Custom Middlewares
  // Check whether logged in user's session/cookie data is up-to-date
  app.use(require("./src/middlewares/userCheck"));

  // Filter, Search, Sort, Pagination middleware
  app.use(require("./src/middlewares/findSearchSortPage"));
  /* ------------------------------------------------------------------ */
  // ? Routes

  // root routes -> Added functionality control of userCheck middleware
  app.use("/", require("./src/routes"));

  // user routes
  app.use("/users", postCors, require("./src/routes/userRoute"));

  // product routes
  app.use("/products", getCors, require("./src/routes/productRoute"));

  // admin routes
  app.use(
    "/admin",
    require("./src/middlewares/auth"),
    require("./src/routes/adminRoute")
  );

  // not found catcher
  app.all("*", (req, res) => {
    res.status(404).send(`${req.method} ${req.path} not found`);
  });

  // error handler middleware via imported controller
  app.use(require("./src/middlewares/errorHandler"));

  // request listener
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
})();
