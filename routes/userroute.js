const express= require('express')
const router= express.Router()
const userctrl = require('../controllers/usercontrol')
const authhelper= require('../helpers/Auth')

 router.get('/users', authhelper.Verifytoken, userctrl.GetAllusers)

 router.get('/user/:id', authhelper.Verifytoken, userctrl.GetuserById)
 router.get('/users/:username', authhelper.Verifytoken, userctrl.GetUsername)
 router.post('/change-password', authhelper.Verifytoken, userctrl.ChangePassword)
 router.post('/reset-password', userctrl.RestPassword)
 router.post('/valorate', authhelper.Verifytoken, userctrl.valorateapp)
 router.get('/rating', authhelper.Verifytoken, userctrl.GetRating)
 router.post('/contactus', authhelper.Verifytoken, userctrl.Sendcontactus)


 module.exports= router















module.exports= router