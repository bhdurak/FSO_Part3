const express = require ('express')
const morgan = require ('morgan')

const app = express()

app.use(express.json())
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))



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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>\n${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(person){
    response.json(person)
  }
  else{
    response.sendStatus(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(person){
    persons = persons.filter(p => p.id !== id)
    response.status(201)
    response.send(`Person with id ${id} has been deleted`)
  }
  else{
    response.status(404)
    response.send(`Person with id ${id} not found`)
  }
})

app.post('/api/persons', (request, response) => {
  if(Object.keys(request.body).length > 0){
    if(request.body.name && request.body.number){
      if(persons.find(p => p.name === request.body.name)){
        response.status(400).json({error:'Name must be unique!'})
        return
      }
      const person = {
        id: Math.ceil(Math.random()*10000000),
        name: request.body.name,
        number: request.body.number
      }
      persons = persons.concat(person)
      response.json(person)
    }
    else{
      response.status(400).json({error:'Name and/or number is missing!'})
      return
    }
  }
  else {
    response.status(400).json({error:'Request Body not provided!'})
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'Endpoint not found'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`)
})
