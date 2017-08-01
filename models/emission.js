const mongoose = require('mongoose');

module.exports = mongoose.model('Emission', new mongoose.Schema({
    nom: { type: String, unique: true, required: true},
    logo: { data: Buffer, contentType: String },
}));