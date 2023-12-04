const express= require('express')
const router= express.Router()
const msgctrl = require('../controllers/messagecontrol')
const authhelper= require('../helpers/Auth')


router.post('/chat-message/:sender_Id/:receiver_Id',authhelper.Verifytoken, msgctrl.SendMessage)
router.get('/chat-message/:sender_Id/:receiver_Id',authhelper.Verifytoken, msgctrl.GetAllMessages)
router.get('/receiver-messages/:sender/:receiver',authhelper.Verifytoken, msgctrl.MarkReceiverMessages)
router.get('/mark-all-messages',authhelper.Verifytoken, msgctrl.MarkAllMessages)




module.exports= router