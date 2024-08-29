const mongoose = require('mongoose');

// Define the schema for the contact data
const contactSchema = new mongoose.Schema({
  info: {
    type: String,
    required: true, // Makes this field mandatory
  },
  // Add other fields as needed
});

// Create the model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
