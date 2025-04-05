import express from 'express';
import Shop from '../models/Shops.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import { protect, shopOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper for pagination details
const getPagination = (total, page, limit) => ({
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalItems: total,
  itemsPerPage: limit,
});

/**
 * @desc    Get all shops with their products (Public)
 * @route   GET /api/shops
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      Shop.find({})
        .populate({
          path: 'products',
          select: 'name description price stock image sku category isActive'
        })
        .skip(skip)
        .limit(limit)
        .lean(),
      Shop.countDocuments()
    ]);

    res.json({
      success: true,
      data: shops,
      pagination: getPagination(total, page, limit)
    });
  })
);

/**
 * @desc    Get a single shop by ID with its products (Public)
 * @route   GET /api/shops/:id
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const shop = await Shop.findById(req.params.id)
      .populate({
        path: 'products',
        select: 'name description price stock image sku category isActive'
      })
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    res.json({ success: true, data: shop });
  })
);

/**
 * @desc    Get shop products (Public)
 * @route   GET /api/shops/:id/products
 * @access  Public
 */
router.get(
  '/:id/products',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const [products, total] = await Promise.all([
      Product.find({ shop: shop._id })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ shop: shop._id })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: getPagination(total, page, limit)
    });
  })
);

/**
 * @desc    Get shop orders with analytics (Protected, shop owner only)
 * @route   GET /api/shops/:id/orders
 * @access  Private/ShopOwner
 */
router.get(
  '/:id/orders',
  protect,
  shopOwner,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const [orders, total, analytics] = await Promise.all([
      Order.find({ shop: shop._id })
        .populate('user', 'rationCardId')
        .populate('items.product', 'name price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Order.countDocuments({ shop: shop._id }),
      Order.aggregate([
        { $match: { shop: shop._id } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$total' },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: orders,
      analytics: analytics[0] || { totalSales: 0, completedOrders: 0 },
      pagination: getPagination(total, page, limit)
    });
  })
);

export default router;
