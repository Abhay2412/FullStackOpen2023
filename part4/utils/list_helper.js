const _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  const numberOfLikes = blogs.map(blogs => blogs.likes)
  return numberOfLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const blogToReturnLikes = blogs.map(blogs => blogs.likes)
  const mostLikedBlog = blogToReturnLikes.indexOf(Math.max(...blogToReturnLikes))
  const mostLikeBlogContent = blogs[mostLikedBlog]

  return {
    title: mostLikeBlogContent.title,
    author: mostLikeBlogContent.author,
    likes: mostLikeBlogContent.likes,
  }
}
const mostBlogs = (blogs) => {
  const blogsAuthor = blogs.map(blogs => blogs.author)

  let mode = _.chain(blogsAuthor)
    .countBy()
    .entries()
    .maxBy(_.last)
    .thru(_.head)
    .value()
  let blogsCounter = 0
  blogsAuthor.forEach(element => {
    if (element === mode) {
      blogsCounter += 1
    }
  })
  return {
    author: mode,
    blogs: blogsCounter
  }
}

const mostLikes = (blogs) => {
  const singleAuthorBlogs = _.groupBy(blogs, 'author')
  const countLikesBlogs = _.map(singleAuthorBlogs, (arr) => {
    return {
      author: arr[0].author,
      likes: _.sumBy(arr, 'likes')
    }
  })
  const topLikedAuthor = _.maxBy(countLikesBlogs, (a) => a.likes)
  const topLikedAuthorName = _.head(_.values(topLikedAuthor))

  return {
    author: topLikedAuthorName,
    likes: topLikedAuthor.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}