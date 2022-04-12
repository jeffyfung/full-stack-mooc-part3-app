const express = require('express');
const app = express();
const {v4: uuidv4} = require('uuid');
const morgan = require('morgan');
require('dotenv').config();

app.listen(process.env.PORT || 3001, () => {
  console.log('Server is started on 127.0.0.1:'+ (process.env.PORT || 3001))
})

morgan.token('reqBody', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '');

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

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
];

app.get('/', (req, res) => {
  res.json({ content: 'hi'});
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  let html = `<p>Phonebook has info for ${persons.length} people</p>`
    + `<p>${new Date()}</p>`;
  res.send(html);
});

app.get('/api/persons/:id', (req, res) => {
  let targetId = Number(req.params.id);
  let targetEntry = persons.find(p => p.id === targetId);
  if (targetEntry) {
    res.json(targetEntry);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  let targetId = Number(req.params.id);
  persons = persons.filter(p => p.id !== targetId);
  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  if (req.body.name == undefined || req.body.number == undefined) {
    res.status(500).json({ error: "name or number cannot be empty"});
    return;
  }

  if (persons.find(p => p.name === req.body.name)) {
    res.status(500).json({ error: "name must be unique"});
    return;
  }

  let newPerson = {
    id: uuidv4(),
    name: req.body.name,
    number: req.body.number
  }
  persons = persons.concat(newPerson);
  res.json(newPerson);
})