// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';  // Ensure this matches the secret used elsewhere

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = decoded; // Attach decoded user info to request object
      next();
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = isAuthenticated;
