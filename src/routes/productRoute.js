"use strict";
const router = require("express").Router();

const { Product } = require("../controllers/productController");
const CustomError = require("../errors/customError");
const idValidation = require("../middlewares/idValidation");

// Product:
router
  .route("/category/:productCategoryName(\\w+)")
  .all((req, res, next) => {
    if (/[^A-Za-z]/g.test(req.params.productCategoryName)) {
      next(new CustomError("Category name can only contain letters", 400));
    } else {
      next();
    }
  })
  // ? get products by category name
  .get(Product.listByCtg);

router
  .route("/")
  // ? get all
  .get(Product.list);

router
  .route("/:productId(\\w+)")
  .all(idValidation)
  // ? get single
  .get(Product.read);

module.exports = router;
