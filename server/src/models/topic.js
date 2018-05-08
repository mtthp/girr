"use strict";
const mongoose = require('mongoose')
const Media = require('./media')
const logger = require('../logger')
const websockets = require('../websockets')()
const cache = require('memory-cache')
const XSplit = require('./xsplit')

/*
 * The purpose of this setter is to end all playing topics
 * because there can be only one to rule them all
 */
function stopPlayingTopics (time_value) {
  this.constructor // get the Model to execute queries
    .find({ ended : null })
    .where('_id').ne(this._id)
    .where('started').ne(null)
    .populate('medias')
    .then(function(results) { // we end all topics that are playing
      results.forEach(function (topic) {
        topic.ended = Date.now()
        topic.medias.forEach(function (media) {
          media.ended = Date.now()
          media.save()
        })
        topic.save()
      })
    })
    .catch(function(error) {
      logger.error(error)
    })

  this.ended = null

  return time_value // hmm, we can also return Date.now() instead ?
}

/**
 * Change the XSplit title accordingly if the Topic is currently playing
 */
function setTitle (newTitle) {
  if (this.started && !this.ended) {
    let xsplit = new XSplit()
    if (xsplit.title == this.title) {
      xsplit.title = newTitle
      xsplit.save()
    }
  }

  return newTitle
}

/**
 * @swagger
 * definitions:
 *   Topic:
 *     properties:
 *       title:
 *         type: string
 *         description: Topic's title
 *       description:
 *         type: string
 *         description: Some notes that should be useful
 *       position:
 *         type: integer
 *         format: int32
 *         minimum: 1
 *         description: current position inside the parent's list
 *         required: true
 *       started:
 *         type: date
 *         description: time and date when the Topic has started
 *       ended:
 *         type: date
 *         description: time and date when the Topic has ended
 */
let topicSchema = new mongoose.Schema({
    title: { type: String, set: setTitle, required: true },
    description: String,
    position: { type: Number },
    started: { type: Date, set: stopPlayingTopics },
    ended: { type: Date },
    created: { type: Date, required: true },
    modified: { type: Date, required: true },
    episode: { type: mongoose.Schema.Types.ObjectId, ref:'Episode' },
    medias: [{ type: mongoose.Schema.Types.ObjectId, ref:'Media' }]
})

// when a Topic is removed, delete all its Medias
topicSchema.post('remove', function(topic) {
  logger.debug("Removed Topic " + topic._id)
  websockets.sockets.emit('topics.' + topic._id + '.delete', topic)

  Media
    .find({ topic: topic._id })
    .then(function(medias) {
      medias.forEach(function (media) {
        media.remove()
      })
    })
    .catch(function(error) {
        next(error)
    });
})

topicSchema.pre('save', function(next) {
  this.wasNew = this.isNew
  next()
})

topicSchema.post('save', function(topic) {
  if (this.wasNew) {
    websockets.sockets.emit('topics.add', topic)
  }
  websockets.sockets.emit('topics.' + topic._id, topic)
})

module.exports = mongoose.model('Topic', topicSchema)