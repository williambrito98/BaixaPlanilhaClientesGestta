const { appendFileSync } = require('fs')
const { join } = require('path')

module.exports = class Log {
  #pathLog
  #date
  constructor (path) {
    const date = new Date()
    this.#date = {
      now: date,
      getFullDay: date.toLocaleDateString('pt-br').split('/').reverse().join('-'),
      getFullHours: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds()}`
    }
    const logName = `${this.#date.getFullDay}.log`
    this.#pathLog = join(path, logName)
  }

  write (message) {
    appendFileSync(this.#pathLog, `${this.#date.getFullDay} ${this.#date.getFullHours} ${message}\n`, { encoding: 'utf-8' })
    process.stdout.write(`${this.#date.getFullDay} ${this.#date.getFullHours} ${message}\n`)
  }
}
