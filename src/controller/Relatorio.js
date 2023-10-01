const request = require('../utils/request')
const { readFileSync } = require('fs')
const { join } = require('path')
const { moveSync } = require('fs-extra')
const { report, handlerData } = require('../model/Report')
const { jsonToXLSX } = require('../utils/excel')

/**
 * @class Relatorio
 * @description Classe responsável por gerar o relatório de horas do gestta
 */
class Relatorio {
  #log = null
  #email = null
  #config = null

  constructor (log, email, config) {
    this.#log = log
    this.#email = email
    this.#config = config
  }

  /**
   * @method getData
   * @description Método responsável por gerar o relatório de horas do gestta
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async getData (req, res) {
    const attachments = []

    try {
      this.#log.write('Script Iniciado')
      this.#log.write('Realizando login no gestta')
      const token = await this.#login()
      this.#log.write('Login no gestta realizada com sucesso')

      this.#log.write('Buscando dados')
      const data = await report(token)
      this.#log.write('Dados capturados com sucesso')

      this.#log.write('Transformando dados em excel')
      const rows = handlerData(data)
      jsonToXLSX(rows, this.#config.SHEET_REPORT_NAME)
      this.#log.write('Excel gerado com sucesso')

      if (this.#config.SEND_REPORT_TO_FOLDER_SHARED) {
        this.#log.write(`Movendo arquivo para ${this.#config.PATH_SAIDA}`)
        moveSync(global.pathExcelFile, process.env.PATH_FILE_MOVE, { overwrite: true })
        this.#log.write('Arquivo movido com sucesso')
      }

      if (this.#config.SEND_REPORT_FOR_EMAIL) {
        attachments.push({
          content: readFileSync(join(global.pathSaida, this.#config.FILE_NAME)).toString('base64'),
          filename: this.#config.FILE_NAME,
          type: this.#config.CONTENT_TYPE
        })
      }

      if (this.#config.SEND_EMAIL_ON_GENERATE_REPORT) {
        this.#log.write('Enviando email de sucesso')
        await this.#email.setTemplate('success').send({
          to: this.#config.EMAIL.TO,
          from: this.#config.EMAIL.FROM,
          subject: this.#config.EMAIL.SUBJECT,
          body: {
            send_at: new Date().toLocaleString('pt-br'),
            qtdLinhas: rows.length
          },
          attachments
        })
        this.#log.write('Email enviado com sucesso')
      }

      return res.status(200).send(rows).end()
    } catch (error) {
      this.#log.write(`Erro ao executar script ${error}`)

      if (this.#config.SEND_EMAIL_ON_ERROR_REPORT) {
        this.#log.write('Enviando email de erro')
        await this.#email.setTemplate('error').send({
          to: this.#config.EMAIL.TO,
          from: this.#config.EMAIL.FROM,
          subject: this.#config.EMAIL.SUBJECT,
          body: {
            message: error,
            attempt_at: new Date().toLocaleString('pt-br')
          }
        })
        this.#log.write('Email de erro enviado')
      }

      return res.status(500).send({ error }).end()
    }
  }

  async #login () {
    const data = {
      email: process.env.EMAIL_LOGIN_GESTTA,
      password: process.env.PASSWORD_LOGIN_GESTTA
    }
    const url = new URL('core/login', this.#config.API_URL_GESTTA)
    if (!url?.href) {
      this.#log.write(`Erro ao montar url de login: ${url}`)
      return false
    }
    const response = await request('POST', url.href, data)

    if (response.status !== 200 && response.status !== 204) {
      this.#log.write(`Erro no login: ${response.data}`)
      return false
    }

    return response.headers?.authorization
  }
}

module.exports = Relatorio
