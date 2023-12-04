const User= require('../models/usermodel')
const HttpStatus= require('http-status-codes')
const cloudinary = require('cloudinary')


cloudinary.config({ 
    cloud_name: 'dq1utqamt', 
    api_key: '884673834196555',
    api_secret: '9gXehqpf2Xdan-ZIittGfKeLzvA' 
  });

module.exports = {


    UploadImage(req,res){
        cloudinary.uploader.upload(req.body.image, async (result)=>{
            await User.updateMany({
                _id: req.user._id,
            },{
                $push:{
                    images:{
                        imgId:result.public_id,
                        imgVersion: result.version
                    }
                }
            }).then(()=>{
                res.status(HttpStatus.StatusCodes.OK).json({ message: 'image uploaded'});
            }).catch(err=>{
                res.status(HttpStatus.StatusCodes.CONFLICT).json({ message: 'image  not uploaded'});
            })
        })
            },
        
            async SetDefaultImage(req,res){
                const {imgId,imgVersion}= req.params
                await User.updateMany({
                    _id: req.user._id,
                },{
                    picId:imgId,
                    picVersion: imgVersion
                }).then(()=>{
                    res.status(HttpStatus.StatusCodes.OK).json({ message: 'default image set'});
                }).catch(err=>{
                    res.status(HttpStatus.StatusCodes.CONFLICT).json({ message: 'image  not set'});
                })
        
            },
        
        
            deleteImage(req,res){
                cloudinary.v2.uploader.destroy(req.params.imgId, (error, result) => {
                    if(error){
                        res.status(HttpStatus.StatusCodes.CONFLICT).json({ message: 'image not deleted'});
                    }
                    else{
                        User.updateMany({
                            _id: req.user._id,
                        },{
                            $pull:{
                                images:{
                                    imgId:req.params.imgId
                                }
                            }
                        }).then(()=>{
                            res.status(HttpStatus.StatusCodes.OK).json({ message: 'image deleted'});
                        }).catch(err=>{
                            res.status(HttpStatus.StatusCodes.CONFLICT).json({ message: 'image not deleted'});
                        })
                    }
                });
            },
        
}