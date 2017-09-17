"use strict";
const mongoose = require('mongoose');
const Episode = require('./episode');
const logger = require('../logger');

let emissionSchema = new mongoose.Schema({
    nom: { type: String, unique: true, required: true},
    logo: { data: Buffer, contentType: String },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }]
});

// when an Episode is removed, delete all its News
emissionSchema.post('remove', function(emission) {
  Episode
    .remove({emission: emission._id})
    .then(function(result) {
      logger.debug("Removed all Episodes from Emission " + emission._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

module.exports = mongoose.model('Emission', emissionSchema);