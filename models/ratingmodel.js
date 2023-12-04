const mongoose= require('mongoose')
const ratingSchema= mongoose.Schema({
    liked: {type: Boolean},
    userId : {type: mongoose.Schema.Types.ObjectId, ref:'User'}
})

module.exports= mongoose.model('Rating', ratingSchema)