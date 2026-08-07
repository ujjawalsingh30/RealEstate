import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  displayId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['FLAT', 'VILLA', 'COMMERCIAL']
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['For Sale', 'For Rent']
  },
  priceText: {
    type: String,
    required: true
  },
  priceVal: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  bhk: {
    type: String,
    required: true
  },
  baths: {
    type: String,
    required: true
  },
  sqft: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  furnishing: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  views: {
    type: Number,
    default: 1
  },
  isNewProperty: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  seller: {
    name: String,
    initials: String,
    verified: Boolean,
    role: String
  }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
