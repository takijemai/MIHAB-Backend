const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { string } = require('joi')

const userSchema = mongoose.Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    phoneNumber :{type: String},
    isVerified: {type: Boolean},
    verificationCode:{type: String},
    posts: [{
        postId: {type: mongoose.Schema.Types.ObjectId, ref:'Post'},
        post: {type: String},
        price: {type: String},
        city: {type: String},
        country: {type: String},
        address: {type: String},
        superfice: {type: Number},
        date: {type: Date, default: Date.now()}
    }],
     notifications : [{
        senderId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        message: {type: String},
        date: {type: Date, default: Date.now()},
        read: {type: Boolean, default:false},
        Date:  {type: Boolean, },
     }],

     chatlist : [{
        receiverId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        messageId : {type: mongoose.Schema.Types.ObjectId, ref:'Message'}
     }],
     picId: {type: String},
     picVersion :{type: String},
     images : [{
        imgId: {type: String},
        imgVersion :{type: String},
     }],
     city :  {type: String},
     country:  {type: String},
    
})

userSchema.statics.EncryptPassword = async function(password){
   const hash = bcrypt.hash(password,10)
   return hash
}

module.exports= mongoose.model('User', userSchema)