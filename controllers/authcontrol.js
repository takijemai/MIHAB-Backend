const User = require('../models/usermodel')
const HttpStatus = require("http-status-codes");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dbConfig = require('../config/secret')
const nodemailer = require('nodemailer')
 
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "mihabappual@gmail.com",
      pass: "swjllaetyisfyahc",
    },
  });
module.exports= {

    async  CreateUser(req, res) {
        try {
          const userEmail = await User.findOne({ email: req.body.email });
          if (userEmail) {
            return res
              .status(HttpStatus.StatusCodes.UNAUTHORIZED)
              .json({ message: 'Email Exist' });
          }
      
          const userName = await User.findOne({ username: req.body.username });
          if (userName) {
            return res
              .status(HttpStatus.StatusCodes.UNAUTHORIZED)
              .json({ message: 'Username Exist' });
          }
      
          bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) {
              return res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'hash error' });
            }
      
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const newuser = {
              username: req.body.username,
              email: req.body.email,
              password: hash,
              isVerified: false,
              verificationCode: verificationCode,
              country: req.body.country,
              role: req.body.role,
            };
      
            const verificationLink = `http://localhost:3000/api/newapp/verify?email=${req.body.email}&code=${verificationCode}`;
            const mailOptions = {
              from: 'mihabappual@gmail.com',
              to: req.body.email,
              subject: 'Please verify your email address',
              html: `<p>Dear ${req.body.username},</p><p>Please click on the following link to verify your email address:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>Thanks,</p><p>Your App Team</p>`,
            };
      
            transporter.sendMail(mailOptions, async (err, info) => {
              if (err) {
                return res
                  .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({
                    message: 'Failed to send verification email',
                    error: err.message,
                  });
              } else {
                console.log('Verification email sent: ' + info.response);
      
                try {
                  const user = await User.create(newuser);
                  const token = jwt.sign(
                    { _id: user._id, username: user.username },
                    dbConfig.secret,
                    { expiresIn: '3h' }
                  );
      
                  res.cookie('auth', token);
                  res
                    .status(HttpStatus.StatusCodes.CREATED)
                    .header('auth-token', token)
                    .json({ message: 'user created successful', user, token });
                } catch (err) {
                  res
                    .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'user not created' });
                }
              }
            });
          });
        } catch (err) {
          console.log(err);
          res
            .status(HttpStatus.StatusCodes.BAD_REQUEST)
            .json({ message: 'create user error' });
        }
      },

      async verifyuser(req, res) {
        const verificationCode = req.query.code;
    
        try {
            const user = await User.findOne({ email: req.query.email });
    
            if (!user) {
                return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'User not found' });
            }
    
            if (user.verificationCode !== verificationCode) {
                return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Verification code is invalid' });
            }
    
            user.isVerified = true;
    
            await user.save();
    
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'Your email has been verified, you can now login.' });
        } catch (err) {
            console.log(err);
            res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Error occurred during verification' });
        }
    }
    ,
      async LoginUser(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'User email and password are required' });
        }
    
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'User does not exist' });
            }
    
            if (!user.isVerified) {
                return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Your email is not verified' });
            }
    
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    
            if (!passwordMatch) {
                return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Incorrect password' });
            }
    
            const token = jwt.sign({ _id: user._id, username: user.username }, dbConfig.secret, { expiresIn: '3h' });
           res.cookie('auth', token)
            return res.status(HttpStatus.StatusCodes.OK).header('auth', token).json({ message: 'Login successful', user, token });
        } catch (err) {
            console.error(err);
            return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred when logging in' });
        }
    },
    
    

}