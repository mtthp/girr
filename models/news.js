"use strict";
const mongoose = require('mongoose');
const Incrust = require('./incrust');
const logger = require('../logger');

let newsSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    titre: { type: String },
    notes: String,
    episode: { type: mongoose.Schema.Types.ObjectId, ref:'Episode' },
    incrusts: [{ type: mongoose.Schema.Types.ObjectId, ref:'Incrust' }]
});

// when a News is removed, delete all its Incrusts
newsSchema.post('remove', function(news) {
  Incrust
    .remove({news: news._id})
    .then(function(result) {
      logger.debug("Removed all Incrust from News " + news._id)
    })
    .catch(function(error) {
      logger.error(error)
    })
})

module.exports = mongoose.model('News', newsSchema);