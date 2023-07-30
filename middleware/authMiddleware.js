const jwt = require('jsonwebtoken');

const secrete_key = process.env.SECRET_KEY || 'my_secrete_key';

function authenticateUser(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  console.log('Received Token:', token);

  try {
    const decoded = jwt.verify(token, secrete_key);
    console.log('Decoded JWT:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
}

module.exports = {
  authenticateUser,
};
