// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';  // Ensure this matches the secret used elsewhere

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect('/admin/login');  // Redirect to admin login if verification fails
      }
      req.user = decoded;  // Attach decoded user info to request object
      next();
    });
  } else {
    res.redirect('/admin/login');  // Redirect to admin login if no token is found
  }
};

module.exports = isAuthenticated;
