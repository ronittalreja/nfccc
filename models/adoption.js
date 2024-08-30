const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  adoptionDate: { type: Date, required: true },
  adoptionPlace: { type: String, required: true },
  responsibility: { type: Boolean, required: true },
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;
