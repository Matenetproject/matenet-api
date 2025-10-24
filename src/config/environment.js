export default {
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/matenet',
  },
  pin: {
    authKeyCipherSecret:
      process.env.AUTH_KEY_CIPHER_SECRET || '1234567890abcdef1234567890abcdef', // 32 chars for AES-256
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  },
};
