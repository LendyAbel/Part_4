const blogRouter = require('express').Router()
const Blog = require('../models/blog_model')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  console.log('***POST CONTROLLER***')
  console.log('REQUEST:BODY:', request.body)

  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  console.log('***POST done***')
  response.status(201).json(savedBlog)
})

module.exports = blogRouter
