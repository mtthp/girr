"use strict";
const mongoose = require('mongoose');
const Topic = require('./topic');
const logger = require('../logger');

let episodeSchema = new mongoose.Schema({
    position: { type: Number, required: true, index: true },
    name: { type: String },
    date: { type: Date, default: Date.now },
    created: { type: Date, required: true },
    modified: { type: Date, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref:'Program', required: true, index: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref:'Topic' }]
});
episodeSchema.index({ position: 1, program: 1 }, { unique: true });

// when an Episode is removed, delete all its Topics
episodeSchema.post('remove', function(episode) {
  Topic
    .remove({episode: episode._id})
    .then(function(result) {
      logger.debug("Removed all Topics from Episode " + episode._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

module.exports = mongoose.model('Episode', episodeSchema);