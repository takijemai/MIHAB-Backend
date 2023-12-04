const User= require('../models/usermodel')
const httpstatus= require('http-status-codes')
const Rating= require('../models/ratingmodel')
const bcrypt = require('bcrypt')
const nodemailer= require('nodemailer')
const jwt= require('jsonwebtoken')
const dbConfig= require('../config/secret')
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "mihabappual@gmail.com",
      pass: "swjllaetyisfyahc",
    },
  });
module.exports= {

    async GetAllusers(req,res){
        await User.find({}).populate('posts.postId')
        .populate('chatlist.receiverId').populate('chatlist.messageId').populate('notifications.senderId').then(result=>{
            res.status(httpstatus.StatusCodes.OK).json({ msg: 'users found', result });
        }).catch(err=>{
            res.status(httpstatus.StatusCodes.EXPECTATION_FAILED).json({ msg: 'users not found'});
        })
    },
     async GetuserById(req,res){
        await User.findOne({_id: req.user._id}).populate('posts.postId')
        .populate('chatlist.receiverId').populate('chatlist.messageId').populate('notifications.senderId')
        .then(async (result) =>{
           
            res.status(httpstatus.StatusCodes.OK).json({ msg: 'user by id found', result });
   
        }).catch(err=>{
            res.status(httpstatus.StatusCodes.EXPECTATION_FAILED).json({ msg: 'user not found'});
        })
     },

     async GetUsername(req,res){

      await User.findOne({username: req.params.username}).populate('posts.postId')
      .populate('chatlist.receiverId').populate('chatlist.messageId').populate('notifications.senderId').then((result)=>{
          res.status(httpstatus.StatusCodes.OK).json({ msg: 'username found', result });
      }).catch(err=>{
          res.status(httpstatus.StatusCodes.EXPECTATION_FAILED).json({ msg: 'username not found'});
      })
          },

    async valorateapp(req,res){
        const { liked } = req.body;
        const rating = new Rating({ liked });
        rating.userId = req.user._id;
      
        try {
          await rating.save();
          res.status(httpstatus.StatusCodes.OK).json({ message: 'Rating submitted successfully.' });
        } catch (error) {
          console.error(error);
          res.status(httpstatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to submit rating.' });
        }
    },
     async GetRating(req,res){
        try{
            const ratings = await Rating.find().populate('userId', 'username');
            const totalRatings = ratings.length;
            const liked = ratings.filter(rating => rating.liked === true).length;
            const disliked = totalRatings - liked;
            res.status(httpstatus.StatusCodes.OK).json({message:'raitng list',totalRatings, liked, disliked})
        }
        catch (err) {
            console.error(err);
            res.status(httpstatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'no rating list disponible' });
          }
        
     },

     async ChangePassword(req,res){
        const user = await User.findOne({ _id: req.user._id})

 return bcrypt.compare(req.body.cpassword,user.password).then(async(result)=>{
   
if(!result){
    return res.status(httpstatus.StatusCodes.BAD_REQUEST).json({ msg: 'password dont match' });
}
console.log(req.body.newpassword)
const newpassword = await User.EncryptPassword(req.body.newpassword)

await User.updateMany({_id: req.user._id},{
    
    password: newpassword
}).then((result)=>{
    res.status(httpstatus.StatusCodes.OK).json({ msg: 'pasword change correctly' });
}).catch(err=>{
    res.status(httpstatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'password reset error '});
})
 })
     },
     async RestPassword(req, res) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(httpstatus.StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });
      }
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      user.password = hashedPassword;
      await user.save();
      const mailOptions = {
        from: "mihabappual@gmail.com",
        to: req.body.email,
        subject: "Your new password",
        html: `<p>Dear User ,</p><p>Your new password is: ${newPassword}</p>`,
        //${req.body.username}
      };
      await transporter.sendMail(mailOptions);
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        dbConfig.secret,
        { expiresIn: "1h" }
      );
      const response = {
        message: "Password reset successful",
        newPassword: newPassword,
        token: token,
      };
      return res.status(httpstatus.StatusCodes.OK).json(response);
    },

async Sendcontactus(req,res){
    const { name, email, subject, message } = req.body;

    const mailOptions = {
      from: email,
      to: "mihabappual@gmail.com",
      subject: subject,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res
        .status(httpstatus.StatusCodes.OK)
        .json({ message: "Message sent successfully" });
    } catch (err) {
      console.error(err);
      return res
        .status(httpstatus.StatusCodes.NOT_FOUND)
        .json({ message: "Error sending message" });
    }
},

}