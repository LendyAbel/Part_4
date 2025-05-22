const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const User = require('../models/user_model')

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

  
})
