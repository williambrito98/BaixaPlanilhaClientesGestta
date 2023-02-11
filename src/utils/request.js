const axios = require('axios').default

/**
 *
 * @param {string} method
 * @param {string} url
 * @param {*} data
 * @param {*} headers
 */
module.exports = async function request (method, url, data, headers) {
  return await axios.request({
    url,
    method,
    data,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, text/plain, */*',
      origin: 'https://app.gestta.com.br',
      referer: 'https://app.gestta.com.br/',
      ...headers
    }
  }).catch(error => ({
    status: error.response?.statusCode ?? error.toJSON()?.status,
    data: error.response?.data ?? error.toJSON()?.code,
    config: error.toJSON()?.config
  })

  )
}
