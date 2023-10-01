const CONFIG = require('../../config.json')
const Log = require('../utils/log')
const Email = require('../email')
const express = require('express')
const routes = express.Router()

const Authentication = require('../middleware/Authentication')
const authentication = new Authentication()

const ReportController = require('../controller/Relatorio')
const reportController = new ReportController(new Log(global.pathLog), new Email(), CONFIG)

routes.get('/relatorio', authentication.authByToken, reportController.getData.bind(reportController))

module.exports = routes
