const express= require('express')
const router= express.Router()
const imagectrl = require('../controllers/imagecontrol')
const authhelper= require('../helpers/Auth')

router.post('/upload-image', authhelper.Verifytoken, imagectrl.UploadImage)

router.get('/set-default-image/:imgId/:imgVersion', authhelper.Verifytoken, imagectrl.SetDefaultImage)

router.delete('/delete-image/:imgId', authhelper.Verifytoken, imagectrl.deleteImage)

module.exports= router