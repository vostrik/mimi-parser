const { model, Schema } = require('mongoose')

const { MODELS: { STOPWORD } } = require('../constants')

const StopwordModel = model(STOPWORD, new Schema({
  title: String
}))

module.exports = { StopwordModel }
