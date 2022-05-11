const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
require('dotenv').config()

const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./blog_helper')

beforeEach(async () => {

  await User.deleteMany({})
  await helper.makeTestUser()
  const testUser = await helper.testUser()

  await Blog.deleteMany({})
  //console.log('beforeEach', testUser)
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, 'user': testUser.id })
    //console.log(blogObject)
    await blogObject.save()
  }

})

describe('check the entire database', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all the blogs are there', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the blogs have an id identifier', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      //console.log(blog)
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })

  test('a specific author is in the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const authors = response.body.map(r => r.author)

    expect(authors).toContain('Michael Chan')
  })
})

describe('viewing a specific blog', () => {

  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    //console.log(blogsAtStart)

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    //console.log('processedBlogToView', processedBlogToView)
    console.log('resultBlog', resultBlog.body)

    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingID()

    //console.log(validNonexistingId)

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

})

describe('addition of a new blog', () => {

  test('a fully specified blog can be added', async () => {
    const testUser = await helper.testUser()
    //console.log(testUser)
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send({ ...helper.newBlog, 'user': testUser.id })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const authors = blogsAtEnd.map(r => r.author)

    expect(authors).toHaveLength(helper.initialBlogs.length + 1)
    expect(authors).toContain('Wilbur J. George')
  })

  test('blog with short author name is not added', async () => {
    const testUser = await helper.testUser()
    //console.log(testUser)
    const shortAuthor = { ...helper.newBlog, 'author': 'OK', 'user': testUser.id }
    console.log(shortAuthor)

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send(shortAuthor)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })


  test('blog with one of title or url or author missing is added', async () => {
    const testUser = await helper.testUser()
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send({ ...helper.newBlogNoUrl, 'user': testUser.id })
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
    expect(blogsAtEnd[blogsAtEnd.length-1].title).toEqual(helper.newBlogNoUrl.title)

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send({ ...helper.newBlogNoAuthor, 'user': testUser.id })
      .expect(201)

    const blogsAtEnd0 = await helper.blogsInDb()
    expect(blogsAtEnd0).toHaveLength(helper.initialBlogs.length+2)
    expect(blogsAtEnd0[blogsAtEnd0.length-1].title).toEqual(helper.newBlogNoAuthor.title)

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send({ ...helper.newBlogNoTitle, 'user': testUser.id })
      .expect(201)

    const blogsAtEnd2 = await helper.blogsInDb()
    expect(blogsAtEnd2).toHaveLength(helper.initialBlogs.length+3)
    expect(blogsAtEnd2[blogsAtEnd2.length-1].url).toEqual(helper.newBlogNoTitle.url)
  })

  test('blog without title and url is not added', async () => {
    const testUser = await helper.testUser()
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send({ ...helper.newBlogNoUrlNoTitle, 'user': testUser.id })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })


  test('blog without likes is given likes = 0 by default', async () => {
    const testUser = await helper.testUser()
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '.concat(testUser.token))
      .send({ ...helper.newBlogNoLikes, user: testUser.id })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogToView = blogsAtEnd[blogsAtEnd.length - 1]

    //console.log(blogToView)
    expect(blogToView.author).toEqual(helper.newBlogNoLikes.author)
    expect(blogToView.likes).toEqual(0)

  })
})

describe('edit existing database', () => {

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const authors = blogsAtEnd.map(r => r.author)

    expect(authors).not.toContain(blogToDelete.author)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const blogUpdated = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    //console.log(blogUpdated)

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogUpdated)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const blogToView = blogsAtEnd[0]
    //console.log(blogToView)
    expect(blogToView.id).toEqual(blogToUpdate.id)
    expect(blogToView.likes).toEqual(blogToUpdate.likes + 1)

  })

})

afterAll(() => {
  mongoose.connection.close()
})