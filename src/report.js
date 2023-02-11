const request = require('./utils/request')
const CONFIG = require('../config.json')

/**
 * @param {string} token
 * @returns {array}
 */
module.exports = async function report (token) {
  const url = new URL('/core/customer/task/report', CONFIG.API_URL_GESTTA)

  if (!url?.href) {
    return false
  }

  const date = new Date()

  const startDate = new Date(date.getFullYear(), (date.getMonth()), 1).toJSON().slice(0, 10) + 'T00:00:00-03:00'
  const endDate = new Date(date.getFullYear(), (date.getMonth() + 1), 0).toJSON().slice(0, 10) + 'T23:59:59-03:00'

  const data = {
    type: 'CUSTOMER_TASK',
    filter: 'CURRENT_MONTH',
    dates: {
      endDate,
      startDate
    }
  }

  const headers = {
    authorization: token
  }

  const response = await request('POST', url.href, data, headers)

  if (response.status !== 200 && response.status !== 204) {
    return false
  }

  return response.data
}
