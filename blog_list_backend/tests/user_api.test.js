const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const User = require('../models/user_model')
const bcrypt = require('bcrypt')

const app = require('../app')

const api = supertest(app)

describe('User API tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })
    await user.save()
  })

  test('User creation with valid data', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const finalUsers = await helper.usersInDb()
    assert.strictEqual(finalUsers.length, initialUsers.length + 1)

    const usernames = finalUsers.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('User creation with short username fail', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      username: 'us',
      name: 'Test User',
      password: 'password123',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('must be at least 3 characters long'))

    const finalUsers = await helper.usersInDb()
    assert.strictEqual(finalUsers.length, initialUsers.length)
  })

  test('User creation with short password fail', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'pa',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('must be at least 3 characters long'))

    const finalUsers = await helper.usersInDb()
    assert.strictEqual(finalUsers.length, initialUsers.length)
  })

  test('User creation with duplicate username fail', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Test User',
      password: 'pasword123',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('expected `username` to be unique'))
    const finalUsers = await helper.usersInDb()
    assert.strictEqual(finalUsers.length, initialUsers.length)
  })

  test.only('User creation with missing username', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      name: 'Test User',
      password: 'password123',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(response.body.error.includes('Path `username` is required'))
    const finalUsers = await helper.usersInDb()
    assert.strictEqual(finalUsers.length, initialUsers.length)
  })
  
  test.only('User creation with missing password', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      username: 'usertest',
      name: 'Test User',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(response.body.error.includes('Password is required'))
    const finalUsers = await helper.usersInDb()
    assert.strictEqual(finalUsers.length, initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
