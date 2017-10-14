"use strict";
const mongoose = require('mongoose')
const Media = require('./media')
const logger = require('../logger')
const websockets = require('../websockets')()

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
        topic.save()
      })
    })
    .catch(function(error) {
      logger.error(error)
    })

  this.ended = null

  return time_value // hmm, we can also return Date.now() instead ?
}

let topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
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
  websockets.sockets.emit('topics.' + topic._id + '.delete', topic)
  Media
    .remove({topic: topic._id})
    .then(function(result) {
      logger.debug("Removed all Medias from Topic " + topic._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
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