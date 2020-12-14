const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required']
  },
  followlist: {
    type: Array,
    required: [true, 'followlist is required']
  },
  
})

module.exports = followingSchema;
