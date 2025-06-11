import { getByText, render, screen} from '@testing-library/react'
import Blog from './Blog'

test("render blog's title and author but not URL or likes", ()=>{
    const blog = {
        title: 'Prueba de renderizado',
        author: 'Lendy',
        url: 'http://prueba'
    }

    render(<Blog blog={blog} />)

    const defaultElement = screen.getByText('Title: Prueba de renderizado Author: Lendy')
    expect(defaultElement).toBeDefined()

    const urlElement = screen.queryByText('URL: http://prueba')
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText('likes: 0')
    expect(likesElement).toBeNull()
})