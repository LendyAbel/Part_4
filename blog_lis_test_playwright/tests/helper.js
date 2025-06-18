const login = async (page, username, password) => {
  await page.locator('input[name="Username"]').fill(username)
  await page.locator('input[name="Password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.locator('input[name="title"]').fill(title)
  await page.locator('input[name="author"]').fill(author)
  await page.locator('input[name="url"]').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

const openAllBlogsView = async page => {
  const viewButtons = await page.getByRole('button', { name: 'view' }).all()
  viewButtons.map(async button => await button.click())
}

export { login, createBlog, openAllBlogsView }
