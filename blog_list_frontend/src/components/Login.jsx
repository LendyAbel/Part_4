const Login = ({ username, password, onChangeUsername, onChangePassword }) => {
  return (
    <div>
      <h2>Login</h2>
      <div>
        username:{' '}
        <input
          type='text'
          value={username}
          name='Username'
          onChange={onChangeUsername}
        />
      </div>
      <div>
        password:{' '}
        <input
          type='password'
          value={password}
          name='Password'
          onChange={onChangePassword}
        />
      </div>
    </div>
  )
}

export default Login
