import { useState } from 'react'

const Login = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handlerUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlerPasswordChange = event => {
    setPassword(event.target.value)
  }

  const loginHandler = event => {
    event.preventDefault()
    login({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={loginHandler}>
      <h2 className='subtitle'>Login</h2>
      <div>
        username:{' '}
        <input
          type='text'
          value={username}
          name='Username'
          onChange={handlerUsernameChange}
        />
      </div>
      <div>
        password:{' '}
        <input
          type='password'
          value={password}
          name='Password'
          onChange={handlerPasswordChange}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default Login
