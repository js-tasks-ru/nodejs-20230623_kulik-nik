const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {
    query,
  } = ctx.query;

  if (!query) ctx.throw(400, 'Query is not passed');

  const products = [];

  (await Product.find({
    $text: {
      $search: query,
    },
  })).forEach((product) => products.push(mapProduct(product)));

  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = {
    products,
  };
};