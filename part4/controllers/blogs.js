const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blogToAdd = new Blog(request.body)

  blogToAdd.save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter