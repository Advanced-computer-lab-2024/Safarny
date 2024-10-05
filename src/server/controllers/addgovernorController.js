const User = require('../models/userModel'); // Adjust the path if necessary

const addGovernor = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new governor
        const newGovernor = await User.create({
            username,
            email,
            password,
            role: "TourismGovernor" // Ensure the role is set correctly
        });

        return res.status(201).json({ message: "Governor added successfully", governor: newGovernor });
    } catch (error) {
        console.error("Error adding governor:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { addGovernor };
