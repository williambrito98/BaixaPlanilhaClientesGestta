class Authentication {
  /**
    * @param req { import("express").Request }
    * @param res { import("express").Response }
    * @param next { import("express").NextFunction }
  */
  async authByToken (req, res, next) {
    const token = req.headers.authorization
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).end()
    }
    next()
  }
}

module.exports = Authentication
