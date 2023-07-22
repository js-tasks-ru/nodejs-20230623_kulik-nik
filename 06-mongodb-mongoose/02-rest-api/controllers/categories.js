const mapCategory = require('../mappers/category');
const modelCategory = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = [];
  (await modelCategory.find()).forEach((category) => categories.push(mapCategory(category)));
  ctx.response.status = 200;
  ctx.body = {
    categories,
  };
};