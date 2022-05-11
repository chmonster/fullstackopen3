
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const loginUser = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return { 'token': token, 'id': user._id }
}

const makeTestUser = async () => {
  //await User.deleteMany({})
  const hash = await bcrypt.hash('P4ss0rF41l', 10)
  const user = new User({
    username: 'test',
    name: 'Robert J. Test',
    blogs: [],
    passwordHash: hash
  })
  await user.save()
}

const testUser = async () => {
  const user = await User.findOne({ username: 'test' })
  //console.log('testUser', user)
  return loginUser(user)
}

const nonExistingID = () => {
  return new mongoose.Types.ObjectId()
}

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

const newBlog = {
  title: 'Wilbur Jethro George is God',
  author: 'Wilbur J. George',
  url: 'https://wilburjethrogeorge.com/',
  likes: 2345
}

const newBlogNoUrlNoTitle = {
  //title: 'Wilbur Jethro George is the Devil',
  author: 'Wilbur Q. George',
  //url: 'https://wilburjethrogeorge.com/',
  likes: 666
}

const newBlogNoTitle = {
  //title: 'Wilbur Jethro George is the Devil',
  author: 'Wilbur Q. George',
  url: 'https://wilburjethrogeorge.com/',
  likes: 666
}

const newBlogNoUrl = {
  title: 'Wilbur Jethro George is the Devil',
  author: 'Wilbur Q. George',
  //url: 'https://wilburjethrogeorge.com/',
  likes: 666
}

const newBlogNoAuthor = {
  title: 'Wilbur Jethro George is the Devil',
  //author: 'Wilbur Q. George',
  url: 'https://wilburjethrogeorge.com/',
  likes: 666
}

const newBlogNoLikes = {
  title: 'Wilbur Q. George is the Devil',
  author: 'Wilbur J. George',
  url: 'https://wilburjethrogeorge.com/'
  //likes: 666
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user')
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, newBlog, newBlogNoUrl, newBlogNoTitle, newBlogNoAuthor,
  newBlogNoUrlNoTitle, newBlogNoLikes, blogsInDb, nonExistingID, makeTestUser,
  testUser
}