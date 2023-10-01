require('dotenv').config()
require('./setVariables')()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000')
})
