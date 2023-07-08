const commentsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comments')

commentsRouter.get('/:id/comments', async(request, response) => {
  const comments = await Comment.find({ blogs: request.params.id })
  response.json(comments)
})

commentsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)

  const commentToAdd = new Comment({
    content: body.content,
    blogs: blog._id
  })

  if(body.content === undefined) {
    response.status(400).end()
  }
  else {
    const savedComment = await commentToAdd.save()
    response.status(201).json(savedComment)
  }
})

module.exports = commentsRouter