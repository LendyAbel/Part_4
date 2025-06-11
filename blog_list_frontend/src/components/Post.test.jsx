import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Post from './Post'
import { expect } from 'vitest'

test('Form event handler recived right details when a new blog is created', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  const container = render(<Post addBlog={addBlog} />).container

  const titleInput = container.querySelector('#titleInput')
  const authorInput = container.querySelector('#authorInput')
  const urlInput = container.querySelector('#urlInput')
  const submitButton = screen.getByText('Create')

  await user.type(titleInput, 'Prueba testing')
  await user.type(authorInput, 'Pepito Telles')
  await user.type(urlInput, 'http://algunurl.com')
  await user.click(submitButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('Prueba testing')
  expect(addBlog.mock.calls[0][0].author).toBe('Pepito Telles')
  expect(addBlog.mock.calls[0][0].url).toBe('http://algunurl.com')
})
