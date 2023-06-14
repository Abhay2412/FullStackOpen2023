const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async(request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

usersRouter.post('/', async(request, response) => {
  const { username, name, password } = request.body
  if(password === undefined || username === undefined) {
    return response.status(400).json({ error: 'The password and username are required to be provided' })
  }
  else if(password.length < 3 || username.length < 3 ) {
    return response.status(400).json({ error: 'The username or password is required to be at least 3 characters long' })
  }
  else {
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const userToSave = await user.save()
    response.status(201).json(userToSave)
  }

})

module.exports = usersRouter