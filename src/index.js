const fs = require('fs')
const path = require('path')

const { connectToDatabase, models } = require('./db')
const { Parser } = require('./parser/parser')
const { logger } = require('./logger/logger')

init()

async function init () {
  try {
    await connectToDatabase({
      user: process.env.dbUser,
      password: process.env.dbPassword,
      host: process.env.dbHost,
      database: process.env.dbName
    })
    logger.info('Connect to database')
    const parser = new Parser({ models })

    // create new parsings
    try {
      const parsings = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '..', 'data', 'parsings.json'))
      )
      await parser.actualizeParsings({
        parsings,
        defaultInterval: process.env.defaultInterval
      })
      logger.info('Actualize parsings')
    } catch (error) {
      logger.error(error)
    }

    logger.info('Start parser')
    parser.start()
  } catch (error) {
    logger.error(error)
    logger.error('This error will be raised and fail the entire app')
    throw error
  }
}
