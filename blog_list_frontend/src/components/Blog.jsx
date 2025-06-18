import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, userLoggedId }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog Name: ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
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
      <div className='defalutContainer'>
        <p id='defaultInfo'>
          Title: {blog.title} Author: {blog.author}{' '}
          <button onClick={toggleVisibility} id='toggleButton'>
            {visible ? 'hide' : 'view'}
          </button>
        </p>
      </div>
      {visible ? (
        <div className='moreInfoContainer'>
          <p id='urlInfo'>URL: {blog.url}</p>
          <p id='likesInfo'>
            likes: {blog.likes}{' '}
            <button onClick={() => updateLikes(blog.id)} id='likeButton'>
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {userLoggedId === blog.user || blog.user.id ? (
            <button style={removeButtonStyle} onClick={handleRemove}>
              remove
            </button>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Blog
