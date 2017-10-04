"use strict";
const mongoose = require('mongoose');
const Media = require('./media');
const logger = require('../logger');

let topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    position: { type: Number},
    created: { type: Date, required: true },
    modified: { type: Date, required: true },
    notes: String,
    episode: { type: mongoose.Schema.Types.ObjectId, ref:'Episode' },
    medias: [{ type: mongoose.Schema.Types.ObjectId, ref:'Media' }]
});
topicSchema.index({ position: 1, episode: 1 }, { unique: true });

// when a News is removed, delete all its Incrusts
topicSchema.post('remove', function(topic) {
  Media
    .remove({topic: topic._id})
    .then(function(result) {
      logger.debug("Removed all Medias from Topic " + topic._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

module.exports = mongoose.model('Topic', topicSchema);