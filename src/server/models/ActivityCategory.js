import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ActivityCategorySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    }
});

const ActivityCategory = mongoose.model('ActivityCategory', ActivityCategorySchema);

export default ActivityCategory;