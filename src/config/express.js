import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:3000', 'https://capinet.netlify.app'], credentials: true }));
app.use(express.json());

export default app;
