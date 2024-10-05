const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    itinerary: [
      {
        type: Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    historicalPLaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "historicalplaces",
      },
    ],
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],

    //Admin/TourismGovernor
    createdby: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Tags = mongoose.model("Tags", tagsSchema);
module.exports = Tags;
