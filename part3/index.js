const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

require('dotenv').config()

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response, next) => {
  const currentDate = new Date()
  console.log(currentDate)
  // console.log(Person.length)
  // response.send(`<p>Phonebook has information for ${Person.length} persons</p> <p>${currentDate}</p>`)
  Person.find({})
    .then(result => {
      response.send(`<p>Phonebook has information for ${result.length} persons</p> <p>${currentDate}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // persons = Person.filter(person => person.id !== id)
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))})

// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 1000)
//   return randomId
// }

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post('/api/persons', postMorgan, (request, response, next) => {
  const body = request.body
  // const personName = persons.map(persons => persons.name)
  // const personName = Person.map(persons => persons.name)

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }
  // else if(personName.includes(body.name)) {
  //   return response.status(400).json({
  //     error: "The name must be unique"
  //   })
  // }
  else {
    const person = new Person ({
      // id: generateId(),
      name: body.name,
      number: body.number,
    })

    person.save().then(personToAdd => {
      response.json(personToAdd)
    })
      .catch(error => next(error))

    // persons = persons.concat(personToAdd)
    // response.json(personToAdd)

  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const {
    name, number
  } = request.body
  Person.findByIdAndUpdate(request.params.id, {
    name, number
  }, {
    new: true, runValidators: true, context: 'query'
  })
    .then(personToUpdate => {
      response.json(personToUpdate)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown Endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError') {
    return response.status(400).send({
      error: 'Malformatted ID'
    })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)