"use strict";
const mongoose = require('mongoose');
const Episode = require('./episode');
const logger = require('../logger');

let programSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true},
    logo: { data: Buffer, contentType: String },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }]
});

// when a Emission is removed, delete all its Episodes
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