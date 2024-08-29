const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const User = require('./models/user');
const Pet = require('./models/pet');
const isAuthenticated = require('./middleware/auth');

const app = express();
const JWT_SECRET = 'your_secret_key';  // Use a secure key

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

app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, Phoneno } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      Phoneno,
      password: hashedPassword
    });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.redirect('/register');
  }
});

// Login Route
app.get('/login', (req, res) => {
  const errorMsg = req.query.error || '';
  res.render('login', { errorMsg });
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard');
    } else {
      res.redirect('/login?error=Incorrect username or password');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.redirect('/login?error=An error occurred, please try again');
  }
});

// Dashboard Route (protected)
app.get('/dashboard', async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.redirect('/login');
      }

      try {
        const pets = await Pet.find();  // Fetch all pets for the dashboard
        res.render('dashboard', { pets });
      } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).send('An error occurred');
      }
    });
  } else {
    res.redirect('/login');
  }
});

// Admin Pet Add Route
app.get('/admin/add-pet', (req, res) => {
  res.render('add-pet', { 
    success: req.query.success || '',
    error: req.query.error || ''
  });
});

app.post('/admin/add-pet', async (req, res) => {
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

// Example POST route to /dashboard
app.post('/dashboard', (req, res) => {
  const data = req.body;
  // Process the data here
  res.status(200).send('Dashboard data received successfully');
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

// Starting the Server
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(3002, () => {
    console.log('Server is running on port 3002');
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

