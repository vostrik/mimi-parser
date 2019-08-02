require('dotenv').config()
const mongoose = require('mongoose')

const constants = require('./constants')
const models = require('./models')

module.exports = {
  connectToDatabase,
  constants,
  models
}

function connectToDatabase ({ user, password, host, database }) {
  return new Promise((resolve, reject) => {
    try {
      mongoose.connect(`mongodb://${user}:${password}@${host}/${database}?authSource=admin`, {
        useNewUrlParser: true,
        useCreateIndex: true
      })
      const db = mongoose.connection
      db.on('error', reject)
      db.once('open', resolve)
    } catch (error) {
      reject(error)
    }
  })
}
