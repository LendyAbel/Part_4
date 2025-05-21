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

test('http post', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogsAfterPost = await helper.blogsInDB()
  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)
})

test('checking "likes" property', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    __v: 0,
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogFound = await Blog.findById(newBlog._id)
  const afterPostBlog = blogFound.toJSON()

  assert.strictEqual(afterPostBlog.likes, 0)
})

test('checking title or url missing', async () => {
  const newBlogNoTitle = {
    _id: '5a422bc61b54a676234d17fc',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  }
  const newBlogNoUrl = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2,
    __v: 0,
  }

  await api.post('/api/blogs').send(newBlogNoTitle).expect(400)
  await api.post('/api/blogs').send(newBlogNoUrl).expect(400)

  const blogsAfterPost = await helper.blogsInDB()
  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
})

test.only('http delete', async () => {
  const initialBlogs = await helper.blogsInDB()
  const idToDelete = initialBlogs[0].id

  await api.delete(`/api/blogs/${idToDelete}`).expect(204)

  const finalBlogs = await helper.blogsInDB()
  assert.strictEqual(finalBlogs.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
