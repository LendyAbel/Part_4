import Blog from './Blog'

const Blogs = ({ blogs, updateLikes }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2 className='subtitle'>Blogs</h2>
      {sortedBlogs.map(blog => (
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
      ))}
    </div>
  )
}

export default Blogs
