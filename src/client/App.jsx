import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Products from './Products';
import Landmarks from './Landmarks';
import SignIn from './SignIn';
import SignUp from './pages/SignUp';
import TourGuide from './pages/TourGuide';
import Advertiser from './pages/Advertiser';
import Seller from './pages/Seller';
import Admin from './pages/Admin/Admin';
import TourGuideAmin from './pages/Admin/TourGuideAmin';
import TouristsAdmin from './pages/Admin/TouristsAdmin';
import SellersAdmin from './pages/Admin/SellersAdmin';
import AdvertisersAdmin from './pages/Admin/AdvertisersAdmin';
import AdminList from './pages/Admin/AdminList';


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
      <Header />
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/landmarks" element={<Landmarks />} />
        <Route path="/TourGuide" element={<TourGuide />} />
        <Route path="/Advertiser" element={<Advertiser />} />
        <Route path="/Seller" element={<Seller />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/tourguidesadmin" element={<TourGuideAmin />} />
        <Route path="/touristsadmin" element={<TouristsAdmin />} />
        <Route path="/sellersadmin" element={<SellersAdmin />} />
        <Route path="/advertisersadmin" element={<AdvertisersAdmin />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
