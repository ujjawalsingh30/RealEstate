import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Super Admin',
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'superadmin']
    },
    permissions: {
      type: [String],
      default: ['all', 'manage_users', 'approve_sellers', 'manage_properties', 'view_messages']
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

// Prevent re-compilation of model in hot reload environments
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
