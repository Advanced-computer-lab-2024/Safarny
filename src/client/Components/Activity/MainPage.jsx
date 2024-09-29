import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div>
            <h1>Main Page</h1>
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
