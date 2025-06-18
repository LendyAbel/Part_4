const { test, describe, expect, beforeEach } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        username: 'Lendy',
        name: 'Lendy Abel Sánchez',
        password: 'asd',
      },
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible
    await expect(page.getByText('password')).toBeVisible
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'Lendy', 'asd')

      await expect(page.getByText('Lendy Abel Sánchez logged-in')).toBeVisible()
    })

    test('fail with wrong credentials', async ({ page }) => {
      await login(page, 'Lendy', 'wrongpassword')

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'Lendy', 'asd')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test', 'Somebody', 'someurl')

      await expect(page.getByText('Title: Test Author: Somebody')).toBeVisible()
    })

    describe('when some blogs are created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First Blog', 'First Author', 'First URL')
        await createBlog(page, 'Second Blog', 'Second Author', 'Second URL')
      })

      test('Blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes: 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })
    })
  })
})
