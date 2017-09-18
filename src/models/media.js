const mongoose = require('mongoose');

module.exports = mongoose.model('Media',
  new mongoose.Schema({
    data: Buffer,
    contentType: String,
    topic: { type: mongoose.Schema.Types.ObjectId, ref:'Topic', required: true },
  })
);