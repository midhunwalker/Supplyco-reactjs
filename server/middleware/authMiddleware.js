import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Shop from '../models/Shops.js';
import User from '../models/User.js';

// Protect middleware - verifies JWT and attaches the authenticated entity to req
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Missing authentication token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the "shop_owner" role for shops instead of "shop"
    const Model = decoded.role === 'shop_owner' ? Shop : User;
    const entity = await Model.findById(decoded.userId).select(
      decoded.role === 'shop_owner' ? '+licenseId' : '-password'
    );

    if (!entity) {
      res.status(401);
      throw new Error('Account not found');
    }

    // Attach the authenticated entity to the request based on the role.
    if (decoded.role === 'shop_owner') {
      req.shop = entity;
    } else {
      req.user = entity;
    }

    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({
      error: error.message || 'Invalid authentication token',
    });
  }
});

// ShopOwner middleware - ensures that the authenticated entity is a shop owner.
export const shopOwner = asyncHandler(async (req, res, next) => {
  if (!req.shop) {
    res.status(403);
    throw new Error('Access denied. Not a shop owner.');
  }
  next();
});
