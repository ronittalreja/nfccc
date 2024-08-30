const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const User = require('./models/user');
const Pet = require('./models/pet');
const Adoption = require('./models/adoption'); // Add this
const isAuthenticated = require('./middleware/auth');

const app = express();
const JWT_SECRET = 'your_secret_key';  // Replace with a secure key

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Registration Route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  res.render('login');
});


// GET Login Route
// GET Login Route
app.get('/login', (req, res) => {
  const errorMsg = req.query.error || ''; // Capture any error message from query parameters
  res.render('login', { errorMsg }); // Pass the errorMsg to the login view
});

// POST Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Find the user by username

    // Check if user exists and if the password matches
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token
      res.cookie('token', token, { httpOnly: true }); // Set the token as an HTTP-only cookie
      return res.redirect('/dashboard'); // Redirect to dashboard if login is successful
    } else {
      return res.redirect('/login?error=Incorrect username or password'); // Redirect to login with error message
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.redirect('/login?error=An error occurred, please try again'); // Redirect to login with a generic error message
  }
});


// Dashboard Route (protected)
app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const pets = await Pet.find();  // Fetch all pets for the dashboard
    res.render('dashboard', { pets });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).send('An error occurred');
  }
});

// Admin Pet Routes
app.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin');
});

// Add Pet
app.get('/admin/add-pet', isAuthenticated, (req, res) => {
  res.render('add-pet', { 
    success: req.query.success || '',
    error: req.query.error || ''
  });
});

app.post('/admin/add-pet', isAuthenticated, async (req, res) => {
  try {
    const { name, breed, age, description, imageUrl } = req.body;
    const newPet = new Pet({
      name,
      breed,
      age,
      description,
      imageUrl
    });
    await newPet.save();
    res.redirect('/admin/add-pet?success=Pet added successfully');
  } catch (error) {
    console.error('Error adding pet:', error);
    res.redirect('/admin/add-pet?error=An error occurred');
  }
});

// Edit Pet Route (GET)
app.get('/admin/edit-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).send('Pet not found');
    }
    res.render('edit-pet', { pet, success: req.query.success || '', error: req.query.error || '' });
  } catch (error) {
    console.error('Error fetching pet for edit:', error);
    res.status(500).send('An error occurred');
  }
});

// Edit Pet Route (POST)
app.post('/admin/edit-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const petId = req.params.id;
    const { name, breed, age, description, imageUrl } = req.body;
    await Pet.findByIdAndUpdate(petId, { name, breed, age, description, imageUrl });
    res.redirect(`/admin/edit-pet/${petId}?success=Pet updated successfully`);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.redirect(`/admin/edit-pet/${petId}?error=An error occurred`);
  }
});

// Delete Pet Route (POST)
app.post('/admin/delete-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const petId = req.params.id;
    await Pet.findByIdAndDelete(petId);
    res.redirect('/admin/pets?success=Pet deleted successfully');
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.redirect('/admin/pets?error=An error occurred');
  }
});

// Index Route
app.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();  // Fetch all pets (or adjust query as needed)
    res.render('index', { pets });   // Pass pets data to the view
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).send('An error occurred');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Static Form Route
app.get('/form', (req, res) => {
  res.render('form');
});

// Adoption Form Route (GET)
app.get('/adopt/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).send('Pet not found');
    }
    res.render('form', { pet, petId: pet._id.toString() });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).send('An error occurred');
  }
});

// Import the adoption routes
const adoptRoutes = require('./routes/adoptRoutes');
app.use('/adopt', adoptRoutes);

// Thank You Page Route
app.post('/thank-you', (req, res) => {
  res.render('thank-you');
});

// Starting the Server
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(3003, () => {
    console.log('Server is running on port 3003');
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Edit Pet Route (GET)
app.get('/admin/edit-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).send('Pet not found');
    }
    res.render('edit-pet', { pet, success: req.query.success || '', error: req.query.error || '' });
  } catch (error) {
    console.error('Error fetching pet for edit:', error);
    res.status(500).send('An error occurred');
  }
});
// Edit Pet Route (POST)
app.post('/admin/edit-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const petId = req.params.id;
    const { name, breed, age, description, imageUrl } = req.body;
    await Pet.findByIdAndUpdate(petId, { name, breed, age, description, imageUrl });
    res.redirect(`/admin/edit-pet/${petId}?success=Pet updated successfully`);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.redirect(`/admin/edit-pet/${petId}?error=An error occurred`);
  }
});
// Delete Pet Route (POST)
app.post('/admin/delete-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const petId = req.params.id;
    await Pet.findByIdAndDelete(petId);
    res.redirect('/admin/pets?success=Pet deleted successfully');
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.redirect('/admin/pets?error=An error occurred');
  }
});

// Delete Confirmation Page Route (GET)
app.get('/admin/delete-pet/:id', isAuthenticated, async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).send('Pet not found');
    }
    res.render('confirm-delete', { pet, success: req.query.success || '', error: req.query.error || '' });
  } catch (error) {
    console.error('Error fetching pet for deletion confirmation:', error);
    res.status(500).send('An error occurred');
  }
});

const adminAuth = require('./middleware/adminAuth');

// Admin Login Route
// Admin Login Route
app.get('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    // Credentials are correct, set a session or cookie and redirect to the admin dashboard
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin');
  } else {
    // Credentials are incorrect, render the login page with an error message
    res.render('admin-login', { errorMsg: 'Incorrect username or password' });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  // Check if the entered credentials match the hardcoded ones
  if (username === adminUsername && password === adminPassword) {
    // Credentials are correct, create a JWT token and set it in the cookies
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin');
  } else {
    // Credentials are incorrect, render the login page with an error message
    res.render('admin-login', { errorMsg: 'Incorrect username or password' });
  }
});

// Admin Page Route (protected)
app.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin');
});

// Other admin routes...
app.get('/admin/add-pet', isAuthenticated, (req, res) => {
  res.render('add-pet', {
    success: req.query.success || '',
    error: req.query.error || ''
  });
});
// Protect the /admin and /dashboard routes with the isAuthenticated middleware
app.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin');
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const pets = await Pet.find();  // Fetch all pets for the dashboard
    res.render('dashboard', { pets });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).send('An error occurred');
  }
});

// Add additional admin routes as needed...
