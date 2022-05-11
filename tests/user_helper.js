const User = require('../models/user')
const mongoose = require('mongoose')

const nonExistingID = () => {
  return new mongoose.Types.ObjectId()
}

const initialUsers = [
  {
    username: 'god',
    name: 'Wilbur J. George',
    password: 'holyM0ses'
  },
  {
    username: 'devil',
    name: 'Wilbur Q. George',
    password: 'pitchF0rk'
  },
  {
    username: 'cowboy',
    name: 'George Wilbur',
    password: 'G1ddyUp'
  }
]

const newUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen'
}

const newUserNoUsername = {
  //username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen'
}

const newUserNoName = {
  username: 'mluukkai',
  //name: 'Matti Luukkainen',
  password: 'salainen'
}

const newUserNoPassword = {
  username: 'mluukkai',
  name: 'Matti Luukkainen'
  //password: 'salainen'
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers, newUser, newUserNoUsername, newUserNoName, newUserNoPassword,
  usersInDb, nonExistingID
}