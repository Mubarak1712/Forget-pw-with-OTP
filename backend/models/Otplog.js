const mongoose = require('mongoose');

const OtpLogSchema = new mongoose.Schema({
  email: String,
  requestedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OtpLog', OtpLogSchema);
