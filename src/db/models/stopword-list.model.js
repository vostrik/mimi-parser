const { model, Schema } = require('mongoose')

const { MODELS: { STOPWORD, STOPWORD_LIST } } = require('../constants')

const StopwordListModel = model(STOPWORD_LIST, new Schema({
  title: String,
  stopwords: [{ type: Schema.Types.ObjectId, ref: STOPWORD }]
}))

module.exports = { StopwordListModel }
