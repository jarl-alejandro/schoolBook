'use strict'

var bcrypt = require("bcryptjs")
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  name:String,
  email:String,
  password:String,
  ubicacion:String,
  avatar:String,
  type:String,
})

userSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
        return next()
    }

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function(password, done){
    bcrypt.compare(password, this.password, function(err, isMatch){
        done(err, isMatch)
    })
}

var User = mongoose.model("User", userSchema)
module.exports = User
