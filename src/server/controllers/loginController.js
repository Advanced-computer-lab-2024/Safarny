const User = require("../models/userModel.js");
const AsyncHandler = require('express-async-handler');

const login = AsyncHandler(async (req, res) => {
    const { email, password, type } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'Email is incorrect' });
        }

        // Check if password matches
        if (password != user.password) {
            return res.status(500).json({ message: 'Password is incorrect ' });
        }

        res.status(200).json({
            message: 'Sign-in successful',
            id: user._id,
            type: user.type
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = login;