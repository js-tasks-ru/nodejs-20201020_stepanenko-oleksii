const Product = require('../models/Product');
const mongoose = require('mongoose');
module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (!ctx.request.query.subcategory) {
    return next();
  }
  ctx.body = {products: await Product.find({'subcategory':ctx.request.query.subcategory})};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: await Product.find()};
  next();
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid (ctx.params.id))
    ctx.throw(400, `Id:${ctx.params.id} is not valid`);

  var product = await Product.findOne({'_id': ctx.params.id});
  if (!product)
    ctx.throw(404, `No product with id:${ctx.params.id}`);

  ctx.body = {product: product};
};

