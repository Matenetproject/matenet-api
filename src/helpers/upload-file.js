import config from '../config/environment.js';
import { storage } from '../services/storage.js';

export async function uploadFileToBucket(userId, file) {
  const { bucketName } = config;
  const extension = file.originalname.split('.').pop().toLowerCase();
  const fileName = `${userId}-${Date.now()}.${extension}`;
  await storage.bucket(bucketName).file(fileName).save(file.buffer);
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}
