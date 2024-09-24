import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:String,
    password:String,
    nationality:String,
    mobile:String,
    employed:String,
    type:String
}, {
    collection: 'datainfo',
});


const User = mongoose.model('datainfo', userSchema);
export default User;

