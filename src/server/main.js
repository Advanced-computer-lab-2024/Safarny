import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ViteExpress from "vite-express";
import cors from 'cors';
import dotenv from 'dotenv';
import User from './userSchema.js';// Import the default export (User model)
import DB from './config/DB.js';
dotenv.config();

//const mongourl = "mongodb+srv://omarwalid351:QqhqQqccTFDEFTtF@cluster0.qrpfb.mongodb.net/ACL";
//const mongourl = process.env.MONGO_URL;

/*if (!mongourl) {
    throw new Error("MONGO_URL is not defined in the environment variables");
}*/

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT ||3000;

/*mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch((e) => {
    console.log(e);
});*/

DB();

app.post('/signup', async (req, res) => {
    const { email, username, password,nationality,mobile,employed,type } = req.body;
    
    try {
      // Create a new user
      const newUser = new User({ email, username, password,nationality,mobile,employed,type });
      
      // Save user to the database
      await newUser.save();
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/addadmin', async (req, res) => {
    const { email, password,type ,username} = req.body;
    
    try {
      // Create a new user
      const newUser = new User({ email,password,type ,username});
      
      // Save user to the database
      console.log("hehe1");
      await newUser.save();
      console.log("hehe2");
      res.status(201).json({ message: 'UsAdminer registered successfully' });
    } catch (err) {
    console.error(err);
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/users', async (req, res) => {
    const { type } = req.query; // Get the user type from query parameters
  
    try {
      // Find users with the specified type
      const users = await User.find({ type });
  
      // Return the users found
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password,type } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'Email is incorrect' });
        }

        // Check if password matches
        if(password!=user.password){
            return res.status(500).json({ message: 'Password is incorrect ' })
        }

        res.status(200).json({
            message: 'Sign-in successful',
            type: user.type
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});



ViteExpress.listen(app, 3000, () => {
    console.log(`Server running on port: ${port}`);
});
