const jwt= require('jsonwebtoken')
const httpstatus= require('http-status-codes')
const dbConfig= require('../config/secret')

module.exports= {


    async Verifytoken(req,res, next){
        const token = req.headers.authorization  ;
    //console.log(token)
    if(!token){
     return res
     .status(httpstatus.StatusCodes.FORBIDDEN)
     .json({ message: 'No token provided' });
    }
     try {
       const data=jwt.verify(token, dbConfig.secret)
       //console.log(data)
      req.user= data,
      username= data.username,
      _id= data._id
      next()
     }catch(err){
       res.status(httpstatus.StatusCodes.INTERNAL_SERVER_ERROR) .json({ message: 'No token authenticated' });
    
     }
    }
}