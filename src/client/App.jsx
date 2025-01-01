import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Header from './components/Header';
// import Products from './Products';
// import Landmarks from './Landmarks';
import Homepage from "/src/client/Components/Home/Homepage";
import Footer from "/src/client/Components/Footer/Footer";
import SignIn from "/src/client/Components/Signin/SignIn";
import SignUp from "/src/client/Components/Signup/SignUp";
import SignUpExtra from "./Components/SignupExtra/SignUpExtra";
import TourGuide from "./Pages/TourGuide";
// import Advertiser from './pages/Advertiser';
import Seller from "/src/client/Components/Seller/Seller";
import Admin from "/src/client/Components/Admin/Admin";
import TourGuideAmin from "./Components/Admin/TourGuideAmin";
import TouristsAdmin from "./Components/Admin/TouristsAdmin";
import SellersAdmin from "./Components/Admin/SellersAdmin";
import AdvertisersAdmin from "/src/client/Components/Admin/AdvertisersAdmin";
import AdminList from "/src/client/Components/Admin/AdminList";
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
import CreateHistoricalTags from "./Components/HistoricalTags/CreateHistoricalTags";
import Getcategory from "./Components/ActivityCategories/getcategory";
import CreateCategory from "./Components/ActivityCategories/createcategory";
import Editcategory from "./Components/ActivityCategories/editcategory";
import Deletecategory from "./Components/ActivityCategories/deletecategory";
//import {getActivityCategoryById} from "/src/server/controllers/activitycategoryController";
import ActivityCategory from "./Components/ActivityCategories/category";
import UpcomingActivites from "./Components/UpcomingEvents/UpcomingActivities";
import TourismGovernerAdmin from "./Components/Admin/TourismGovernerAdmin";
import EditTags from "./Components/Tags/editTags";
import UpcomingItineraries from "./Components/UpcomingEvents/UpcomingItineraries";
import ReadHistoricalPlaceDetails from "./Components/HistoricalPlace/ReadHistoricalPlaceDetails";
//import UpcomingHistoricalPlaces from './Components/UpcomingEvents/UpcomingHistoricalPlaces';
//import UpcomingItineraries from './Components/UpcomingEvents/UpcomingItineraries';
import CreateComplaints from "./Components/Complaints/CreateComplaints";
import ViewComplaints from "./Components/Complaints/ViewComplaints";
import AdminViewComplaints from "./Components/Complaints/AdminViewComplaints";
import AdminEditComplaints from "./Components/Complaints/AdminEditComplaints";
import BookFlight from "./Components/Booking/BookFlight";
import BookingHotel from "./Components/Booking/BookingHotel";
import MyBookedFlights from "./Components/Booking/MyBookedFlights";
import MyHotelBookings from "./Components/Booking/MyHotelBookings";
import UpcomingActivitesDetails from "./Components/UpcomingEvents/UpcomingActivitiesDetails";
import WishList from "./Components/WishList/WishList";
import Terms from "./Components/terms/terms";
import PurchasedProducts from "./Components/PurchasedProducts/PurchasedProducts";
//import AdminViewActivities from "./Components/UpcomingEvents/AdminViewActivities";
//import { PurchasedProductsProvider } from "./Components/PurchasedProducts/PurchasedProductsContext";
import CreateTransport from "./Components/Transport/CreateTransport";
import EditTransport from "./Components/Transport/EditTransport";
import BookTransport from "./Components/Transport/BookTransport";
import Preferences from "./Components/Preferences/Preferences";
import MyCart from "./Components/MyCart/MyCart";
import MyActivities from "./Components/MyActivities/MyActivities";
import MyBookings from "./Components/Booking/MyBookings";
import MyItineraries from "./Components/MyItineraries/MyItineraries";
import GuidePage from "./Components/GuidePage/GuidePage";
import GuidePageGuest from "./Components/GuidePage/GuidePageGuest";

// Importing new comment components
import CreateCommentForActivity from "./Components/Comments/CreateCommentForActivity";
import CreateCommentForItinerary from "./Components/Comments/CreateCommentForItinerary";
import CreateCommentForTourGuide from "./Components/Comments/CreateCommentForTourGuide";
import PasswordRecovery from "./Components/PasswordRecovery/PasswordRecovery";
import Notifications from "./Components/Notifications/Notifications";
import PaymentModal from './Components/Booking/PaymentModal';

