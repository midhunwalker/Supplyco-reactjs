import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true  // Index defined here; no need for duplicate declaration below
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
          validate: {
            validator: async function(productId) {
              const product = await mongoose.model('Product').findById(productId);
              return !!product;
            },
            message: 'Product does not exist'
          }
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity cannot be less than 1'],
          max: [100, 'Quantity cannot exceed 100 units']
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Automated population for all find queries
cartSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.product',
    select: 'name price image sku shop isActive',
    populate: {
      path: 'shop',
      select: 'name address'
    }
  });
  next();
});

// Index for the 'items.product' field remains for optimized query performance
cartSchema.index({ 'items.product': 1 });

export default mongoose.model('Cart', cartSchema);
