const XLSX = require('xlsx')

module.exports = {
  jsonToXLSX: function (data) {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data, { header: Object.keys(data[0]) })
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    XLSX.writeFileXLSX(wb, global.pathExcelFile)
  }
}
