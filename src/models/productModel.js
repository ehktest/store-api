"use strict";

const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

const productCategoryScema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "productCategory", timestamps: true }
);

const productSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId, // ForeignKey, RelationID
      ref: "ProductCategory", // ref'teki model adi -> mongoose.model('modelName',fromWhichSchema)'deki modelName ile ayni olmak zorundadir.
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      required: true,
    },
    thumbnail: {
      type: String,
      trim: true,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    collection: "product",
    timestamps: true,
  }
);

// String array field'inda string'leri trim'ledikten sonra save yapilsin
// https://mongoosejs.com/docs/middleware.html#pre
productSchema.pre("save", function (next) {
  this.images = this.images.map((item) =>
    typeof item === "string" ? item.trim() : item
  );
  next();
});

const ProductCategory =
  models.ProductCategory || model("ProductCategory", productCategoryScema);
const Product = models.Product || model("Product", productSchema);

module.exports = { Product, ProductCategory };
