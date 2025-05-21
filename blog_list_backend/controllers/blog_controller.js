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

  if (!request.body.title || !request.body.url) {
    response.status(400).end()
  } else {
    const newBlog = new Blog(request.body)

    const savedBlog = await newBlog.save()
    console.log('POST done')
    response.status(201).json(savedBlog)
  }
})

blogRouter.delete('/:id', async (request, response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  console.log('DELETE done')
})

module.exports = blogRouter
