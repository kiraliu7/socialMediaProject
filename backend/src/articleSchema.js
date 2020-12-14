const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'author is required']
  },
  text: {
    type: String,
    required: [true, 'text is required']
  },
  pid: {
    type: Number,
    required: [true, 'pid is required']
  },
  date: {
    type: Date,
    required: [true, 'Created date is required']
  },
  comments:{
    type: Array,
    required: [true, 'comments is required']
  },

  title:{
    type: String,
    required: [true, 'title is required']
  },

  img:{
    type: String,
    required: [false, 'img is not required']
  }

  
})

module.exports = articleSchema;

