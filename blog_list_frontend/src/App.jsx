import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    getBlogs()
  }, [])

  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  if (!blogs) {
    return null
  }

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const handlerUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlerPasswordChange = event => {
    setPassword(event.target.value)
  }

  const loginHandler = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('Logging in with', username, password)
    } catch (error) {
      console.log('Wrong Credentials')
    }
  }

  const logoutHandler = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsappUser')
  }

  return (
    <div>
      {user === null ? (
        <Login
          username={username}
          password={password}
          onChangeUsername={handlerUsernameChange}
          onChangePassword={handlerPasswordChange}
          loginHandler={loginHandler}
        />
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <Blogs blogs={blogs} />
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </div>
  )
}

export default App
