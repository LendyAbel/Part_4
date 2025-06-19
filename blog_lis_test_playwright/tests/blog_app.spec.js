const { test, describe, expect, beforeEach } = require('@playwright/test')
const { login, createBlog, openAllBlogsView } = require('./helper')

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

    await request.post('/api/users', {
      data: {
        username: 'Otro',
        name: 'Otro',
        password: '123',
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
        await page
          .getByText('Title: Second Blog Author: Second Author')
          .waitFor()
      })

      test('Blog can be liked', async ({ page }) => {
        await page
          .getByRole('paragraph')
          .filter({ hasText: 'Title: First Blog Author:' })
          .locator('#toggleButton')
          .click()

        await expect(page.getByText('likes: 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })

      test('Blog can be remove', async ({ page }) => {
        await page
          .getByRole('paragraph')
          .filter({ hasText: 'Title: First Blog Author:' })
          .locator('#toggleButton')
          .click()

        await page.on('dialog', async dialog => {
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Blog deleted')).toBeVisible()
      })

      test('Another user can´t see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'Logout' }).click()
        await login(page, 'Otro', '123')
        await page
          .getByRole('paragraph')
          .filter({ hasText: 'Title: First Blog Author:' })
          .locator('#toggleButton')
          .click()
        await expect(page.getByText('remove')).not.toBeVisible()
      })

      test('Blogs are sort by likes', async ({ page }) => {
        await page
          .getByRole('paragraph')
          .filter({ hasText: 'Title: First Blog Author:' })
          .locator('#toggleButton')
          .click()
        await page
          .getByRole('paragraph')
          .filter({ hasText: 'Title: Second Blog Author:' })
          .locator('#toggleButton')
          .click()

        const initialBlogs = await page.locator('.defalutContainer').all()
        await expect(initialBlogs[0]).toContainText('First Blog')
        await expect(initialBlogs[1]).toContainText('Second Blog')

        //Like first blog 1 like
        await page
          .locator('div')
          .filter({ hasText: /^URL: First URLlikes: 0 likeremove$/ })
          .locator('#likeButton')
          .click()
        await page.getByText('likes: 1').waitFor()
        //Like second blog 2 like
        await page
          .locator('div')
          .filter({ hasText: /^URL: Second URLlikes: 0 likeremove$/ })
          .locator('#likeButton')
          .click()
        await page
          .locator('div')
          .filter({ hasText: /^URL: Second URLlikes: 1 likeremove$/ })
          .locator('#likeButton')
          .click()
        await page.getByText('likes: 2').waitFor()

        const finalBlogs = await page.locator('.defalutContainer').all()
        await expect(finalBlogs[0]).toContainText('Second Blog')
        await expect(finalBlogs[1]).toContainText('First Blog')
      })
    })
  })
})
