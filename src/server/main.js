import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import ViteExpress from "vite-express";
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/userModel.js';// Import the default export (User model)
import DB from './config/DB.js';
import signUp from './routes/signUpRoutes.js';
import Users from './routes/usersRoutes.js';
import login from './routes/loginRoutes.js';
import tourguide from './routes/iteneraryRoutes.js';
import touristItinerary from './routes/touristItineraryRoutes.js';
import Posts from './routes/postsRoutes.js'
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT ||3000;
DB();


app.use('/posting',Posts)
app.use('/signup',signUp)
app.use('/signup/addadmin',signUp)
app.use('/users',Users)
app.use('/login',login)
app.use('/tourguide',tourguide)
app.use('/touristItinerary', touristItinerary)


ViteExpress.listen(app, 3000, () => {
  console.log(`Server running on port: ${port}`);
});
