const express= require('express')
const router= express.Router()
const postctrl = require('../controllers/postcontrol')
const authhelper= require('../helpers/Auth')

router.get('/posts', authhelper.Verifytoken, postctrl.GetAllPosts)
router.get('/post/:id', authhelper.Verifytoken, postctrl.GetPosts)

router.post('/post/add-post', authhelper.Verifytoken, postctrl.AddPost)
router.post('/post/add-like', authhelper.Verifytoken, postctrl.AddLike)
router.post('/post/add-comments', authhelper.Verifytoken, postctrl.AddComment)
router.post('/post/add-favorite', authhelper.Verifytoken, postctrl.AddFavorite)
router.delete('/post/delete-favorite/:id', authhelper.Verifytoken, postctrl.deleteFavorite)
router.put('/post/edit-post', authhelper.Verifytoken, postctrl.EditPost)
router.delete('/post/delete-post/:id', authhelper.Verifytoken, postctrl.DeletePost)





module.exports= router