require('dotenv').config()
require('./setVariables')()
const { readFileSync } = require('fs')
const { join } = require('path')
const { moveSync } = require('fs-extra')
const CONFIG = require('../config.json')
const Email = require('./email')
const login = require('./login')
const { report, handlerData } = require('./report')
const { jsonToXLSX } = require('./utils/excel')
const Log = require('./utils/log');

(async () => {
  const log = new Log(global.pathLog)
  const email = new Email()
  const attachments = []

  try {
    log.write('Script Iniciado')
    log.write('Realizando login no gestta')
    const token = await login()
    log.write('Login no gestta realizada com sucesso')

    log.write('Buscando dados')
    const data = await report(token)
    log.write('Dados capturados com sucesso')

    log.write('Transformando dados em excel')
    const rows = handlerData(data)
    jsonToXLSX(rows, CONFIG.SHEET_REPORT_NAME)
    log.write('Excel gerado com sucesso')

    if (CONFIG.SEND_REPORT_TO_FOLDER_SHARED) {
      log.write(`Movendo arquivo para ${CONFIG.PATH_SAIDA}`)
      moveSync(global.pathExcelFile, process.env.PATH_FILE_MOVE, { overwrite: true })
      log.write('Arquivo movido com sucesso')
    }

    if (CONFIG.SEND_REPORT_FOR_EMAIL) {
      attachments.push({
        content: readFileSync(join(global.pathSaida, CONFIG.FILE_NAME)).toString('base64'),
        filename: CONFIG.FILE_NAME,
        type: CONFIG.CONTENT_TYPE
      })
    }

    if (CONFIG.SEND_EMAIL_ON_GENERATE_REPORT) {
      log.write('Enviando email de sucesso')
      await email.setTemplate('success').send({
        to: CONFIG.EMAIL.TO,
        from: CONFIG.EMAIL.FROM,
        subject: CONFIG.EMAIL.SUBJECT,
        body: {
          send_at: new Date().toLocaleString('pt-br'),
          qtdLinhas: rows.length
        },
        attachments
      })
      log.write('Email enviado com sucesso')
    }
  } catch (error) {
    log.write(`Erro ao executar script ${error}`)

    if (CONFIG.SEND_EMAIL_ON_ERROR_REPORT) {
      log.write('Enviando email de erro')
      await email.setTemplate('error').send({
        to: CONFIG.EMAIL.TO,
        from: CONFIG.EMAIL.FROM,
        subject: CONFIG.EMAIL.SUBJECT,
        body: {
          message: error,
          attempt_at: new Date().toLocaleString('pt-br')
        }
      })
      log.write('Email de erro enviado')
    }
  }
})()
