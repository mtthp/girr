const mongoose = require('mongoose');

module.exports = mongoose.model('Incrust', new mongoose.Schema({
    news: { type: mongoose.Schema.Types.ObjectId, ref:'News' },
    data: Buffer,
    contentType: String
}));