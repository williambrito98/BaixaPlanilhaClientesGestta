require('dotenv').config()
const { moveSync } = require('fs-extra')
const CONFIG = require('../config.json')
const Email = require('./email')
const login = require('./login')
const { report, handlerData } = require('./report')
const { jsonToXLSX } = require('./utils/excel')
require('./setVariables')();

(async () => {
  const email = new Email()

  try {
    const token = await login()

    const data = await report(token)

    const rows = handlerData(data)

    jsonToXLSX(rows)

    moveSync(global.pathExcelFile, CONFIG.PATH_SAIDA, { overwrite: true })

    await email.setTemplate('success').send({
      to: CONFIG.EMAIL.TO,
      from: CONFIG.EMAIL.FROM,
      subject: CONFIG.EMAIL.SUBJECT,
      body: {
        send_at: new Date().toLocaleString('pt-br'),
        qtdLinhas: rows.length
      }
    })
  } catch (error) {
    console.log(error)

    await email.setTemplate('error').send({
      to: CONFIG.EMAIL.TO,
      from: CONFIG.EMAIL.FROM,
      subject: CONFIG.EMAIL.SUBJECT,
      body: {
        message: error,
        attempt_at: new Date().toLocaleString('pt-br')
      }
    })
  }
})()
