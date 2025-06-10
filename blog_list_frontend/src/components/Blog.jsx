import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleRemove = () => {
    console.log('Remove clicked')
    deleteBlog(blog.id)
  }

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const removeButtonStyle = {
    border: '3px solid red',
    backgroundColor: '#ff9191',
    borderRadius: '10px',
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
          <button style={removeButtonStyle} onClick={handleRemove}>
            remove
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Blog
