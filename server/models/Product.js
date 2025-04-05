import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0.01, 'Price must be at least 0.01']
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          // Ensure URL starts with http or https and ends with one of the valid extensions
          return /^(https?:\/\/).+\.(jpg|jpeg|png|webp)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL`
      }
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9-]{3,20}$/.test(v);
        },
        message: 'SKU must be 3-20 alphanumeric characters with hyphens'
      }
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop', // Reference to the Shop model
      required: [true, 'Product must belong to a shop']
    },
    category: {
      type: String,
      enum: {
        values: ['groceries', 'essentials', 'hygiene', 'medical', 'other'],
        message: 'Invalid product category'
      },
      default: 'other'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster querying
productSchema.index({ shop: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

// Query middleware to automatically populate shop info on find queries
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'shop',
    select: 'name address'
  });
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
