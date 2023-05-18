const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  house: String,
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
