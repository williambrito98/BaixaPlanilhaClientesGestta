const XLSX = require('xlsx')

module.exports = {
  /**
   *
   * @param {string} data
   * @param {string} sheetName
   */
  jsonToXLSX: function (data, sheetName) {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data, { header: Object.keys(data[0]) })
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    XLSX.writeFileXLSX(wb, global.pathExcelFile)
  }
}
