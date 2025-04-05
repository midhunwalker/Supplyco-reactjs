import express from 'express';
import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/cart - Get populated cart
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price image shop',
        populate: {
          path: 'shop',
          select: 'name'
        }
      });

    res.json(cart || { items: [] });
  })
);


// PATCH /api/cart - Upsert cart item
router.patch(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    
    // Validation
    if (!productId || !Number.isInteger(quantity)) {
      return res.status(400).json({ 
        error: 'Valid product ID and numeric quantity required' 
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cart operations
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ 
        user: req.user._id, 
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = Math.min(Math.max(quantity, 1), 100);
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    const savedCart = await cart.save();
    const populatedCart = await Cart.populate(savedCart, {
      path: 'items.product',
      select: 'name price image'
    });

    res.json(populatedCart);
  })
);

// DELETE /api/cart/:productId
router.delete(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    const savedCart = await cart.save();
    const populatedCart = await Cart.populate(savedCart, {
      path: 'items.product',
      select: 'name price image'
    });

    res.json(populatedCart);
  })

   
);

export default router;