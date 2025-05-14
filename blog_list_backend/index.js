const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const Blog = require('./models/blog_model')

const app = express()

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl).then(res => {
  console.log('Connected to MongoDB')
})

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    console.log('POST done')
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
