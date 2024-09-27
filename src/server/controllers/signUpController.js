import AsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import TourGuide from '../models/tourGuide.js';


const signUp = AsyncHandler(async (req, res) => {
    const { email, username, password,nationality,mobile,employed,type,age } = req.body;

    try {
        // Create a new user
        const newUser = new User({ email, username, password,nationality,mobile,employed,type,age });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const signUpOthers = AsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Create a new tour guide
        const newTourGuide = new TourGuide({ email, username, password });

        // Save tour guide to the database
        await newTourGuide.save();

        res.status(201).json({ message: 'Tour guide registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


const addAdmin = AsyncHandler(async (req, res) => {
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



export { signUp, signUpOthers,addAdmin };