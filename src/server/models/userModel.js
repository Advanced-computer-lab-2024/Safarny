const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: String,
    password: String,
    nationality: String,
    mobile: String,
    employed: String,
    type: String,
    age : Number,
      YearOfExp:Number,
      PrevWork:String,

  },
  {
    collection: "datainfo",
  }
);

const User = mongoose.model("datainfo", userModel);
module.exports = User;
