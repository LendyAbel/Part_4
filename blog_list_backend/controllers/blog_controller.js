const blogRouter = require('express').Router()
const Blog = require('../models/blog_model')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.likes) {
    request.body.likes = 0
  }

  const newBlog = new Blog(request.body)

  const savedBlog = await newBlog.save()
  console.log('POST done')
  response.status(201).json(savedBlog)
})

module.exports = blogRouter
