const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const Blog = require('../models/blog_model')

const app = require('../app')
const { forEach } = require('lodash')
const { log } = require('node:console')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('Correct blog amount in JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('"id" instead "_id"', async () => {
  const blogs = await helper.blogsInDB()
  blogs.forEach(blog => {
    assert(blog.id)
  })
})

after(async () => {
  await mongoose.connection.close()
})
