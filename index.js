import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { Person } from './models/person.js'

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.static('frontend/dist'))
app.use(express.json())
app.use(cors())

morgan.token('request-body', (request, _) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

const asyncHandler = (fn) => (...args) => {
  const next = args.at(-1)
  return Promise.resolve(fn(...args)).catch(next)
}

app.get('/api/persons', asyncHandler(async (_, response) => {
  const persons = await Person.find({})
  response.json(persons)
}))

app.post('/api/persons', asyncHandler(async (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'name or number missing'
    })
    return
  }

  const existingPersonsWithSameName = await Person.find({ name: body.name })
  console.log(existingPersonsWithSameName)
  if (existingPersonsWithSameName.length > 0) {
    response.status(400).json({
      error: 'name must be unique'
    })
    return
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  await person.save()
  response.json(person)
}))

app.get('/api/persons/:id', asyncHandler(async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
}))

app.put('/api/persons/:id', asyncHandler(async (request, response) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  const updated = await Person.findByIdAndUpdate(request.params.id, person, { new: true })
  if (updated) {
    response.json(updated)
  } else {
    response.status(404).end()
  }
}))

app.delete('/api/persons/:id', asyncHandler(async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
}))

app.get('/info', asyncHandler(async (_, response) => {
  const count = await Person.countDocuments()
  const date = new Date()
  response.send(/* html */ `
  <p>Phonebook has info for ${count} people</p>
  <p>${(date).toString()}</p>
  `)
}))

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, _, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
