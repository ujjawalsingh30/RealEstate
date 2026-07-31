import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
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
    agencyName: {
      type: String,
      default: 'Independent Realtor',
      trim: true
    },
    reraNumber: {
      type: String,
      default: 'Not Provided',
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Noida Extension, Delhi NCR',
      trim: true
    },
    bio: {
      type: String,
      default: 'Senior Real Estate Consultant specializing in luxury residential apartments, villas, and commercial spaces.',
      trim: true
    },
    // Status controls Admin verification workflow: pending -> approved/rejected
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    role: {
      type: String,
      default: 'seller',
      immutable: true
    },
    propertiesCount: {
      type: Number,
      default: 0
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

const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);

export default Seller;
