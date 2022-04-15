require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const RemoteStorageContact = require('./models/mongo');

app.listen(process.env.PORT || 3001, () => {
  console.log('Server is started on 127.0.0.1:'+ (process.env.PORT || 3001))
})

morgan.token('reqBody', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '');

app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

app.get('/', (req, res) => {
  res.json({ content: 'hi'});
});

app.get('/api/persons', (req, res) => {
  RemoteStorageContact.find({}).then(contacts => res.json(contacts));
});

app.get('/info', (req, res) => {
  let html = `<p>Phonebook has info for ${persons.length} people</p>`
    + `<p>${new Date()}</p>`;
  res.send(html);
});

app.get('/api/persons/:id', (req, res) => {
  RemoteStorageContact.findById(req.params.id).then(contact => res.json(contact));
});

app.delete('/api/persons/:id', (req, res) => {
  // let targetId = Number(req.params.id);
  // persons = persons.filter(p => p.id !== targetId);
  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  if (req.body.name == undefined || req.body.number == undefined) {
    res.status(500).json({ error: "name or number cannot be empty"});
    return;
  }

  // if (persons.find(p => p.name === req.body.name)) {
  //   res.status(500).json({ error: "name must be unique"});
  //   return;
  // }

  let contact = new RemoteStorageContact({
    name: req.body.name,
    number: req.body.number,
  });
  contact.save().then(newContact => { res.json(newContact) });
})