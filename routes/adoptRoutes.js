// routes/adoptRoutes.js
const express = require('express');
const router = express.Router();
const Adoption = require('../models/adoption'); // Adjust path as needed

// Handle form submission
router.post('/adopt', async (req, res) => {
  const { petId, firstname, lastname, phone, email, age, address, adoptionDate, adoptionPlace, responsibility } = req.body;

  if (!petId || !firstname || !lastname || !phone || !email || !age || !address || !adoptionDate || !adoptionPlace || responsibility === undefined) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const adoption = new Adoption({
      petId,
      firstname,
      lastname,
      phone,
      email,
      age,
      address,
      adoptionDate,
      adoptionPlace,
      responsibility,
    });

    await adoption.save();
    res.redirect('/thank-you'); // Redirect to thank you page
  } catch (error) {
    console.error('Error saving adoption:', error);
    res.redirect(`/adopt?error=An error occurred`); // Redirect with error message
  }
});

module.exports = router;
