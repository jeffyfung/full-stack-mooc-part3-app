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

module.exports = mongoose.model('Contact', phonebookSchema);