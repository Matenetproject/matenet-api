import mongoose from 'mongoose';
import config from '../config/environment.js';

export async function connectDB() {
  const mongoURI = config.db.uri;
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
