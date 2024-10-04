const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    itinerary: [{
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
    }],
    historicalPLaces: [{
      type: Schema.Types.ObjectId,
      ref: "historicalplaces",
    }],
  },
  { timestamps: true }
);

const Tags = mongoose.model("Tags", tagsSchema);
module.exports = Tags;
