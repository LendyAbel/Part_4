const Post = ({
  title,
  author,
  url,
  onChangeTitle,
  onChangeAuthor,
  onChangeUrl,
  postNewBlogHandler,
}) => {
  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={postNewBlogHandler}>
        <div>
          Title:{' '}
          <input
            type='text'
            name='title'
            value={title}
            onChange={onChangeTitle}
          />
        </div>
        <div>
          Author:{' '}
          <input
            type='text'
            name='Author'
            value={author}
            onChange={onChangeAuthor}
          />
        </div>
        <div>
          Url:{' '}
          <input
            type='text'
            name='Author'
            value={url}
            onChange={onChangeUrl}
          />
        </div>

        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default Post
