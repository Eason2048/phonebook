const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function (req) {
    return JSON.stringify(req.body)
})

const PhoneBook = require('/opt/render/project/src/models/phonebook')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
    PhoneBook.find({})
        .then(books => {
            response.json(books)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)
    PhoneBook.find({ _id: request.params.id })
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    PhoneBook.find({})
        .then(result => {
            response.send(`Phonebook has info for ${result.length} people <br> ${new Date()} `)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    PhoneBook.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const newPerson = {
        name: request.body.name,
        number: request.body.number
    }

    PhoneBook.findByIdAndUpdate(request.params.id, newPerson, { new: true, runValidators: true, context: 'query' })
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body

    if (newPerson.name === undefined || newPerson.number === undefined) {
        return response.status(400).json({ error: 'name or number is missing' })
    }

    const newPhoneBook = new PhoneBook({
        name: newPerson.name,
        number: newPerson.number
    })

    newPhoneBook.save()
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.use((error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
