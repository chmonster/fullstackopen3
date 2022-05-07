const _ = require('lodash')

const dummy = (blogs) => {
  return blogs ? 1 : 0
}

const totalLikes = (blogs) => {
  return blogs.reduce(((t, blog) => t + blog.likes), 0)
}

const favouriteBlog = (blogs) => {
  return blogs.reduce(((m, blog) => m > blog.likes ? m : blog.likes), 0)
}

const mostBlogs = (blogs) => {

  //console.log(_(blogs).countBy('author'))

  const maxAuthor = _(blogs)
    .countBy('author')
    .map((value, key) => {return { 'author': key, 'blogs': value }})
    .reduce((m, author) => m.blogs > author.blogs ? m : author, { 'author': null, 'blogs': 0 })

  return maxAuthor
}

const mostLikes = (blogs) => {
  const favAuthor = _(blogs)
    .groupBy('author')
    .map((objs, key) => {
      return { 'author': key, 'likes': _.sumBy(objs, 'likes') }
    })
    .reduce((m, author) => m.likes > author.likes ? m : author, { 'author': null, 'likes': 0 })
  return favAuthor
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostLikes, mostBlogs
}