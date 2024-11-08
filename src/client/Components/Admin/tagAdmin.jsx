import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/tag/'); // Ensure this is the correct endpoint
                if (Array.isArray(response.data)) {
                    setTags(response.data);
                } else {
                    setTags([]);
                    console.error('API response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
                setMessage('Failed to fetch tags.');
            }
        };

        fetchTags();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/admin/tag/${id}`); // Ensure this is the correct endpoint
            setMessage('Tag deleted successfully!');
            setTags(tags.filter(tag => tag._id !== id)); // Use _id for MongoDB
        } catch (error) {
            console.error('Error deleting tag:', error);
            setMessage('Failed to delete tag.');
        }
    };

    return (
        <div>
            <h1 style={{color: 'black'}}>Tags</h1>
            {message && <p>{message}</p>}
            <Link to="/createtags">
                <button>Create New Tag</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tags.map(tag => (
                    <tr key={tag._id}>
                        <td>{tag._id}</td>
                        <td>{tag.name}</td>
                        <td>
                            <Link to={`/editTags/${tag._id}`}>
                                <button style={{marginRight: '10px'}}>Edit</button>
                            </Link>
                            <button onClick={() => handleDelete(tag._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tags;