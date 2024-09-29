 //const touristModel = require('../models/userModel.js');
import User from '../models/userModel.js';
import touristModel from '../models/userModel.js';
import getProfileById from '../controllers/usersController.js';
 const updateTouristProfileById = async (req, res) => {
     const { id } = req.params; 
     const updates = req.body;  
 
     try {
         const tourist = await getProfileById(id);

 
         if (!tourist) {
             return res.status(404).json({ error: "Tourist not found" });
         }
 
         // Check if the user is trying to update 'Username' or 'WALLET'
         if (updates.username || updates.wallet) {
             return res.status(400).json({ 
                 error: "Cannot update Username or WALLET" 
             });
         }
 
         // If any other fields are being updated, proceed with the update
         const allowedUpdates = {
             email: updates.email || tourist.email,
             password: updates.password || tourist.password,
             nationalit: updates.nationalit || tourist.nationalit,
             mobile: updates.mobile || tourist.mobile,
             employed: updates.employed || tourist.employed,
             type: updates.type || tourist.type,
             age: updates.age || tourist.age,
             YearOfExp: updates.YearOfExp || tourist.YearOfExp,
             PrevWork: updates.PrevWork || tourist.PrevWork
         };
 
         const updatedTourist = await userModel.findByIdAndUpdate(
             id, 
             allowedUpdates, 
             { new: true }  
         );
 
         res.status(200).json({ message: "Profile updated successfully", updatedTourist });
 
     } catch (error) {
         res.status(400).json({ error: error.message });
     }
 };
 
 
export default updateTouristProfileById;
 
 







