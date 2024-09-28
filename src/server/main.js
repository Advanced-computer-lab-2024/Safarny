const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ViteExpress = require("vite-express");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/userModel.js");
const DB = require("./config/DB.js");
const signUp = require("./routes/signUpRoutes.js");
const Users = require("./routes/usersRoutes.js");
const login = require("./routes/loginRoutes.js");
const itinerary = require("./routes/itineraryRoutes.js");
const Posts = require("./routes/postsRoutes.js");
const tourguide = require("./routes/iteneraryRoutes.js");
const touristItinerary = require("./routes/touristItineraryRoutes.js");
const Posts = require("./routes/postsRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const historicalplacesRoutes = require("./routes/historicalplacesRoutes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT || 3000;
DB();

app.use("/posting", Posts);
app.use("/signup", signUp);
app.use("/signup/addadmin", signUp);
app.use("/users", Users);
app.use("/login", login);
app.use("/tourguide", tourguide);
app.use("/touristItinerary", touristItinerary);
app.use("/admin", adminRoutes);
app.use("/historicalplaces", historicalplacesRoutes);

ViteExpress.listen(app, 3000, () => {
  console.log(`Server running on port: ${port}`);
});
