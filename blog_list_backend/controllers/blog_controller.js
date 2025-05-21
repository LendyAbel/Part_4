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

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  console.log('DELETE done')
})

blogRouter.put('/:id', async (request, response) => {
  const newBlog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  })
  response.status(200).json(updatedBlog)

  console.log('UPDATE done')
})

module.exports = blogRouter
