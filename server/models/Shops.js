import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    licenseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.length >= 12;
        },
        message: 'License ID must be at least 12 characters'
      }
    },
    password: {
      type: String,
      required: true
      // Note: For testing purposes, passwords are stored in plain text.
    },
    role: {
      type: String,
      enum: ['shop_owner'],
      required: true,
      default: 'shop_owner'
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Shop', shopSchema, 'shops');
