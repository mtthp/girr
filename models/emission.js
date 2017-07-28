const mongoose = require('mongoose');

module.exports = mongoose.model('Emission', new mongoose.Schema({
    nom: String,
    logo: { data: Buffer, contentType: String }
}));