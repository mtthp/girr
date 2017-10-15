"use strict";
const mongoose = require('mongoose')
const fs = require('fs')
const path  = require('path')
const websockets = require('../websockets')()
const cache = require('memory-cache')

/*
 * The purpose of this setter is to end all playing medias
 * because there can be only one to rule them all
 */
function stopPlayingMedias (time_value) {
  this.constructor // get the Model to execute queries
    .find({ ended : null })
    .where('_id').ne(this._id)
    .where('started').ne(null)
    .then(function(results) { // we end all medias that are playing
      results.forEach(function (media) {
        media.ended = Date.now()
        media.save()
      })
    })
    .catch(function(error) {
      logger.error(error)
    })

  this.ended = null

  var xsplit = cache.get('xsplit') !== null ? cache.get('xsplit') : { title: null, picture: null, created: Date.now(), modified: Date.now() }
  xsplit = Object.assign(xsplit, { picture: this.uri, modified: Date.now() })
  cache.put('xsplit', xsplit)
  websockets.sockets.emit('xsplit', xsplit)

  return time_value // hmm, we can also return Date.now() instead ?
}

let mediaSchema = new mongoose.Schema({
  label: { type: String },
  uri: { type: String, required: true},
  mimeType: { type: String, required: true},
  path: { type: String }, // in the case of a local file
  started: { type: Date, set: stopPlayingMedias },
  ended: { type: Date },
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
  websockets.sockets.emit('medias.' + media._id + '.delete', media)
  if (fs.existsSync(path.join(__base, media.path))) {
    fs.unlinkSync(path.join(__base, media.path))
  }
})

mediaSchema.pre('save', function(next) {
  this.wasNew = this.isNew
  next()
})

mediaSchema.post('save', function(media) {
  if (this.wasNew) {
    websockets.sockets.emit('medias.add', media)
  }
  websockets.sockets.emit('medias.' + media._id, media)
})

module.exports = mongoose.model('Media', mediaSchema)