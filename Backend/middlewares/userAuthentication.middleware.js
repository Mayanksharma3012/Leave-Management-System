import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified; // Attach user info to request object
    next(); // Proceed to the next route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};