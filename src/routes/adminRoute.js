"use strict";
const router = require("express").Router();

const {
  ProductCategory,
  Product,
} = require("../controllers/productController");
const User = require("../controllers/userController");
const CustomError = require("../errors/customError");
const idValidation = require("../middlewares/idValidation");

// User:
router
  .route("/users")
  // ? get all
  .get(User.list)
  // ? create
  .post(User.create);

router
  .route("/users/:userId(\\w+)")
  .all(idValidation)
  // ? get single
  .get(User.read)
  // ? update
  .put(User.update)
  .patch(User.update)
  // ? delete
  .delete(User.destroy);

// ProductCategory:
router
  .route("/categories")
  // ? get all
  .get(ProductCategory.list)
  // ? create
  .post(ProductCategory.create);

router
  .route("/categories/:productCategoryId(\\w+)")
  .all(idValidation)
  // ? get single
  .get(ProductCategory.read)
  // ? update
  .put(ProductCategory.update)
  .patch(ProductCategory.update)
  // ? delete
  .delete(ProductCategory.destroy);

// Product:
router
  .route("/products/category/:productCategoryName(\\w+)")
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
  .route("/products")
  // ? get all
  .get(Product.list)
  // ? create
  .post(Product.create);

router
  .route("/products/:productId(\\w+)")
  .all(idValidation)
  // ? get single
  .get(Product.read)
  // ? update
  .put(Product.update)
  .patch(Product.update)
  // ? delete
  .delete(Product.destroy);

module.exports = router;
