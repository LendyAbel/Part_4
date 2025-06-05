import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import Login from './components/Login'
import Post from './components/Post'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error,setError] = useState('false')

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

  if (!blogs) {
    return null
  }

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const showNotification = (message, isError=false) => {
    setError(isError)
    setMessage(message)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handlerUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlerPasswordChange = event => {
    setPassword(event.target.value)
  }

  const handlerTitleChange = event => {
    setTitle(event.target.value)
  }

  const handlerAuthorChange = event => {
    setAuthor(event.target.value)
  }

  const handlerUrlChange = event => {
    setUrl(event.target.value)
  }

  const loginHandler = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
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

  const addBlog = async event => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
    }
    try{
      const returnedBlog = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`New blog added: ${returnedBlog.title} ${returnedBlog.author}`)
    }catch(error){
      console.log(error)
      showNotification('Blog could not be added', true)
    }
  }



  return (
    <div>
      {message && <Notification message={message} error={error} />}

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
          <Post
            title={title}
            author={author}
            url={url}
            onChangeTitle={handlerTitleChange}
            onChangeAuthor={handlerAuthorChange}
            onChangeUrl={handlerUrlChange}
            postNewBlogHandler={addBlog}
          />
          <Blogs blogs={blogs} />
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </div>
  )
}

export default App
