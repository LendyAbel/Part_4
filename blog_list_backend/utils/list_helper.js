const dummy = blogs => 1

const totalLikes = blogs => {
  const totalOfLikes = blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
  return blogs.length === 0 ? 0 : totalOfLikes
}

const favoriteBlog = blogs => {
  const favBlog = blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav),
    { likes: 0 }
  )
  return blogs.length === 0 ? 0 : favBlog
}

module.exports = { dummy, totalLikes, favoriteBlog }
