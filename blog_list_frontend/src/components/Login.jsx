const Login = ({ username, password, onChangeUsername, onChangePassword, loginHandler }) => {
  return (
    <form onSubmit={loginHandler}>
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
      <button type="submit">login</button>
    </form>
  )
}

export default Login
