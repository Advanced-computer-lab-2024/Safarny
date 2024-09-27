import mongoose from "mongoose";

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
  },
  {
    collection: "datainfo",
  }
);

const User = mongoose.model("datainfo", userModel);
export default User;
