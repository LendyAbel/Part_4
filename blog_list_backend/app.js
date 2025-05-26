const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blog_controller')
const userRouter = require('./controllers/user_controller')
const loginRouter = require('./controllers/login_controller')

const app = express()

const mongoUrl =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

mongoose.connect(mongoUrl).then(res => {
  console.log('Connected to MongoDB')
})

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
