const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertiserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
module.exports = Advertiser;
