import { getByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, expect } from 'vitest'

let container

beforeEach(() => {
  const blog = {
    title: 'Prueba de renderizado',
    author: 'Lendy',
    url: 'http://prueba',
    likes: 8,
    user: { name: 'Usuario Test' }
  }
  container = render(<Blog blog={blog} />).container
})

test("render blog's title and author but not URL or likes", () => {
  const defaultElement = screen.getByText(
    'Title: Prueba de renderizado Author: Lendy'
  )
  expect(defaultElement).toBeDefined()

  const urlElement = screen.queryByText('URL: http://prueba')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes: 8')
  expect(likesElement).toBeNull()
})

test("render blogs'url and likes when button show are clicked", async () => {
  const user = userEvent.setup()
  const button = container.querySelector('#toggleButton')
  await user.click(button)

  const urlElement = screen.getByText('URL: http://prueba')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes: 8')
  expect(likesElement).toBeDefined()
})
