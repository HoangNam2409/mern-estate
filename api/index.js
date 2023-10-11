import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;


// Connect to db
mongoose
    .connect(process.env.MONGO)
    .then(() => console.log('Connect to MongoDB successfully!'))
    .catch((error) => console.log('Error connecting to MongoDB: ', error))

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
