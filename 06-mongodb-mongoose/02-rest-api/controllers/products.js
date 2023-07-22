const {
  mongoose,
  ObjectId,
} = require('mongoose');
const mapProduct = require('../mappers/product');
const modelProduct = require('../models/Product');


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {
    subcategory,
  } = ctx.query;

  if (!subcategory) return next();

  if (mongoose.isValidObjectId(subcategory)) {
    const products = [];
    (await modelProduct.find({
      'subcategory': subcategory,
    })).forEach((product) => products.push(mapProduct(product)));

    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = {
      products,
    };
  } else {
    ctx.throw(400, 'Not Found');
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = [];
  (await modelProduct.find()).forEach((product) => products
    .push(mapProduct(product)));
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = {
    products,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const {
    id,
  } = ctx.params;
  if (mongoose.isValidObjectId(id)) {
    const product = await modelProduct.findById(id);
    if (!product) {
      ctx.throw(404, 'No product found');
    }
    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = {
      product: mapProduct(product),
    };
  } else {
    ctx.throw(400, 'Not Found');
  }
};