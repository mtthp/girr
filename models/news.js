const mongoose = require('mongoose');

module.exports = mongoose.model('News', new mongoose.Schema({
    numero: { type: Number, required: true },
    titre: { type: String },
    notes: String,
    episode: { type: mongoose.Schema.Types.ObjectId, ref:'Episode' },
    incrusts: [
        {
            type: Buffer,
            contentType: String
        }
    ]
}));