import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './SideBar.css'; // Custom CSS for styling

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <Button onClick={() => navigate('/admin')}>
        HomePage
      </Button>
      <Button onClick={() => navigate('/tourguidesadmin')}>
        Tour Guides
      </Button>
      <Button onClick={() => navigate('/touristsadmin')}>
        Tourists
      </Button>
      <Button onClick={() => navigate('/sellersadmin')}>
        Sellers
      </Button>
      <Button onClick={() => navigate('/advertisersadmin')}>
        Advertisers
      </Button>
      <Button onClick={() => navigate('/adminlist')}>
        Admins
      </Button>
      <Button onClick={() => navigate('/tourismgovernoradmin')}>
        Tourism Governor
      </Button>
    </div>
  );
};

export default SideBar;
