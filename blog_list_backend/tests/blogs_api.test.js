const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const Blog = require('../models/blog_model')

const app = require('../app')

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

test('"id" instead "_id"', async () => {
  const blogs = await helper.blogsInDB()
  blogs.forEach(blog => {
    assert(blog.id)
  })
})

test.only('http post', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDB()
  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)
})

after(async () => {
  await mongoose.connection.close()
})
