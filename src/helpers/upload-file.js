import config from '../config/environment.js';
import { storage } from '../services/storage.js';

export async function uploadFileToBucket(userId, file) {
  const { bucketName } = config;
  const fileName = `${userId}-${Date.now()}`;
  const extension = file.originalname.split('.').pop().toLowerCase();
  await storage.bucket(bucketName).file(fileName).save(file.buffer);
  return `https://storage.googleapis.com/${bucketName}/${fileName}.${extension}`;
}
