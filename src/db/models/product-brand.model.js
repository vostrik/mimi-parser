const { model, Schema } = require('mongoose')

const { MODELS: { PRODUCT_BRAND } } = require('../constants')

const ProductBrandModel = model(PRODUCT_BRAND, new Schema({
  brandId: Number,
  title: String
}))

module.exports = { ProductBrandModel }
