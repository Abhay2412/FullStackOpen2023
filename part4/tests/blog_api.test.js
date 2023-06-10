const supertest = require('supertest')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  console.log('saved')
  await Promise.all(promiseArray )

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
  test('Adding a valid blog', async () => {
    console.log('entered test')
    const newBlogToAdd = {
      title: 'Top Programming Languages',
      author: 'Jimmy Butler',
      url: 'https://medium.com/the-pandadoc-tech-blog/blogs-every-developer-should-read-in-2022-19d5eda9e566',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length + 1)
    const titles = updatedBlogsDb.map(n => n.title)
    expect(titles).toContain('Top Programming Languages')
  })

  test('Adding a blog without the likes property defaults to 0', async () => {
    console.log('entered test')
    const newBlogToAdd = {
      title: 'Top Places to visit in Zurich, Switzerland',
      author: 'Anjali Bisht',
      url: 'https://www.myholidays.com/blog/places-to-visit-in-zurich-switzerland/'
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length + 1)
    const updatedLikes = updatedBlogsDb.map(n => n.likes)
    expect(updatedLikes).toContain(0)
  })
})

describe('Invalid ways of format for adding a blog', () => {
  test('No blog will be added without a title', async () => {
    console.log('entered test')
    const newBlogToAdd = {
      author: 'Tiger Woods',
      url: 'https://www.theguardian.com/sport/blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(400)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length)
  })

  test('No blog will be added without a url', async () => {
    console.log('entered test')
    const newBlogToAdd = {
      title: 'WTC 2023 Final India vs Australia',
      author: 'Ricky Pointing',
    }

    await api
      .post('/api/blogs')
      .send(newBlogToAdd)
      .expect(400)

    const updatedBlogsDb = await helper.blogsInDb()
    expect(updatedBlogsDb).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Removing a blog from the database', () => {
  test('Deleting a blog', async () => {
    console.log('entered test')
    const initialStateOfBlogs = await helper.blogsInDb()
    const blogToDelete = initialStateOfBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

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

afterAll(async () => {
  await mongoose.connection.close()
})