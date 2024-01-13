const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('build'));

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const result = persons.find(person => person.id === id);

    if (result) {
        response.json(result);
    } else {
        response.status(404).end();
    }

})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()} `);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const new_person = request.body;

    if (new_person.name === undefined || new_person.number === undefined) {
        return response.status(400).json({ error: 'name or number is missing' });
    }

    if (persons.find(person => person.name === new_person.name)) {
        return response.status(400).json({ error: 'name must be unique' });
    }

    const new_id = Math.floor(Math.random() * 1000000000);
    new_person.id = new_id;
    persons.push(new_person);

    response.json(new_person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});