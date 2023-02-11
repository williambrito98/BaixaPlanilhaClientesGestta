const { join } = require('path')
const { existsSync, mkdirSync } = require('fs')
const CONFIG = require('../config.json')

module.exports = function setVariables () {
  global.pathSaida = join(__dirname, 'download')

  !existsSync(global.pathSaida) ? mkdirSync(global.pathSaida) : null

  global.pathExcelFile = join(global.pathSaida, CONFIG.FILE_NAME)
}
