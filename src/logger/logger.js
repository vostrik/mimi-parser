const log4js = require('log4js')

log4js.configure({
  appenders: { parser: { type: 'file', filename: 'logs/mimi-parser.log' } },
  categories: { default: { appenders: ['parser'], level: 'info' } }
})
const logger = log4js.getLogger('parser')

module.exports = {
  logger
}
