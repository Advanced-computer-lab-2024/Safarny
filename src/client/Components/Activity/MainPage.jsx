import React, { useState, useEffect } from 'react';
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
            {userId && <p>User ID: {userId}</p>}
            <nav>
    <ul>
        <li>
            <Link to={`/create/${userId}`}>Create Activity</Link>
        </li>
        <li>
            <Link to={`/read/${userId}`}>My Activities</Link>
        </li>
        <li>
            <Link to={`/update/${userId}`}>Update Activity</Link>
        </li>
        <li>
            <Link to={`/delete/${userId}`}>Delete Activity</Link>
        </li>
    </ul>
</nav>
        </div>
    );
};

export default MainPage;
