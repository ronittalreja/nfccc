
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  description: String,
  imageUrl: String
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
