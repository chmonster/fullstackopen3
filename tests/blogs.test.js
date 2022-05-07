const listHelper = require('../utils/list_helper')

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const longerList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const result = listHelper.dummy(emptyList)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of the blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a longer list is the sum of the likes', () => {
    const result = listHelper.totalLikes(longerList)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('of empty list is zero', () => {
    const result = listHelper.favouriteBlog(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of the blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a longer list is the highest number of likes', () => {
    const result = listHelper.favouriteBlog(longerList)
    expect(result).toBe(12)
  })
})

describe('most prolific author', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs(emptyList)
    expect(result.author).toBe(null)
  })

  test('when list has only one blog, equals the author of the blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result.author).toBe('Edsger W. Dijkstra')
  })

  test('of a longer list is the author with the most blogs', () => {
    const result = listHelper.mostBlogs(longerList)
    expect(result.author).toBe('Robert C. Martin')
  })
})

describe('most popular author', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result.author).toBe(null)
  })

  test('when list has only one blog, equals the author of the blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result.author).toBe('Edsger W. Dijkstra')
  })

  test('of a longer list is the author with the most likes', () => {
    const result = listHelper.mostLikes(longerList)
    expect(result.author).toBe('Edsger W. Dijkstra')
  })
})