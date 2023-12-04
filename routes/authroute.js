const express= require('express')
const authctrl = require('../controllers/authcontrol')
const router= express.Router()

router.post('/register', authctrl.CreateUser)
router.post('/login', authctrl.LoginUser)
router.get('/verify', authctrl.verifyuser)
module.exports= router