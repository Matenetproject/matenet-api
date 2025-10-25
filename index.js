import app from './src/config/express.js';
import user from './src/routes/user.routes.js';
import friend from './src/routes/friend.routes.js';
import auth from './src/routes/auth.routes.js';
import { connectDB } from './src/services/db.js';

await connectDB();

const PORT = process.env.PORT || 3000;

app.use('/api/users', user);
app.use('/api/friends', friend);
app.use('/api/auth', auth);

app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
