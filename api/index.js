import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

// Connect to db
mongoose
    .connect(process.env.MONGO)
    .then(() => console.log('Connect to MongoDB successfully!'))
    .catch((error) => console.log('Error connecting to MongoDB: ', error))

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)