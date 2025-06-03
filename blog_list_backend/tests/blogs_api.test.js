const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const Blog = require('../models/blog_model')
const User = require('../models/user_model')
const bcrypt = require('bcrypt')

const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })
  await user.save()
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

const userAuth = async () => {
  const loginUser = await api.post('/api/login').send({
    username: 'root',
    password: 'salasana',
  })
  return loginUser.body.token
}

test('http post', async () => {
  const token = await userAuth()

  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogsAfterPost = await helper.blogsInDB()
  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)
})

test.only('http post fail with no token', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAfterPost = await helper.blogsInDB()
  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
})

test('checking "likes" property', async () => {
  const token = await userAuth()

  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

  const postBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
  const blogId = postBlog.body.id

  const blogFound = await Blog.findById(blogId)
  const afterPostBlog = blogFound.toJSON()

  assert.strictEqual(afterPostBlog.likes, 0)
})

test('checking title or url missing', async () => {
  const token = await userAuth()

  const newBlogNoTitle = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
  const newBlogNoUrl = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogNoTitle)
    .expect(400)
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogNoUrl)
    .expect(400)

  const blogsAfterPost = await helper.blogsInDB()
  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
})



// NO FIX YET
test('http delete', async () => {
  const initialBlogs = await helper.blogsInDB()
  const idToDelete = initialBlogs[0].id

  await api.delete(`/api/blogs/${idToDelete}`).expect(204)

  const finalBlogs = await helper.blogsInDB()
  assert.strictEqual(finalBlogs.length, helper.initialBlogs.length - 1)
})

test('http updating blog', async () => {
  const initialBlogs = await helper.blogsInDB()
  const initialBlogToUpdate = initialBlogs[0]
  const blogUpdated = { ...initialBlogToUpdate, likes: 50 }

  await api
    .put(`/api/blogs/${initialBlogToUpdate.id}`)
    .send(blogUpdated)
    .expect(200)

  const finalBlogs = await helper.blogsInDB()
  const finalBlogUpdated = finalBlogs[0]

  assert.notStrictEqual(initialBlogToUpdate.likes, finalBlogUpdated.likes)
  assert.strictEqual(finalBlogUpdated.likes, 50)
})

after(async () => {
  await mongoose.connection.close()
})
