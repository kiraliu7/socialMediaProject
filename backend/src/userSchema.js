const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  salt: {
    type: String,
    required: [true, 'salt is required']
  },
  hash: {
    type: String,
    required: [true, 'hash is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  },
  oauth: {
    type: Array,
    required: [false, 'oauth is not required']
  }

  
})

module.exports = userSchema;
