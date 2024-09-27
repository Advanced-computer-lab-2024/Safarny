import User from "../models/userModel.js";
import AsyncHandler from 'express-async-handler';  // Ensure this import is here
const addGovernor = AsyncHandler(async (req, res) => {
    const { username, email, password, nationality, mobile, employed } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        // Create the new tourism governor
        const newGovernor = await User.create({
            username,
            email,
            password,
            nationality,
            mobile,
            employed,
            type: 'governor'
        });

        // Return the created governor user
        return res.status(201).json(newGovernor);
    } catch (err) {
        console.error('Error adding governor:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});
export { addGovernor }; 
