import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from "react";
// import Header from './components/Header';
// import Products from './Products';
// import Landmarks from './Landmarks';
import Homepage from "/src/client/components/Home/Homepage";
import Footer from "/src/client/components/Footer/Footer";
import SignIn from "/src/client/Components/Signin/SignIn";
import SignUp from "/src/client/components/Signup/Signup";
import SignUpExtra from "./Components/SignupExtra/SignUpExtra";
import TourGuide from "./Pages/TourGuide";
// import Advertiser from './pages/Advertiser';
import Seller from "./Pages/Seller";
import Admin from "/src/client/components/Admin/Admin";
import TourGuideAmin from "./Components/Admin/TourGuideAmin";
import TouristsAdmin from "./Components/Admin/TouristsAdmin";
import SellersAdmin from "./Components/Admin/SellersAdmin";
import AdvertisersAdmin from "/src/client/components/Admin/AdvertisersAdmin";
import AdminList from "/src/client/components/Admin/AdminList";
import AdminAddGovernor from "/src/client/Components/Admin/AdminAddGovernor";
import CreateActivity from "/src/client/Components/Activity/CreateActivity";
import ReadActivities from "/src/client/Components/Activity/ReadActivity";
import UpdateActivity from "/src/client/Components/Activity/UpdateActivity";
import DeleteActivity from "/src/client/Components/Activity/DeleteActivity";
import MainPage from "/src/client/Components/Activity/MainPage";
import UpdateProfile from "/src/client/Components/UpdateProfile/UpdateProfile";
import Plans from "./Components/Plans/plans";
import ItineraryManager from "./Components/Itinerary/ItineraryManager";
// import Profile from '/src/client/Components/Profile/Profile';
import ProductList from "./Components/ProductView/ProductList";
import CreatePost from "./Components/Post/CreatePost";
import Search from "./Components/Search/Search";
import Profile from "./Components/Profile/Profile";
import GetTags from "./Components/Tags/getTags"; // Import the GetTags component
import CreateTags from "./Components/Tags/createTags";
import CreateHistoricalPlace from "./Components/Post/CreateHistoricalPlace";
import ReadHistoricalPlace from "./Components/HistoricalPlace/ReadHistoricalPlace"; // Correct import path for ReadHistoricalPlaceimport EditTags from './Components/Tags/editTags';
import UpdateHistoricalPlace from "./Components/HistoricalPlace/UpdateHistoricalPlace";
//import DeleteHistoricalPlace from './Components/HistoricalPlace/DeleteHistoricalPlace';
import DeleteTags from "./Components/Tags/deleteTags";
import Tags from "./Components/Tags/tags";
import CreateHistoricalTags from "./Components/HistoricalTags/CraeteHistoricalTags";
import Getcategory from "./Components/ActivityCategories/getcategory";
import CreateCategory from "./Components/ActivityCategories/createcategory";
import Editcategory from "./Components/ActivityCategories/editcategory";
import Deletecategory from "./Components/ActivityCategories/deletecategory";
import ActivityCategory from "./Components/ActivityCategories/category";
import UpcomingActivites from "./Components/UpcomingEvents/UpcomingActivities";
import TourismGovernerAdmin from "./Components/Admin/TourismGovernerAdmin";
import EditTags from "./Components/Tags/editTags";
import UpcomingItineraries from "./Components/UpcomingEvents/UpcomingItineraries";
//import UpcomingHistoricalPlaces from './Components/UpcomingEvents/UpcomingHistoricalPlaces';
//import UpcomingItineraries from './Components/UpcomingEvents/UpcomingItineraries';
import CreateComplaints from "./Components/Complaints/CreateComplaints";
import ViewComplaints from "./Components/Complaints/ViewComplaints";
import AdminViewComplaints from "./Components/Complaints/AminViewComplaints";
import AdminEditComplaints from "./Components/Complaints/AdminEditComplaints";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/landmarks" element={<Landmarks />} /> */}
        {/* <Route path="/TourGuide" element={<TourGuide />} /> */}
        {/* <Route path="/Advertiser" element={<Advertiser />} /> */}
        <Route path="/Seller" element={<Seller />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/tourguidesadmin" element={<TourGuideAmin />} />
        <Route path="/touristsadmin" element={<TouristsAdmin />} />
        <Route path="/sellersadmin" element={<SellersAdmin />} />
        <Route path="/advertisersadmin" element={<AdvertisersAdmin />} />
        <Route
          path="/tourismgoverneradmin"
          element={<TourismGovernerAdmin />}
        />
        <Route path="/adminaddgovernor" element={<AdminAddGovernor />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signupextra" element={<SignUpExtra />} />
        <Route path="/AdvertiserMain" element={<MainPage />} />
        <Route path="/create/:userId" element={<CreateActivity />} />
        <Route path="/read/:userId" element={<ReadActivities />} />
        <Route path="/update/:userId" element={<UpdateActivity />} />
        <Route path="/delete/:userId" element={<DeleteActivity />} />
        <Route path="/UpdateProfile" element={<UpdateProfile />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/gettags" element={<GetTags />} />
        <Route path="/createtags" element={<CreateTags />} />
        <Route path="/edittags/:id" element={<EditTags />} />
        <Route path="/deletetags" element={<DeleteTags />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/getcategory" element={<Getcategory />} />
        <Route path="/createcategory" element={<CreateCategory />} />
        <Route path="/editcategory/:id" element={<Editcategory />} />
        <Route path="/deletecategory" element={<Deletecategory />} />
        <Route path="/category" element={<ActivityCategory />} />
        <Route path="/iternaries" element={<ItineraryManager />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/UpcomingActivites" element={<UpcomingActivites />} />
        <Route path="/UpcomingItineraries" element={<UpcomingItineraries />} />
        <Route
          path="/create-historical-place"
          element={<CreateHistoricalPlace />}
        />
        <Route path="/historical-places" element={<ReadHistoricalPlace />} />
        <Route
          path="/update-historical-place/:id"
          element={<UpdateHistoricalPlace />}
        />
        {/* <Route path="/delete-historical-place/:placeId" element={<DeleteHistoricalPlace />} /> */}
        <Route path="/historical-tags" element={<CreateHistoricalTags />} />
        <Route path="/createcomplaints" element={<CreateComplaints />} />
        <Route path="/viewcomplaints" element={<ViewComplaints />} />
        <Route path="/adminviewcomplaints" element={<AdminViewComplaints />} />
        <Route path="/admineditcomplaints" element={<AdminEditComplaints />} />
      </Routes>
    </Router>
  );
}

export default App;
