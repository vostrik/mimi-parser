const { model, Schema } = require('mongoose')

const { MODELS: { PRODUCT_BLACKLIST, PRODUCT } } = require('../constants')

const ProductBlacklistModel = model(PRODUCT_BLACKLIST, new Schema({
  title: String,
  products: [{ type: Schema.Types.ObjectId, ref: PRODUCT }]
})
)

module.exports = { ProductBlacklistModel }
