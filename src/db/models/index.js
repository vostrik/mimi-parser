const { ProductModel } = require('./product.model')
const { ProductBrandModel } = require('./product-brand.model')
const { ParsingModel } = require('./parsing.model')
const { ProductBlacklistModel } = require('./product-blacklist.model')
const { StopwordListModel } = require('./stopword-list.model')
const { StopwordModel } = require('./stopword.model')

module.exports = {
  ProductModel,
  ProductBrandModel,
  ParsingModel,
  ProductBlacklistModel,
  StopwordListModel,
  StopwordModel
}
