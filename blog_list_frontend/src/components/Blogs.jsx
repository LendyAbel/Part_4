import Blog from './Blog'

const Blogs = ({blogs, updateLikes}) => {
  return (
    <div>
      <h2 className='subtitle'>Blogs</h2>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
      ))}
    </div>
  )
}

export default Blogs
