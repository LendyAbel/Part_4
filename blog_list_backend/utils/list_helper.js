const dummy = blogs => 1

const totalLikes = blogs => {
  //   console.log('BLOGS: ',blogs)
  const totalOfLikes = blogs.reduce((total, blog) => {
    // console.log('DENTRO DEL REDUCE: ', blog.likes)
    // console.log('total: ', total)
    return total + blog.likes
  }, 0)
  return blogs.length === 0 ? 0 : totalOfLikes
}

const favoriteBlog = blogs =>{
  
}

module.exports = { dummy, totalLikes }
