const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required']
  },
  displayname: {
    type: String,
    required: [true, 'displayname is required']
  },
  headline: {
    type: String,
    required: [true, 'headline is required']
  },
  email: {
    type: String,
    required: [true, 'email is required']
  },
  zipcode: {
    type: String,
    required: [true, 'zipcode is required']
  },
  dob: {
    type: Date,
    required: [true, 'dob is required']
  },
  avatar:{
    type: String,
    required: [true, 'avatar is required']
  },
  phone:{
    type: String,
    required: [true, 'phone is required']
  }

  
})

module.exports = profileSchema;
