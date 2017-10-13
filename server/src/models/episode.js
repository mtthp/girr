"use strict";
const mongoose = require('mongoose')
const Topic = require('./topic')
const logger = require('../logger')
const websockets = require('../websockets')()

let episodeSchema = new mongoose.Schema({
    number: { type: Number, required: true, index: true },
    name: { type: String },
    date: { type: Date, default: Date.now },
    created: { type: Date, required: true },
    modified: { type: Date, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref:'Program', required: true, index: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref:'Topic' }]
});
episodeSchema.index({ number: 1, program: 1 }, { unique: true })

// when an Episode is removed, delete all its Topics
episodeSchema.post('remove', function(episode) {
  websockets.sockets.emit('episodes.' + episode._id + '.delete', episode)
  Topic
    .remove({episode: episode._id})
    .then(function(result) {
      logger.debug("Removed all Topics from Episode " + episode._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

episodeSchema.pre('save', function(next) {
  this.wasNew = this.isNew
  next()
})

episodeSchema.post('save', function(episode) {
  if (this.wasNew) {
    websockets.sockets.emit('episodes.add', episode)
  }
  websockets.sockets.emit('episodes.' + episode._id, episode)
})

module.exports = mongoose.model('Episode', episodeSchema)