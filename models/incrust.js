const mongoose = require('mongoose');

module.exports = mongoose.model('Incrust',
  new mongoose.Schema({
    data: Buffer,
    contentType: String,
    news: { type: mongoose.Schema.Types.ObjectId, ref:'News', required: true },
  })
);