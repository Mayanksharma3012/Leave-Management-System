import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // req.user = verified; // Attach user info to request object

    // 3. Fetch fresh user data from MongoDB
    const user = await User.findOne({ email: verified.email })
      .select('-password'); // exclude password

    if (!user) return res.status(401).json({ error: 'User not found' });

    // 4. Attach to request
    req.user = user;

    next(); // Proceed to the next route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};