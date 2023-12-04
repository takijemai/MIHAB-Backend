const mongoose = require('mongoose')
 const postSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    username: {type: String},
    post: {type: String},
    imgId: {type: String},
    imgVersion: {type: String},
    images : [{
        imgId: {type: String},
    imgVersion: {type: String}, 
    }],
    comments : [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        username: {type: String},
        comment:  {type: String},
        date: {type: Date, default: Date.now()}

    }],
    totalikes: {type: Number},
    likes: [{
        username:{type: String},
    }],
    likesdate:  {type: Date, default: Date.now()},
    favorites:[{
        username:{type: String},  
    }],
    totalfavorites : {type: Number},
    price: {type: String}, 
    city: {type: String}, 
    address: {type: String}, 
    superfice: {type: String}, 
    lat: {type: Number},
    lng: {type: Number},
    reports: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: { type: String, default: "" },
          reason: { type: String, default: "" },
          date: { type: Date, default: Date.now() },
        },
      ],
  })

  module.exports= mongoose.model('Post', postSchema)