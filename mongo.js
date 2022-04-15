const mongoose = require('mongoose');

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Incorrect number of arguments');
  process.exit(1);
}

const user = 'admin';
const password = encodeURIComponent(process.argv[2]);
const url = `mongodb+srv://${user}:${password}@cluster0.svoyw.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Contact = mongoose.model('Contact', phonebookSchema);

if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  });

  contact.save().then(res => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
    mongoose.connection.close()
  });
} else {
  Contact.find({}).then(res => {
    console.log('displaying docs in contacts');
    res.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`);
    })
    mongoose.connection.close();
  });
}
