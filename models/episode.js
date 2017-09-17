"use strict";
const mongoose = require('mongoose');
const News = require('./news');
const logger = require('../logger');

let episodeSchema = new mongoose.Schema({
    numero: { type: Number, required: true, index: true },
    nom: { type: String },
    date: { type: Date, default: Date.now },
    emission: { type: mongoose.Schema.Types.ObjectId, ref:'Emission', required: true, index: true },
    news: [{ type: mongoose.Schema.Types.ObjectId, ref:'News' }]
});
episodeSchema.index({ numero: 1, emission: 1 }, { unique: true });

// when an Episode is removed, delete all its News
episodeSchema.post('remove', function(episode) {
  News
    .remove({episode: episode._id})
    .then(function(result) {
      logger.debug("Removed all News from Episode " + episode._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

module.exports = mongoose.model('Episode', episodeSchema);