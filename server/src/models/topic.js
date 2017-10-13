"use strict";
const mongoose = require('mongoose')
const Media = require('./media')
const logger = require('../logger')
const websockets = require('../websockets')()

let topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    position: { type: Number },
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