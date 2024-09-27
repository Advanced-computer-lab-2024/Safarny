const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    itinerary: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
  },
  { timestamps: true }
);

const Tags = mongoose.model("Tags", tagsSchema);
module.exports = Tags;
