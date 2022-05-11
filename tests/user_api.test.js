const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
//require('dotenv').config()

const api = supertest(app)

const User = require ('../models/user')

const helper = require('./user_helper')

beforeEach(async () => {
  await User.deleteMany({})
  for (let user of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    let userObject = new User({ ...user, passwordHash })
    await userObject.save()
  }
})

/*beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})*/

/*describe('when there is initially one user in db', () => {

})*/

describe('adding a user to db', () => {
  // ...

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = helper.newUser
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = usersAtStart[0]

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with 400 if username too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = { ...usersAtStart[0], username: 'BS' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with 400 if password too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = { ...usersAtStart[0], password: 'BS' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})



afterAll(() => {
  mongoose.connection.close()
})