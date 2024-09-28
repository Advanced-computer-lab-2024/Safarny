import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Products from './Products';
import Landmarks from './Landmarks';
import Homepage from '/src/client/components/Home/Homepage';
import Footer from '/src/client/components/Footer/Footer';
import SignIn from '/src/client/Components/Signin/SignIn';
import SignUp from '/src/client/components/Signup/Signup';
// import TourGuide from './pages/TourGuide';
// import Advertiser from './pages/Advertiser';
// import Seller from './pages/Seller';
import Admin from '/src/client/components/Admin/Admin';
import TourGuideAmin from './Components/Admin/TourGuideAmin';
import TouristsAdmin from './Components/Admin/TouristsAdmin';
import SellersAdmin from './Components/Admin/SellersAdmin';
import AdvertisersAdmin from '/src/client/components/Admin/AdvertisersAdmin';
import AdminList from '/src/client/components/Admin/AdminList';
import AdminAddGovernor from '/src/client/components/Admin/AdminAddGovernor';

import Profile from '/src/client/Components/Profile/Profile';


function App() {
  // const [message, setMessage] = useState('');

  // useEffect(() => {
  //     fetchname();
  // }, []);

  // const fetchname = async () => {
    
  //     const response = await axios.get(`http://localhost:3000/first`);
  //     setMessage(response.data.name);

  // };

  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/landmarks" element={<Landmarks />} />
        {/* <Route path="/TourGuide" element={<TourGuide />} /> */}
        {/* <Route path="/Advertiser" element={<Advertiser />} /> */}
        {/* <Route path="/Seller" element={<Seller />} /> */}
        <Route path="/Admin" element={<Admin />} />
        <Route path="/tourguidesadmin" element={<TourGuideAmin />} />
        <Route path="/touristsadmin" element={<TouristsAdmin />} />
        <Route path="/sellersadmin" element={<SellersAdmin />} />
        <Route path="/advertisersadmin" element={<AdvertisersAdmin />} />
        <Route path="/adminaddgovernor" element={<AdminAddGovernor />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
  );
}

export default App;