const blogRouter = require('express').Router()
const Blog = require('../models/blog_model')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    blogs: 0,
  })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  console.log('POST request received')
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }
  if (!request.body.likes) {
    request.body.likes = 0
  }

  const { title, author, url, likes } = request.body
  const user = request.user
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

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(401)
        .json({ error: 'only the creator can delete this blog' })
    }

    await blog.deleteOne()

    user.blogs = user.blogs.filter(
      blogId => blogId.toString() !== request.params.id
    )
    await user.save()

    response.status(204).end()
    console.log('DELETE done')
  }
)

blogRouter.put('/:id', async (request, response) => {
  const newBlog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  })
  response.status(200).json(updatedBlog)

  console.log('UPDATE done')
})

module.exports = blogRouter
