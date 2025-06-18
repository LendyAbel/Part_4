import { useState } from 'react'

const Post = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handlerTitleChange = event => {
    setTitle(event.target.value)
  }
  const handlerAuthorChange = event => {
    setAuthor(event.target.value)
  }
  const handlerUrlChange = event => {
    setUrl(event.target.value)
  }
  const postNewBlogHandler = event => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
    }
    addBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2 className='subtitle'>Create new blog</h2>
      <form onSubmit={postNewBlogHandler}>
        <div>
          Title:{' '}
          <input
            id='titleInput'
            type='text'
            name='title'
            value={title}
            onChange={handlerTitleChange}
          />
        </div>
        <div>
          Author:{' '}
          <input
            id='authorInput'
            type='text'
            name='author'
            value={author}
            onChange={handlerAuthorChange}
          />
        </div>
        <div>
          Url:{' '}
          <input
            id='urlInput'
            type='text'
            name='url'
            value={url}
            onChange={handlerUrlChange}
          />
        </div>

        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default Post
