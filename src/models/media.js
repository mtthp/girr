const mongoose = require('mongoose');

module.exports = mongoose.model('Media',
  new mongoose.Schema({
    created: { type: Date, required: true },
    modified: { type: Date, required: true },
    data: Buffer,
    contentType: String,
    topic: { type: mongoose.Schema.Types.ObjectId, ref:'Topic', required: true },
  })
);