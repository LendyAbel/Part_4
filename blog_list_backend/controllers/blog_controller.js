const blogRouter = require('express').Router()
const Blog = require('../models/blog_model')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    console.log('POST done')
    response.status(201).json(result)
  })
})

module.exports = blogRouter