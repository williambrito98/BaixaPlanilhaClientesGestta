const request = require('./utils/request')
const CONFIG = require('../config.json')

module.exports = async function () {
  const data = {
    email: process.env.EMAIL_LOGIN_GESTTA,
    password: process.env.PASSWORD_LOGIN_GESTTA
  }
  const url = new URL('core/login', CONFIG.API_URL_GESTTA)
  if (!url?.href) {
    console.log(`Erro ao montar url de login: ${url}`)
    return false
  }
  const response = await request('POST', url.href, data)

  if (response.status !== 200 && response.status !== 204) {
    console.log(`Erro no login: ${response.data}`)
    return false
  }

  return response.headers?.authorization
}
