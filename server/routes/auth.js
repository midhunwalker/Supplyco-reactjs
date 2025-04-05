import { body, validationResult } from 'express-validator';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Shop from '../models/Shops.js';

dotenv.config();
const router = express.Router();

/**
 * Handles validation errors.
 */
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

/**
 * GET /validate
 * Validates the JWT and returns minimal user/shop info.
 */
router.get('/validate', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    // Verify token using the secret from the environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let entity;

    // Select the correct model based on the role in the token
    if (decoded.role === 'user') {
      entity = await User.findById(decoded.userId).select('-password').lean();
    } else if (decoded.role === 'shop_owner') {
      entity = await Shop.findById(decoded.userId).select('-password').lean();
    } else {
      return res.status(401).json({ error: 'Invalid role in token' });
    }

    // If the entity isn't found, respond with an error
    if (!entity) {
      return res.status(401).json({ error: 'Account not found' });
    }

    // Return the user object with minimal required info
    return res.json({
      user: {
        id: entity._id,
        role: decoded.role,
        ...(decoded.role === 'user'
          ? { rationCardId: entity.rationCardId }
          : { licenseId: entity.licenseId, shopName: entity.name })
      }
    });
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});


/**
 * Common password validator.
 */
const passwordValidator = () =>
  body('password').notEmpty().withMessage('Password is required');

/**
 * POST /user/register
 * Registers a new user.
 */
router.post(
  '/user/register',
  [
    body('rationCardId')
      .trim()
      .isLength({ min: 12, max: 12 })
      .withMessage('Ration Card ID must be 12 characters'),
    passwordValidator()
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    try {
      const { rationCardId, password } = req.body;
      if (await User.exists({ rationCardId })) {
        return res.status(409).json({ error: 'Ration Card ID already registered' });
      }

      const user = await User.create({ rationCardId, password, role: 'user' });
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: { id: user._id, role: user.role, rationCardId: user.rationCardId }
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }
);

/**
 * POST /shop/register
 * Registers a new shop using the shop_owner role.
 */
router.post(
  '/shop/register',
  [
    body('licenseId')
      .trim()
      .isLength({ min: 12 })
      .withMessage('License ID must be at least 12 characters'),
    passwordValidator(),
    body('shopName').trim().notEmpty().withMessage('Shop name required'),
    body('address').trim().notEmpty().withMessage('Address required')
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    try {
      const { licenseId, password, shopName, address } = req.body;
      if (await Shop.exists({ licenseId })) {
        return res.status(409).json({ error: 'License ID already registered' });
      }

      const shop = await Shop.create({ licenseId, password, name: shopName, address });
      const token = jwt.sign(
        { userId: shop._id, role: 'shop_owner' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: { id: shop._id, role: 'shop_owner', licenseId: shop.licenseId, shopName: shop.name }
      });
    } catch (error) {
      console.error('Shop registration error:', error.message);
      return res.status(500).json({ error: 'Shop registration failed' });
    }
  }
);

/**
 * POST /user/login
 * Logs in a user.
 */
router.post(
  '/user/login',
  [
    body('rationCardId').trim().notEmpty().withMessage('Ration Card ID required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    try {
      const { rationCardId, password } = req.body;
      // Select the password field explicitly since it's excluded by default.
      const user = await User.findOne({ rationCardId }).select('+password');

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: { id: user._id, role: user.role, rationCardId: user.rationCardId }
      });
    } catch (error) {
      console.error('User login error:', error.message);
      return res.status(500).json({ error: 'Login failed' });
    }
  }
);

/**
 * POST /shop/login
 * Logs in a shop with the shop_owner role.
 */
router.post(
  '/shop/login',
  [
    body('licenseId').trim().notEmpty().withMessage('License ID required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    try {
      const { licenseId, password } = req.body;
      const shop = await Shop.findOne({ licenseId });

      if (!shop || shop.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: shop._id, role: 'shop_owner' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: { id: shop._id, role: 'shop_owner', licenseId: shop.licenseId, shopName: shop.name }
      });
    } catch (error) {
      console.error('Shop login error:', error.message);
      return res.status(500).json({ error: 'Login failed' });
    }
  }
);

export { router as authRoutes };
