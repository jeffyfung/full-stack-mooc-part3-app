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

app.get('/api/persons', (req, res, next) => {
  RemoteStorageContact.find({})
    .then(contacts => res.json(contacts))
    .catch(next);
});

app.get('/info', (req, res, next) => {
  RemoteStorageContact.countDocuments({})
    .then(count => res.send(`<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p>`))
    .catch(next);
});

app.get('/api/persons/:id', (req, res, next) => {
  RemoteStorageContact.findById(req.params.id)
    .then(contact => res.json(contact))
    .catch(next);
});

app.put('/api/persons/:id', (req, res, next) => {
  let contact = {
    name: req.body.name,
    number: req.body.number
  };

  RemoteStorageContact.findByIdAndUpdate(req.params.id, contact, { new: true, runValidators: true, context: 'query' })
    .then(newContact => res.json(newContact))
    .catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
  RemoteStorageContact.findByIdAndRemove(req.params.id)
    .then(deletedContact => res.status(204).end())
    .catch(next);
});

app.post('/api/persons', (req, res, next) => {
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

  contact.save()
    .then(newContact => res.json(newContact))
    .catch(err => {
      console.error(err);
      res.status(400).send(err.message);
    });
});

const errHandler = (err, req, res, next) => {
  console.error(err);
  res.status(400).end();
  next(err);
}

app.use(errHandler);