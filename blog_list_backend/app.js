const express = require('express')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blog_controller')
const userRouter = require('./controllers/user_controller')
const loginRouter = require('./controllers/login_controller')
const config = require('./utils/config')

const app = express()

mongoose.connect(config.MONGODB_URI).then(res => {
  console.log('Connected to MongoDB')
})

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === "test") {
  const testRouter = require('./controllers/testing_controller')
  app.use('/api/testing', testRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
