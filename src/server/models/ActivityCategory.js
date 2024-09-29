const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivityCategorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  activities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
});

const ActivityCategory = mongoose.model(
  "ActivityCategory",
  ActivityCategorySchema
);

module.exports = ActivityCategory;
