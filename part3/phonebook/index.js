const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const currentDate = new Date()
    console.log(currentDate)
    console.log(persons.length)
    response.send(`<p>Phonebook has information for ${persons.length} persons</p> <p>${currentDate}</p>`)
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
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000)
  return randomId
}

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post("/api/persons", postMorgan, (request, response) => {
  const body = request.body
  const personName = persons.map(persons => persons.name)
  
  if(!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
    })
  }
  else if(personName.includes(body.name)) {
    return response.status(400).json({
      error: "The name must be unique"
    })
  }
  else {
    const personToAdd = {
      id: generateId(), 
      name: body.name, 
      number: body.number,
    }

    persons = persons.concat(personToAdd)
    response.json(personToAdd)

  }
})


const port = process.env.PORT || 3001
app.listen(port, () =>
console.log(`Server running on http://localhost:${port}`)
);