const User = require('../models/usermodel')
module.exports = {
    updateChatList: async (req,message) =>{
await User.updateOne({
  _id: req.user._id
},{
  $pull:{
    chatlist:{
      receiverId : req.params.receiver_Id
    }
  }
})
await User.updateOne({
  _id: req.params.receiver_Id
},{
  $pull:{
    chatlist:{
      receiverId: req.user._id
    }
  }
})
await User.updateOne({
  _id: req.user._id
},{
  $push:{
    chatlist: {
          $each: [{
            receiverId: req.params.receiver_Id,
            messageId: message._id
          }],
          $position: 0
      }
  }
})
await User.updateOne({
  _id: req.params.receiver_Id
},{
  $push:{
    chatlist: {
          $each: [{
            receiverId: req.user._id,
            messageId: message._id
          }],
          $position: 0
      }
  }
})
    }
}