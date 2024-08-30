// middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password are correct
  if (username === 'admin' && password === 'admin123') {
    next(); // Allow access to admin routes
  } else {
    res.status(401).render('login', { errorMsg: 'Unauthorized access' }); // Redirect to login with error
  }
};

module.exports = adminAuth;
