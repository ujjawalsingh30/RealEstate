import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password']
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Sector 62, Noida',
      trim: true
    },
    bio: {
      type: String,
      default: 'Active property buyer seeking verified luxury apartments and independent villas near tech hubs.',
      trim: true
    },
    // Array of saved favorite property IDs
    wishlist: [
      {
        type: String,
        trim: true
      }
    ],
    role: {
      type: String,
      default: 'buyer',
      immutable: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Buyer = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);

export default Buyer;
