const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require("./models/person")

require('dotenv').config()

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan('tiny'))


app.get("/api/persons", (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get("/info", (request, response) => {
    const currentDate = new Date()
    console.log(currentDate)
    console.log(persons.length)
    response.send(`<p>Phonebook has information for ${Person.length} persons</p> <p>${currentDate}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  // const id = Number(request.params.id)
  // persons = Person.filter(person => person.id !== id)

  // response.status(204).end()
  Person.findById(request.params.id)
  .then(person => {
    if(person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
})

// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 1000)
//   return randomId
// }

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post("/api/persons", postMorgan, (request, response) => {
  const body = request.body
  // const personName = persons.map(persons => persons.name)
  // const personName = Person.map(persons => persons.name)
  
  if(!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
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

    // persons = persons.concat(personToAdd)
    // response.json(personToAdd)

  }
})


const PORT = process.env.PORT
app.listen(PORT, () =>
console.log(`Server running on http://localhost:${PORT}`)
);