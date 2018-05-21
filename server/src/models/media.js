"use strict";
const mongoose = require('mongoose')
const logger = require('../logger')
const fs = require('fs')
const path  = require('path')
const websockets = require('../websockets')()

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

  return time_value // hmm, we can also return Date.now() instead ?
}

/**
 * @swagger
 * definitions:
 *   Media:
 *     properties:
 *       label:
 *         type: string
 *         description: Media's label
 *       uri:
 *         type: string
 *         description: Path to the media file
 *         required: true
 *       mimeType:
 *         type: string
 *         description: mime type of the file
 *       position:
 *         type: integer
 *         format: int32
 *         minimum: 1
 *         description: current position inside the parent's list
 *       started:
 *         type: date
 *         description: time and date when the Media has started
 *       ended:
 *         type: date
 *         description: time and date when the Media has ended
 */
let mediaSchema = new mongoose.Schema({
  label: { type: String },
  uri: { type: String, required: true},
  mimeType: { type: String, required: true},
  path: { type: String }, // in the case of a local file
  position: { type: Number },
  started: { type: Date },
  ended: { type: Date },
  created: { type: Date, required: true },
  modified: { type: Date, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref:'Topic', required: true },
})

let mediaModel = mongoose.model('Media', mediaSchema)

mediaSchema.methods.toJSON = function() {
 var obj = this.toObject()
 delete obj.path // remove/hide the local path
 return obj
}

// when a Media is removed, delete its file
mediaSchema.post('remove', function(media) {
  logger.debug("Removed Media " + media._id)
  websockets.sockets.emit('medias.' + media._id + '.delete', media)

  if (fs.existsSync(path.join(__base, media.path))) {
    fs.unlinkSync(path.join(__base, media.path))
  }
})

mediaSchema.pre('save', function(next) {
  this.wasNew = this.isNew

  // stop all others medias if this one starts playing
  if (this.isModified('started') && this.started && !this.ended) {
    mediaModel
      .find({ ended : null })
      .where('_id').ne(this._id)
      .where('started').ne(null)
      .then(function(results) {
        results.forEach(function (media) {
          media.ended = Date.now()
          media.save()
        })
        next()
      })
      .catch(function(error) {
        logger.error(error)
      })
  } else {
    next()
  }
})

mediaSchema.post('save', function(media) {
  if (this.wasNew) {
    websockets.sockets.emit('medias.add', media)
  }
  websockets.sockets.emit('medias.' + media._id, media)
})

module.exports = mediaModel