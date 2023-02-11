module.exports = {
  getYear: function (date) {
    const newDate = new Date(date)
    if (newDate.toString() === 'Invalid Date') {
      return ''
    }

    return newDate.getFullYear()
  },

  getLongMonth: function (date) {
    const newDate = new Date(date)

    if (newDate.toString() === 'Invalid Date') {
      return ''
    }

    return newDate.toLocaleString('pt-br', {
      month: 'long'
    })
  },

  getDay: function (date, format) {
    const newDate = new Date(date)

    if (newDate.toString() === 'Invalid Date') {
      return ''
    }

    return newDate.getDate()
  },

  getFullDate: function (date) {
    const newDate = new Date(date)

    if (newDate.toString() === 'Invalid Date') {
      return ''
    }

    return newDate.toLocaleDateString('pt-br')
  }
}
