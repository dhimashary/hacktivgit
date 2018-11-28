const mongoose = require('mongoose')
const Schema = mongoose.Schema()
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      minLength: 5,
      maxLength: 12,
      required: true
    },
    email: {
      type: String,
      minLength: 7,
      maxLength: 20,
      required: true,
      validate: [{
        isAsync: true,
        validator: function(value, cb) {
          User
            .findOne({
              email: value
            }, function(err, doc) {
              cb(!doc)
            })
        },
        message: 'Email already used'
      }]
    },
    password: {
      type: String,
      minLength: 6,
      maxLength: 20,
      required: true
    },
    isGoogle: {
      type: Boolean
    }
  })
  
  userSchema.pre('save',function(next){
      this.password = bcrypt.hashSync(this.password, 10)
      next()
  })


const User = mongoose.model('User', userSchema)
module.exports = User

  