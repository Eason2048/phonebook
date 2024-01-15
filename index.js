const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();

const PhoneBook = require('./models/phonebook');

app.use(cors())
app.use(express.json());
app.use(express.static('build'));

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response, next) => {
    PhoneBook.find({})
        .then(books => {
            response.json(books);
        })
        .catch(error => next(error))
});

app.get('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)
    PhoneBook.find({ _id: request.params.id })
        .then(result => {
            if (result) {
                response.json(result);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    PhoneBook.find({})
        .then(result => {
        response.send(`Phonebook has info for ${result.length} people <br> ${new Date()} `);
        })
        .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
    PhoneBook.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {

    const new_person = {
        name: request.body.name,
        number: request.body.number,
    }

    PhoneBook.findByIdAndUpdate(request.params.id, new_person, { new: true })
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const new_person = request.body;

    if (new_person.name === undefined || new_person.number === undefined) {
        return response.status(400).json({ error: 'name or number is missing' });
    }

    const new_phone_book = new PhoneBook({
        name: new_person.name,
        number: new_person.number,
    })

    new_phone_book.save()
        .then(result => {
            response.json(result);
        })
        .catch(error => next(error))
})

app.use((error, request, response, next) => {
    response.status(500).send(error)
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});