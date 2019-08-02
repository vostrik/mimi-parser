const { model, Schema } = require('mongoose')

const { MODELS: { PRODUCT, PRODUCT_BRAND, PARSING } } = require('../constants')

const ProductModel = model(PRODUCT, new Schema({
  sku: Number,
  title: String,
  available: Boolean,
  brand: { type: Schema.Types.ObjectId, ref: PRODUCT_BRAND },
  images: [String],
  url: String,
  priceGross: Number,
  price: Number,
  discount: Number,
  salesCount: Number,
  commentsCount: Number,
  parsing: { type: Schema.Types.ObjectId, ref: `${PARSING}.results` }
}))

module.exports = { ProductModel }
