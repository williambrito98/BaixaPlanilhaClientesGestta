const sendGridEmail = require('@sendgrid/mail')
const { readFileSync } = require('fs')
const { join } = require('path')
module.exports = class Email {
  #template
  #pathTemplate
  constructor () {
    this.#pathTemplate = join(__dirname, 'templates')
  }

  /**
   *
   * @param {{from: string, to: string,subject : string, body: string}} data
   */
  async send (data) {
    sendGridEmail.setApiKey(process.env.API_KEY_EMAIL)
    await sendGridEmail.send({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: this.#handlerTemplate(data.body)
    })
  }

  /**
   *
   * @param {'success' | 'error'} name
   */
  setTemplate (name) {
    this.#template = join(this.#pathTemplate, `${name}.html`)
    return this
  }

  /**
   *
   * @param {*} data
   */
  #handlerTemplate (data) {
    let body = readFileSync(this.#template).toString()
    for (const [key, value] of Object.entries(data)) {
      body = body.replace(`{${key}}`, value)
    }

    return body
  }
}
