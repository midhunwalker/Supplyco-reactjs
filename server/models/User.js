import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    rationCardId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9]{12}$/.test(v);
        },
        message: 'Ration Card ID must be 12 uppercase alphanumeric characters'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      default: 'user'
    },
    address: {
      type: String,
      trim: true
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Minimum quantity is 1'],
          default: 1
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Remove sensitive fields when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('User', userSchema);
