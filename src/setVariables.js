const { join } = require('path')
const { existsSync, mkdirSync } = require('fs')
const CONFIG = require('../config.json')

module.exports = function setVariables () {
  global.pathSaida = join(process.cwd(), 'download')
  global.pathLog = join(process.cwd(), 'log')

  !existsSync(global.pathSaida) ? mkdirSync(global.pathSaida) : null
  !existsSync(global.pathLog) ? mkdirSync(global.pathLog) : null

  global.pathExcelFile = join(global.pathSaida, CONFIG.FILE_NAME)
}
