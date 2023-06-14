const supertest = require('supertest')
const helper = require('./test_helper')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcryptjs.hash('CodingisFun2023', 10)
  const user = new User({ username: 'testingUser', name: 'Developer Tester', blogs:[], passwordHash })
  await user.save()
  console.log('saved')
}, 100000)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')
  const users = await User.find({})
  const user = users[0]
  const blogObjects = helper.initialBlogs.map(blog => new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: user._id,
    likes: blog.likes ? blog.likes : 0
  }))
  const promiseArray = blogObjects.map(blog => {
    blog.save()
    user.blogs = user.blogs.concat(blog._id)
  })
  console.log('saved')
  await Promise.all(promiseArray)
  await user.save()
}, 100000)

describe('Initial Blogs stored in the database', () => {
  test('The blogs are returned as json', async () => {
    console.log('entered test')
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('The unique identifier property of the blog posts is id', async () => {
    console.log('entered test')
    const initialStateOfBlogs = await helper.blogsInDb()

    const blogToCheck = initialStateOfBlogs[0]

    const blogToReturn = await api
      .get(`/api/blogs/${blogToCheck.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogToReturn).toBeDefined()
  })
})

describe('Adding Blogs to the database', () => {
  test('Adding a valid blog by an authorized user', async () => {
    console.log('entered test')
    const authorizedUser = {
      username: 'testingUser',
      password: 'CodingisFun2023'
    }
    const loginUser = await api.post('/api/login').send(authorizedUser)

    const newBlogToAdd = {
      title: 'Top Programming Languages',
      author: 'Jimmy Butler',
      url: 'https://medium.com/the-pandadoc-tech-blog/blogs-every-developer-should-read-in-2022-19d5eda9e566',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length + 1)
    const titles = updatedBlogsDb.map(n => n.title)
    expect(titles).toContain('Top Programming Languages')
  })

  test('Adding a blog without the likes property defaults to 0', async () => {
    console.log('entered test')
    const authorizedUser = {
      username: 'testingUser',
      password: 'CodingisFun2023'
    }
    const loginUser = await api.post('/api/login').send(authorizedUser)

    const newBlogToAdd = {
      title: 'Top Places to visit in Zurich, Switzerland',
      author: 'Anjali Bisht',
      url: 'https://www.myholidays.com/blog/places-to-visit-in-zurich-switzerland/'
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length + 1)
    const updatedLikes = updatedBlogsDb.map(n => n.likes)
    expect(updatedLikes).toContain(0)
  })
})

describe('Invalid ways of format for adding a blog', () => {
  test('Blog will not be added by unauthorized user', async () => {
    console.log('entered test')
    const newBlogToAdd = {
      title: 'HUGE Change Being Discussed For WWE SummerSlam 2023',
      author: 'Andrew Pollard',
      url: 'https://whatculture.com/wwe/huge-change-being-discussed-for-wwe-summerslam-2023',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length)
    const titles = updatedBlogsDb.map(n => n.title)
    expect(titles).not.toContain('HUGE Change Being Discussed For WWE SummerSlam 2021')
  })

  test('No blog will be added without a title', async () => {
    const authorizedUser = {
      username: 'testingUser',
      password: 'CodingisFun2023'
    }
    const loginUser = await api.post('/api/login').send(authorizedUser)

    console.log('entered test')
    const newBlogToAdd = {
      author: 'Tiger Woods',
      url: 'https://www.theguardian.com/sport/blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(400)
      .set('Authorization', `Bearer ${loginUser.body.token}`)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length)
  })

  test('No blog will be added without a url', async () => {
    console.log('entered test')
    const authorizedUser = {
      username: 'testingUser',
      password: 'CodingisFun2023'
    }
    const loginUser = await api.post('/api/login').send(authorizedUser)

    const newBlogToAdd = {
      title: 'WTC 2023 Final India vs Australia',
      author: 'Ricky Pointing',
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(400)
      .set('Authorization', `Bearer ${loginUser.body.token}`)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Removing a blog from the database', () => {
  test('Deleting a blog', async () => {
    console.log('entered test')
    const authorizedUser = {
      username: 'testingUser',
      password: 'CodingisFun2023'
    }
    const loginUser = await api.post('/api/login').send(authorizedUser)

    const initialStateOfBlogs = await helper.blogsInDb()
    const blogToDelete = initialStateOfBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
      .set('Authorization', `Bearer ${loginUser.body.token}`)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length - 1)

    const titles = updatedBlogsDb.map(i => i.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})


describe('Updating a blog from the database', () => {
  test('Updating an individual blog', async () => {
    console.log('entered test')
    const initialStateOfBlogs = await helper.blogsInDb()
    const blogToUpdate = initialStateOfBlogs[0]

    const updatedBlog = {
      title: initialStateOfBlogs[0].title,
      author: initialStateOfBlogs[0].author,
      url: initialStateOfBlogs[0].url,
      likes: 247
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length)

    const prevLikeCount = initialStateOfBlogs.map(i => i.likes)
    const newLikeCount = updatedBlogsDb.map(j => j.likes)
    expect(newLikeCount).not.toContain(prevLikeCount)
  })
})

describe('Users test cases with username validation', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    console.log('cleared')

    const passwordHash = await bcryptjs.hash('CodingisFun2023', 10)
    const user = new User({ username: 'testingUser', passwordHash })
    await user.save()
    console.log('saved')
  })
  test('Adding a valid user', async() => {
    const initialUsers = await helper.usersInDb()

    const newUserToAdd = {
      username: 'jokicNuggets',
      name: 'Nikola Jokic',
      password: 'nuggetsChamps2023'
    }
    await api.post('/api/users')
      .send(newUserToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedUsersDb = await helper.usersInDb()
    expect(updatedUsersDb).toHaveLength(initialUsers.length + 1)

    const usernames = updatedUsersDb.map(u => u.username)
    expect(usernames).toContain(newUserToAdd.username)
  })
  test('Adding a user fails and gives 400 status code if username is not provided', async() => {
    const initialUsers = await helper.usersInDb()

    const newUserToAdd = {
      name: 'Nikola Jokic',
      password: 'nuggetsChamps2023'
    }

    const result = await api.post('/api/users')
      .send(newUserToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('The password and username are required to be provided')
    const updatedUsersDb = await helper.usersInDb()
    expect(updatedUsersDb).toHaveLength(initialUsers.length)
  })

  test('Adding a user fails and gives 400 status code if password is not provided', async() => {
    const initialUsers = await helper.usersInDb()

    const newUserToAdd = {
      username: 'jokicNuggets',
      name: 'Nikola Jokic'
    }

    const result = await api.post('/api/users')
      .send(newUserToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('The password and username are required to be provided')
    const updatedUsersDb = await helper.usersInDb()
    expect(updatedUsersDb).toHaveLength(initialUsers.length)
  })

  test('Adding a user fails and gives 400 status code if username is taken already', async() => {
    const initialUsers = await helper.usersInDb()

    const newUserToAdd = {
      username: 'testingUser',
      name: 'Nikola Jokic',
      password: 'nuggetsChamps2023'
    }
    const result = await api.post('/api/users')
      .send(newUserToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('expected `username` to be unique')
    const updatedUsersDb = await helper.usersInDb()
    expect(updatedUsersDb).toHaveLength(initialUsers.length)
  })

  test('Adding a user fails and gives 400 status code if username is less than 3 characters', async() => {
    const initialUsers = await helper.usersInDb()

    const newUserToAdd = {
      username: 'jo',
      name: 'Nikola Jokic',
      password: 'nuggetsChamps2023'
    }
    const result = await api.post('/api/users')
      .send(newUserToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('The username or password is required to be at least 3 characters long')
    const updatedUsersDb = await helper.usersInDb()
    expect(updatedUsersDb).toHaveLength(initialUsers.length)
  })

  test('Adding a user fails and gives 400 status code if password is less than 3 characters', async() => {
    const initialUsers = await helper.usersInDb()

    const newUserToAdd = {
      username: 'testingUser',
      name: 'Nikola Jokic',
      password: 'nu'
    }
    const result = await api.post('/api/users')
      .send(newUserToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('The username or password is required to be at least 3 characters long')
    const updatedUsersDb = await helper.usersInDb()
    expect(updatedUsersDb).toHaveLength(initialUsers.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})