'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bitacoraSchema = new Schema({
  nameClass:String,
  description:String,
  dateStart:{ type:String },
  publish:Boolean,
  dateEnd:{ type:String },
  teacher:{ type:Schema.ObjectId, ref:"Teacher" },
  course:{ type:Schema.ObjectId, ref:"Course" },
  school:{ type:Schema.ObjectId, ref:"User" },
  subject:{ type:Schema.ObjectId, ref:"Subject" },
})

var Bitacora = mongoose.model("Bitacora", bitacoraSchema)
module.exports = Bitacora
