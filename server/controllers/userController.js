const User = require('../models/user.js')
const Helper = require('../helpers/helper')

class UserController {
    static create(req, res) {
        User
            .create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    err: err.message
                })
            })
    }

    static login(req, res) {
        User
            .findOne({
                email : req.body.email
            })
            .then(user => {
                const valid = Helper.checkPassword(req.body.password, user.password)
                if (valid) {
                    const token = Helper.generateToken(user.email)
                    res.status(200).json({token})
                } else {
                    res.status(400).json({
                        msg : 'Invalid username or password'
                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
      }
}

module.exports = UserController