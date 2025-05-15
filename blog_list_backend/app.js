const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const blogRouter = require('./controllers/blog_controller')

const app = express()

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl).then(res => {
  console.log('Connected to MongoDB')
})

app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app