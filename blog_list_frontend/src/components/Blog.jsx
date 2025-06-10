import { useState } from 'react'

const Blog = ({ blog, updateLikes }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
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
      <p>
        Title: {blog.title} Author: {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </p>
      {visible ? (
        <div>
          <p>URL: {blog.url}</p>
          <p>
            likes: {blog.likes}{' '}
            <button onClick={() => updateLikes(blog.id)}>like</button>
          </p>
          <p>{blog.user.name}</p>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Blog
