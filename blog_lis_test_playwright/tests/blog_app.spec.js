const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible
    await expect(page.getByText('password')).toBeVisible
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible
  })
})
