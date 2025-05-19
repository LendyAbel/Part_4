const _ = require('lodash')

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

const mostBlogs = blogs => {
  const countBlogsByAuthor = _.countBy(blogs, 'author')
  const transfromCountBlogs = _.map(countBlogsByAuthor, (count, name) => {
    return { author: name, blogs: count }
  })
  const mostCountBlogs = _.maxBy(transfromCountBlogs, 'blogs')

  return blogs.length === 0 ? 0 : mostCountBlogs
}

const mostLikes = blogs => {
  const groupAuthors = _.groupBy(blogs, 'author')
  // console.log('***Group authors***', groupAuthors)

  const authorLikes = _.map(groupAuthors, (blogs, author) => {
    // console.log('dentro del map: ')
    // console.log('BLOGS', blogs)
    // console.log('AUTHOR', author)
    const likes = _.sumBy(blogs, 'likes')
    // console.log('SUM OF LIKES', likes)
    return { author, likes }
  })
  // console.log('***authorLikes***', authorLikes)

  const mostLikesAuthor = _.maxBy(authorLikes, 'likes')
  // console.log('***mostLikesAuthor***', mostLikesAuthor)

  return blogs.length === 0 ? 0 : mostLikesAuthor
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
