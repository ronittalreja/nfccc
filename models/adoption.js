const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',  // This references the Pet model
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);

module.exports = AdoptionRequest;
