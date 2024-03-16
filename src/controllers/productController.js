"use strict";

// yarn add express-async-errors
require("express-async-errors");

const CustomError = require("../errors/customError");
const { ProductCategory, Product } = require("../models/productModel");

module.exports.ProductCategory = {
  // ? get all
  list: async (req, res) => {
    // const data = await ProductCategory.find({});
    //* - FILTERING & SEARCHING & SORTING & PAGINATION *//
    // ! middleware ile response'a eklenen getModelList async function'ina model girilerek filter, search, sort, pagination yaptirilabilir dilenen controller method'unda.
    const data = await res.getModelList(ProductCategory);

    // ! pagination detail'leri icin middleware'e eklenmis ekstra async function ile pagination detail'leri response ile donulebilir, bu frontend pagination oldukca elverislidir, ekstra hic bir package/logic kullanmaya gerek kalmaz.
    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(ProductCategory),
      result: data,
    });
  },
  // ? get single
  read: async (req, res) => {
    const data = await ProductCategory.findById(req.params.productCategoryId);

    res.status(200).json({
      error: false,
      result: data,
    });
  },
  // ? create
  create: async (req, res) => {
    const data = await ProductCategory.create(req.body);
    res.status(201).json({
      error: false,
      result: data,
    });
  },
  // ? update
  update: async (req, res) => {
    // const data = await ProductCategory.updateOne(
    //   { _id: req.params.productCategoryId },
    //   req.body
    // );
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
    const data = await ProductCategory.findOneAndUpdate(
      { _id: req.params.productCategoryId },
      req.body,
      { runValidators: true, new: true }
    ); // default olarak bulunani doner, update edilmis halini degil. new:true ile update edilmis halini doner.

    // 202 -> accecpted
    res.status(202).json({
      error: false,
      message: "Updated",
      body: req.body, // gonderilen veriyi goster
      // info: data,
      // result: await ProductCategory.findById(req.params.productCategoryId), // guncellenmis veriyi goster
      result: data, // guncellenmis veriyi goster
    });
  },
  // ? delete
  destroy: async (req, res) => {
    const data = await ProductCategory.deleteOne({
      _id: req.params.productCategoryId,
    });

    // res.sendStatus(data.deletedCount ? 204 : 404);
    // 204 ile response body yollamaz, o yüzden status 200 yollayip neyin silindigi de kullaniciya gösterilebilir.
    // if (data.deletedCount !== 0) {
    //   // res.sendStatus(204);
    //   res.status(200).json({
    //     error: false,
    //     result: data,
    //   });
    // } else {
    //   res.errorStatusCode = 404;
    //   throw new Error("Document Not Found");
    // }
    if (!data.deletedCount) throw new CustomError("Not deleted", 409); // 409 Conflict
    // res.status(200).json({
    res.status(204).json({
      error: false,
      result: data,
    });
  },
};

module.exports.Product = {
  // ? get all
  list: async (req, res) => {
    // const data = await Product.find({});
    //* - FILTERING & SEARCHING & SORTING & PAGINATION *//
    // ! middleware ile response'a eklenen getModelList async function'ina model girilerek filter, search, sort, pagination yaptirilabilir dilenen controller method'unda.
    const data = await res.getModelList(Product, "category");

    // ! Foreign key'in yalnizca id'sini gormektense document'in kendisini nested olarak gormek icin populate(foreignKeyFieldName) methodu kullanilabilir. Populate hangi model'den ObjectId ile document dondurecegini field'taki ref key'ine girilmis olan model ismi ile belirleyecektir.
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
    // const data = await Product.find({}).populate("category");

    // ! pagination detail'leri icin middleware'e eklenmis olan ekstra async function ile pagination detail'leri response ile donulebilir, bu frontend pagination icin oldukca elverislidir, ekstra hic bir package/logic kullanmaya gerek kalmaz.
    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(Product),
      result: data,
    });
  },
  // ? get all by category
  listByCtg: async (req, res) => {
    let ctg = await ProductCategory.findOne({
      name: req.params.productCategoryName,
    });
    // ctg = ctg.toJSON({ flattenObjectIds: true });

    if (!ctg) {
      res.status(200).json({
        error: false,
        result: [],
      });
    }

    //* - FILTERING & SEARCHING & SORTING & PAGINATION *//
    // ! middleware ile response'a eklenen getModelList async function'ina model girilerek filter, search, sort, pagination yaptirilabilir dilenen controller method'unda.
    // ! Foreign key'in yalnizca id'sini gormektense document'in kendisini nested olarak gormek icin populate(foreignKeyFieldName) methodu kullanilabilir. Populate hangi model'den ObjectId ile document dondurecegini field'taki ref key'ine girilmis olan model ismi ile belirleyecektir.
    const data = await res.getModelList(Product, "category", {
      category: ctg._id,
    });

    // ! pagination detail'leri icin middleware'e eklenmis olan ekstra async function ile pagination detail'leri response ile donulebilir, bu frontend pagination icin oldukca elverislidir, ekstra hic bir package/logic kullanmaya gerek kalmaz.
    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(Product, {
        category: ctg._id,
      }),
      result: data,
    });
  },
  // ? get single
  read: async (req, res) => {
    // ! Foreign key'in yalnizca id'sini gormektense document'in kendisini nested olarak gormek icin populate(foreignKeyFieldName) methodu kullanilabilir. Populate hangi model'den ObjectId ile document dondurecegini field'taki ref key'ine girilmis olan model ismi ile belirleyecektir.
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
    const data = await Product.findById(req.params.productId).populate(
      "category"
    );

    res.status(200).json({
      error: false,
      result: data,
    });
  },
  // ? create
  create: async (req, res) => {
    const data = await Product.create(req.body);

    res.status(201).json({
      error: false,
      result: data,
    });
  },

  // ? update
  update: async (req, res) => {
    // const data = await Product.updateOne(
    //   { _id: req.params.productId },
    //   req.body
    // );
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
    const data = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      req.body,
      { runValidators: true, new: true }
    ); // default olarak bulunani doner, update edilmis halini degil. new:true ile update edilmis halini doner.

    // 202 -> accecpted
    res.status(202).json({
      error: false,
      message: "Updated",
      body: req.body, // gonderilen veriyi goster
      // info: data, // guncellenmis veriyi goster
      // result: await Product.findById(req.params.productId), // guncellenmis veriyi goster
      result: data, // guncellenmis veriyi goster
    });
  },
  // ? delete
  destroy: async (req, res) => {
    const data = await Product.deleteOne({ _id: req.params.productId });

    // res.sendStatus(data.deletedCount ? 204 : 404);
    // 204 ile response body yollamaz, o yüzden status 200 yollayip neyin silindigi de kullaniciya gösterilebilir.
    if (!data.deletedCount) throw new CustomError("Not deleted", 409); // 409 Conflict
    // res.status(200).json({
    res.status(204).json({
      error: false,
      result: data,
    });
  },
};

// Status Code'lar
// 1xx -> Informational responses
// 2xx -> Successful responses
// 3xx -> Redirection responses
// 4xx -> Client error responses
// 5xx -> Server error responses
