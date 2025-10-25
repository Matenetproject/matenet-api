import mongoose from 'mongoose';
import config from '../config/environment.js';
import { getSecret } from '../helpers/secret-manager.js';

const { mongoUriSecretId, projectId } = config;

export async function connectDB() {
  const mongoURI = await getSecret(projectId, mongoUriSecretId);
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
