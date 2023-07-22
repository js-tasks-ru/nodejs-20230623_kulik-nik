const mapCategory = require('../mappers/category');
const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = [];
  (await Category.find()).forEach((category) => categories.push(mapCategory(category)));
  ctx.response.status = 200;
  ctx.body = {
    categories,
  };
};