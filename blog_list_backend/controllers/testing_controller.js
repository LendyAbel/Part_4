const router = require('express').Router()
const Blogs = require('../models/blog_model')
const User = require('../models/user_model')

router.post('/reset', async (request, response)=>{
    await Blogs.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router