import MyOrders from "./Components/MyOrder/MyOrders";
import Sales from "./Components/Admin/Report/Sales";
import AdvertiserSales from "./Components/Sales/Advertiser/AdvertiserSales";
import TourGuideSales from "./Components/Sales/TourGuide/TourGuideSales";
import SellerSales from "./Components/Sales/Seller/SellerSales";

function App() {
  return (
    //<PurchasedProductsProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/MyBookedHotel" element={<MyHotelBookings />} />
        <Route path="/GuidePage" element={<GuidePage />} />
        <Route path="/GuidePageGuest" element={<GuidePageGuest />} />
        <Route path="/BookFlight" element={<BookFlight />} />
        <Route path="/BookHotel" element={<BookingHotel />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/landmarks" element={<Landmarks />} /> */}
        <Route path="/TourGuide" element={<TourGuide />} />
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
        <Route path={"/getcategory/:id"} element={<getActivityCategoryById />} />
        <Route path="/createcategory" element={<CreateCategory />} />
        <Route path="/editcategory/:id" element={<Editcategory />} />
        <Route path="/deletecategory" element={<Deletecategory />} />
        <Route path={"/category/:id"} element={<ActivityCategory />} />
        <Route path="/category" element={<ActivityCategory />} />
        <Route path="/iternaries" element={<ItineraryManager />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/UpcomingActivites" element={<UpcomingActivites />} />
        <Route path={"/terms"} element={<Terms />} />
        <Route path={"/MyActivities"} element={<MyActivities />} />
        <Route path={"/MyItineraries"} element={<MyItineraries />} />
        
        <Route path="/UpcomingItineraries" element={<UpcomingItineraries />} />
        <Route
          path="/create-historical-place"
          element={<CreateHistoricalPlace />}
        />
        <Route path="/MyBookedFlights" element={<MyBookedFlights />} />
        <Route path="/historical-places" element={<ReadHistoricalPlace />} />
        <Route path="/historical-place/:id" element={<ReadHistoricalPlaceDetails />} />
        <Route path="/UpcomingActivities/:id" element={<UpcomingActivitesDetails/>} />
        <Route
          path="/update-historical-place/:id"
          element={<UpdateHistoricalPlace />}
        />
        <Route path="/payment" element={<PaymentModal />} />
        {/* <Route path="/delete-historical-place/:placeId" element={<DeleteHistoricalPlace />} /> */}
        <Route path="/historical-tags" element={<CreateHistoricalTags />} />
        <Route path="/createcomplaints" element={<CreateComplaints />} />
        <Route path="/viewcomplaints" element={<ViewComplaints />} />
        <Route path="/adminviewcomplaints" element={<AdminViewComplaints />} />
        <Route path="/admineditcomplaints" element={<AdminEditComplaints />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/PurchasedProducts" element={<PurchasedProducts />} />
        <Route path="/transportss/create-transport" element={<CreateTransport />} />
        <Route path="/transportss/edit-transport" element={<EditTransport />} />
        <Route path="/transportss/book-transport" element={<BookTransport />} />
        <Route path="/PreferencesPage" element={<Preferences />} />
        <Route path="/MyCart" element={<MyCart />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/myorders" element={<MyOrders />} />

        {/* Comments routes */}
        <Route path="/create-comment-activity/:activityId?" element={<CreateCommentForActivity />} />
        <Route path="/create-comment-itinerary/:itineraryId" element={<CreateCommentForItinerary />} />
        <Route path="/create-comment-tourguide/:tourGuideId?" element={<CreateCommentForTourGuide />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/salesReport" element={<Sales />} />
        <Route path="/Advertiser_Sales" element={<AdvertiserSales />} />
        <Route path="/TourGuideSales" element={<TourGuideSales />} />
        <Route path="/sellerSales" element={<SellerSales />} />
      </Routes>
    </Router>
    //</PurchasedProductsProvider>       

  );
}

export default App;
