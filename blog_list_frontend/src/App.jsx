import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const handlerUsernameChange = event => {
    setUsername(event.target.value)
  }
  const handlerPasswordChange = event => {
    setPassword(event.target.value)
  }

  return (
    <div>
      <Login
        username={username}
        password={password}
        onChangeUsername={handlerUsernameChange}
        onChangePassword={handlerPasswordChange}
      />
      <h2>blogs</h2>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
