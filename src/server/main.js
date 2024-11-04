const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ViteExpress = require("vite-express");
const cors = require("cors");
const dotenv = require("dotenv");
const DB = require("./config/DB.js");

// const signUp = require("./routes/signUpRoutes.js");
// const Users = require("./routes/usersRoutes.js");
// const login = require("./routes/loginRoutes.js");
// const itinerary = require("./routes/itineraryRoutes.js");
// const Posts = require("./routes/postsRoutes.js");
// const adminRoutes = require("./routes/adminRoutes.js");
// const historicalplacesRoutes = require("./routes/historicalplacesRoutes.js");
// const tagsRoutes = require("./routes/tagsRoutes.js");
// const touristUpdate = require("./routes/touristUpdateInfoRoutes.js");
 const ActivityCategoriesRoutes = require("./routes/ActivityCategoriesRoutes.js");
 const activityRoutes = require("./routes/activityRoutes.js");

const guestRoutes = require("./routes/guestRoutes.js");
const tourGuideRoutes = require("./routes/tourGuideRoutes.js");
const touristRoutes = require("./routes/touristRoutes.js");
const sellerRoutes = require("./routes/sellerRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const ToursimGovernerRoutes = require("./routes/ToursimGovernerRoutes.js");
const AdvertiserRoutes = require("./routes/advertiserRoutes.js");
const WishListRoutes = require("./routes/WishListRoutes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT || 3000;

DB();

// app.use("/posting", Posts);
// app.use("/signup", signUp);
// app.use("/signup/addadmin", signUp);
// app.use("/users", Users);
// app.use("/login", login);
// app.use("/tourguide", tourguide);
// app.use("/touristItinerary", touristItinerary);
// app.use("/admin", adminRoutes);
// app.use("/historicalplaces", historicalplacesRoutes);
// app.use("/tag", tagsRoutes);
// app.use('/api/activities', activityRoutes);

app.use("/admin", adminRoutes);

app.use("/advertiser",AdvertiserRoutes);

app.use("/guest", guestRoutes);

app.use("/tourist", touristRoutes);

app.use("/tourguide", tourGuideRoutes);

app.use("/seller", sellerRoutes);

app.use("/toursimgovernor", ToursimGovernerRoutes);

app.use('/activities', activityRoutes);

app.use("/categories", ActivityCategoriesRoutes);

app.use("/wishlist", WishListRoutes);

ViteExpress.listen(app, 3000, () => {
  console.log(`Server running on port: ${port}`);
});
