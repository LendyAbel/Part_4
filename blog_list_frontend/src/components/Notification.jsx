const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }
  return <div className={`message ${error ? 'error' : 'info'}`}>{message}</div>
}

export default Notification
