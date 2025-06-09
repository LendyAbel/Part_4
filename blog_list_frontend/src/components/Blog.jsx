import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const fullBlog = () => {
    return (
      <div>
        <p>Title: {blog.title}</p>
        <p>URL: {blog.url}</p>
        <p>
          likes: {blog.likes} <button>like</button>
        </p>
        <p>Author: {blog.author}</p>
      </div>
    )
  }
  const shortBlog = () => {
    return (
      <p>
        Title: {blog.title} Author: {blog.author}
      </p>
    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {visible ? fullBlog() : shortBlog()}{' '}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
    </div>
  )
}

export default Blog
