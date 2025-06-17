const { test, describe, expect, beforeEach } = require('@playwright/test')

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
        await page.locator('input[name="Username"]').fill('Lendy')
        await page.locator('input[name="Password"]').fill('asd')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Lendy Abel Sánchez logged-in')).toBeVisible()
    })

    test('fail with wrong credentials', async ({ page }) => {
        await page.locator('input[name="Username"]').fill('Lendy')
        await page.locator('input[name="Password"]').fill('wrongPassword')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })
})
