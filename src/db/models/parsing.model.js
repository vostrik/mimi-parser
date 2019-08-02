const { model, Schema } = require('mongoose')

const { MODELS: { PARSING, PRODUCT } } = require('../constants')

const ParsingModel = model(PARSING, new Schema({
  title: String,
  url: { type: String, unique: true },
  interval: Number,
  results: [{
    parsedAt: Number,
    duration: Number,
    products: [{ type: Schema.Types.ObjectId, ref: PRODUCT }]
  }]
}))

module.exports = { ParsingModel }
