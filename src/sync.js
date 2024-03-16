"use strict";

const User = require("./models/userModel");
const { ProductCategory, Product } = require("./models/productModel");

// Django migrate eslenigi, modeldeki degisikliklerin veritabaninina uygulanmasi icin custom bir handler yazilmalidir.

const syncModels = async () => {
  /* ProductCategory */
  // ? productCategoryId'si olmayanlara default olarak ilk productCategory document'inin id'si ataniyor.
  // Get first productCategory:
  const productCategory = await ProductCategory.findOne();

  if (productCategory) {
    await Product.updateMany(
      {
        //? Filter:
        productCategoryId: { $exists: false }, // field yok ise
      },
      {
        //? Update:
        productCategoryId: productCategory._id, // kaydı ata
      }
    ).catch((err) => console.log(err));
  }

  /* Exampla Data - Run Once */
  // // ? Deleted All Records:
  // await User.deleteMany().then(() => console.log(" - User Deleted All"));
  // await ProductCategory.deleteMany().then(() =>
  //   console.log(" - ProductCategory Deleted All")
  // );
  // await Product.deleteMany().then(() => console.log(" - Product Deleted All"));

  // // ? Example Admin User:
  // const admin = await User.create({
  //   email: "admin@aa.com",
  //   pass: "Qwer1234!",
  // });
  // // ? Example User:
  // const user = await User.create({
  //   email: "user@aa.com",
  //   pass: "Qwer1234!",
  // });
  // // ? Example Categories:
  // for (let ctg of [
  //   "smartphones",
  //   "laptops",
  //   "tablets",
  //   "desktops",
  //   "headphones",
  // ]) {
  //   await ProductCategory.create({
  //     name: ctg,
  //   });
  // }
  // // ? Example Products:
  // for (let key in [...Array(200)]) {
  //   const productCategory = await ProductCategory.aggregate([
  //     { $sample: { size: 1 } },
  //   ]); // rastgele bir document secer, daha verimli calisir.
  //   // const productCategory = await ProductCategory.countDocuments().then(
  //   //   count =>
  //   //     Model.findOne().skip(Math.floor(Math.random() * count));
  //   // ); // rastgele bir document secer, iki query attigi icin daha verimsizdir.
  //   await Product.create({
  //     category: productCategory[0]._id,
  //     title: `title ${key}`,
  //     description: `description ${key}`,
  //     price: Math.ceil(Math.random() * 100),
  //     discountPercentage: Math.ceil(Math.random() * 60),
  //     rating: Math.ceil(Math.random() * 5),
  //     stock: Math.floor(Math.random() * 201),
  //     brand: `brand ${key}`,
  //     thumbnail: `thumbnail ${key}`,
  //     images: [...Array(Math.ceil(Math.random() * 5))].map(
  //       (_, index) => `image ${key}${index}`
  //     ),
  //   });
  // }

  // End:
  console.log("** Synchronized **");
};

module.exports = syncModels;
