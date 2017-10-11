"use strict";
const mongoose = require('mongoose');
const Episode = require('./episode');
const logger = require('../logger');

let programSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true},
    thumbnail: { type: String },
    created: { type: Date, required: true },
    modified: { type: Date, required: true },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }]
});

// when a Program is removed, delete all its Episodes
programSchema.post('remove', function(program) {
  Episode
    .remove({program: program._id})
    .then(function(result) {
      logger.debug("Removed all Episodes from Program " + program._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

module.exports = mongoose.model('Program', programSchema);