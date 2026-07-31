import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './src/config/db.js';
import connectCloudinary from './src/config/cloudinary.js';
import adminRoutes from './src/routes/adminRoutes.js';
import sellerRoutes from './src/routes/sellerRoutes.js';
import buyerRoutes from './src/routes/buyerRoutes.js';
import { setServers } from 'node:dns/promises';

// Attempt to use Google Public DNS for reliable MongoDB Atlas srv resolution on Windows ISPs
try {
  setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("Notice: Custom DNS servers could not be configured, falling back to system default DNS.");
}

const app = express();
const port = process.env.PORT || 4000;

// Initialize Database & Cloud Storage Connections
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);

// Health Check / Default Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 Real Estate Backend API server is running smoothly!'
  });
});

app.listen(port, () => {
  console.log(`🌟 Server running on PORT: ${port}`);
  console.log(`👉 Test API at: http://localhost:${port}`);
});

export default app;
