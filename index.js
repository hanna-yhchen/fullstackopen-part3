import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())

morgan.token('request-body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'name or number missing'
    })
    return
  }

  const existingPerson = persons.find((person) => person.name === body.name)
  if (existingPerson) {
    response.status(400).json({
      error: 'name must be unique'
    })
    return
  }

  const person = {
    id: getRandomInt(),
    name: body.name,
    number: body.number
  }
  persons.push(person)
  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(/* html */ `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${(date).toString()}</p>
  `)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

function getRandomInt (max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * max)
}
