const User = require('../models/user.js')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Helper {
    static checkPassword(pass, DBpass) {
        return bcryptjs.compareSync(pass, DBpass)
    }
    static generateToken(email) {
        return jwt.sign(email, process.env.JWT_SECRET)
    }
}

module.exports = Helper