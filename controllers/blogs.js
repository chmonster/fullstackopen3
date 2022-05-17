require('dotenv').config()
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
//const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/userExtractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1, blogs: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //console.log(decodedToken)
  const user = await User.findById(request.user)
  if(!user) {
    return response.status(401).json({ error: 'user does not exist' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(request.user)
  if(!user) {
    return response.status(401).json({ error: 'user does not exist' })
  }

  const blog = await Blog.findById(request.params.id)
    .populate('user', { _id: 1 })
  if(!blog){
    return response.status(204).json({ error: 'blog not found' })
  }

  if (request.user !== blog.user.id) {
    return response.status(401).json({ error: 'user not authorized' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//blogsRouter.put('/:id', userExtractor, async (request, response) => {
blogsRouter.put('/:id', async (request, response) => {

  /*if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(request.user)
  if(!user) {
    return response.status(401).json({ error: 'user does not exist' })
  }*/

  const blogToUpdate = await Blog.findById(request.params.id)
    .populate('user', { _id: 1 })
  if(!blogToUpdate){
    return response.status(204).json({ error: 'blog not found' })
  }

  /*if (request.user !== blogToUpdate.user.id) {
    return response.status(401).json({ error: 'user not authorized' })
  }*/

  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
  //console.log(response.json(updatedBlog))
})

module.exports = blogsRouter