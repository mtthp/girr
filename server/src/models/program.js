"use strict";
const mongoose = require('mongoose')
const Episode = require('./episode')
const logger = require('../logger')
const path = require('path')
const fs = require('fs')
const websockets = require('../websockets')()

let programSchema = new mongoose.Schema({
    name: { type: String, required: true},
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
  if (fs.existsSync(path.join(__base, program.thumbnail))) {
    fs.unlinkSync(path.join(__base, program.thumbnail))
  }
})

programSchema.post('save', function(program) {
  websockets.sockets.emit('programs.' + program._id, program)
})

module.exports = mongoose.model('Program', programSchema)