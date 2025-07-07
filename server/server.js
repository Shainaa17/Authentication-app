import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app  = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins=['http://localhost:5173','http://localhost:5174','http://localhost:5175']

// ─── global middleware ────────────────────────────────
app.use(express.json());
app.use(cookieParser());                         // ← add ()
app.use(
  cors({
    origin:allowedOrigins,credentials: true                            // ← plural
  })
);

//API endpoints
app.get('/', (req, res) => res.send('API working'));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

// ─── start server ─────────────────────────────────────
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
