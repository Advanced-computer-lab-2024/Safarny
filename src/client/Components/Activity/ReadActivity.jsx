import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReadActivities = () => {
    const { userId } = useParams();
    const [activities, setActivities] = useState([]);
    const [categories, setCategories] = useState({});
    const [tags, setTags] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(`/advertiser/activities/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Activities data:", data);
                setActivities(data);
            } catch (error) {
                console.error("Error fetching activities:", error);
                setErrorMessage("Error fetching activities. Please try again later.");
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/advertiser/GetCategories');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Categories data:", data);
                const categoryMap = {};
                data.forEach(category => {
                    categoryMap[category._id] = category.type; // Mapping category ID to type
                });
                console.log("Category Map:", categoryMap); // Log the final category map
                setCategories(categoryMap);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/tag');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const tagMap = {};
                data.forEach(tag => {
                    tagMap[tag._id] = tag.name;
                });
                setTags(tagMap);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchActivities();
        fetchCategories();
        fetchTags();
    }, [userId]);

    return (
        <div>
            <h2>Activities</h2>
            {errorMessage && <p>{errorMessage}</p>}
            {activities.length === 0 ? (
                <p>No activities found for this user.</p>
            ) : (
                <ul>
                    {activities.map((activity) => (
                        <li key={activity._id}>
                            {activity.date} - {activity.location} - {activity.price}$ - {activity.time} - 
                            
                            {/* Mapping category IDs to category types */}
                            {activity.category && activity.category.length > 0 
                                ? activity.category.map(catId => {
                                    const categoryType = categories[catId]; // Get category type using ID
                                    return categoryType || "Unknown Category"; // If undefined, return "Unknown Category"
                                  }).join(", ")
                                : "No categories"} - 

                            {activity.tags && activity.tags.length > 0 
                                ? activity.tags.map(tagId => tags[tagId] || "Unknown Tag").join(", ")
                                : "No tags"} - 

                            {activity.specialDiscount} - 

                            {/* Displaying bookingOpen status */}
                            {activity.bookingOpen ? "Booking Open" : "Booking Closed"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReadActivities;
