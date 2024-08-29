const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');  // Ensure this is required correctly
const AdoptionRequest = require('../models/adoption');  // Assuming you have an Adoption model

// Render the adopt-pet page with available pets
router.get('/adopt-pet', async (req, res) => {
  try {
    const petList = await Pet.find();
    res.render('form', { petList, success: '', error: '' });
  } catch (error) {
    console.error('Error fetching pet list:', error);
    res.status(500).send('An error occurred');
  }
});

// Handle adoption form submission
router.post('/adopt-pet', async (req, res) => {
  try {
    const { name, email, phone, address, pet, reason, experience } = req.body;

    // Create a new adoption request
    const newAdoptionRequest = new AdoptionRequest({
      name,
      email,
      phone,
      address,
      pet,
      reason,
      experience
    });

    await newAdoptionRequest.save();  // Save the adoption request to the database
    res.redirect('/adopt-pet?success=Adoption request submitted successfully');
  } catch (error) {
    console.error('Error submitting adoption request:', error);
    res.redirect('/adopt-pet?error=An error occurred while submitting your request');
  }
});

module.exports = router;
