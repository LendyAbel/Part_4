import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import Login from './components/Login'
import Post from './components/Post'
import ToggleVisibility from './components/ToggleVisibility'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('false')

  const createBlogFormRef = useRef()

  useEffect(() => {
    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const showNotification = (message, isError = false) => {
    setError(isError)
    setMessage(message)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const loginHandler = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      showNotification('Loggin succefully')
      console.log('Logging in with', username, password)
    } catch (error) {
      showNotification('Wrong credentials', true)
      console.log('Wrong Credentials')
    }
  }

  const logoutHandler = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsappUser')
    showNotification('Logout sucefully')
  }

  const addBlog = async newBlog => {
    try {
      const returnedBlog = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      createBlogFormRef.current.toggleVisibility()
      showNotification(
        `New blog added: ${returnedBlog.title} ${returnedBlog.author}`
      )
    } catch (error) {
      console.log(error)
      showNotification('Blog could not be added', true)
    }
  }

  const updateLikes = async id => {
    try {
      const blog = blogs.find(blog => blog.id === id)
      const updatedBlog = { ...blog, user: blog.user.id, likes: blog.likes + 1 }
      const returnedBlog = await blogService.updateBlog(id, updatedBlog)

      setBlogs(
        blogs.map(blog =>
          blog.id !== id ? blog : { ...returnedBlog, user: blog.user }
        )
      )
    } catch (error) {
      console.log('ERROR: ', error)
    }
  }

  const deleteBlog = async id => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('Blog deleted')
      console.log(`BLOG WITH ID: ${id} DELETED`)
    } catch (error) {
      console.log(error.response.data.error)
    }
  }

  return (
    <div>
      {message && <Notification message={message} error={error} />}

      {user === null ? (
        <Login login={loginHandler} />
      ) : (
        <div>
          <p>
            {user.name} logged-in{' '}
            <button onClick={logoutHandler}>Logout</button>
          </p>
          <ToggleVisibility
            buttonLabel='Create new blog'
            ref={createBlogFormRef}
          >
            <Post addBlog={addBlog} />
          </ToggleVisibility>
        </div>
      )}
      <Blogs
        blogs={blogs}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        userLoggedId={user?.id}
      />
    </div>
  )
}

export default App
