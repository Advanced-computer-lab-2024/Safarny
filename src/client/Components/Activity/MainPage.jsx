import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
        if (storedUserId) {
          setUserId(storedUserId);
        }
      }, []);
    return (
        <div>
            <h1>Main Page</h1>
            {userId}
            <nav>
                <ul>
                    <li>
                        <Link to="/create">Create Activity</Link>
                    </li>
                    <li>
                        <Link to="/read">Read Activities</Link>
                    </li>
                    <li>
                        <Link to="/update">Update Activity</Link>
                    </li>
                    <li>
                        <Link to="/delete">Delete Activity</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MainPage;
