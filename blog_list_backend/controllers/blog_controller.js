const blogRouter = require('express').Router()
const Blog = require('../models/blog_model')
const User = require('../models/user_model')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    blogs: 0,
  })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }
  if (!request.body.likes) {
    request.body.likes = 0
  }

  const { title, author, url, likes, userId } = request.body
  const user = await User.findById(userId)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const newBlog = new Blog({ title, author, url, likes, user: user.id })

  const savedBlog = await newBlog.save()
  console.log('POST done')
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
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
