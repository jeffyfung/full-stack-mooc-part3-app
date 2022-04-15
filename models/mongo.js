const mongoose = require('mongoose');

const url = process.env.DB_URI
  .replace('<user>', process.env.DB_USER)
  .replace('<password>', encodeURIComponent(process.env.DB_PASSWORD));

console.log('connecting to DB...');
mongoose.connect(url)
.then(res => { console.log('connected to MongoDB') })
.catch(err => { console.log('error connecting to MongoDB:', err.message) })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
});

phonebookSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  }
});

// const contact = new Contact({
//   name: process.argv[3],
//   number: process.argv[4]
// });

// contact.save().then(res => {
//   console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
//   mongoose.connection.close()
// });

// Contact.find({}).then(res => {
//   console.log('displaying docs in contacts');
//   res.forEach(contact => {
//     console.log(`${contact.name} ${contact.number}`);
//   })
//   mongoose.connection.close();
// });

module.exports = mongoose.model('Contact', phonebookSchema);