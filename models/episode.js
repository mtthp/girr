const mongoose = require('mongoose');

let episodeSchema = new mongoose.Schema({
    numero: { type: Number, required: true, index: true },
    nom: { type: String },
    date: { type: Date, default: Date.now },
    emission: { type: mongoose.Schema.Types.ObjectId, ref:'Emission', required: true, index: true }
});
episodeSchema.index({ numero: 1, emission: 1 }, { unique: true });
module.exports = mongoose.model('Episode', episodeSchema);