"use strict";
const mongoose = require('mongoose')
const fs = require('fs')
const path  = require('path')
const websockets = require('../websockets')()

let mediaSchema = new mongoose.Schema({
  label: { type: String },
  uri: { type: String, required: true},
  mimeType: { type: String, required: true},
  path: { type: String }, // in the case of a local file
  created: { type: Date, required: true },
  modified: { type: Date, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref:'Topic', required: true },
})

mediaSchema.methods.toJSON = function() {
 var obj = this.toObject()
 delete obj.path // remove/hide the local path
 return obj
}

// when a Media is removed, delete its file
mediaSchema.post('remove', function(media) {
  if (fs.existsSync(path.join(__base, media.path))) {
    fs.unlinkSync(path.join(__base, media.path))
  }
})

mediaSchema.post('save', function(media) {
  websockets.sockets.emit('medias.' + media._id, media)
})

module.exports = mongoose.model('Media', mediaSchema)